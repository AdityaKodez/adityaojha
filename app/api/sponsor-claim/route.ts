/* Claim form backend: decorates a paid seat with display name, URL and an
   optional logo. The payment is re-verified against the Dodo API rather
   than trusting the form, and the seat must already exist (the webhook
   created it) and not be claimed yet. */

import { orbitSeatProductId } from "@/config/sponsors";
import {
  commitLogo,
  commitSponsorClaim,
  resolveClaimablePayment,
  type ClaimPatch,
} from "@/lib/sponsor-store";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const API_KEY = process.env.DODO_PAYMENTS_API_KEY;
const DODO_BASE =
  process.env.DODO_PAYMENTS_MODE === "test"
    ? "https://test.dodopayments.com"
    : "https://live.dodopayments.com";

const MAX_LOGO_BYTES = 512 * 1024;
const ACCEPTED_LOGO_TYPES = ["image/png", "image/jpeg", "image/webp"];

function error(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

async function dodoGet(path: string): Promise<Response | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    return await fetch(`${DODO_BASE}${path}`, {
      signal: controller.signal,
      headers: { Authorization: `Bearer ${API_KEY}` },
    }).finally(() => clearTimeout(timeout));
  } catch {
    return null;
  }
}

/** Dodo list endpoints may return `{ items: [...] }`; be defensive. */
function listItems(data: unknown): Array<Record<string, unknown>> {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray((data as { items?: unknown }).items)) {
    return (data as { items: Array<Record<string, unknown>> }).items;
  }
  return [];
}

function hasOrbitSeat(payment: Record<string, unknown>): boolean {
  if (!orbitSeatProductId) return true;
  const cart = payment.product_cart;
  return (
    Array.isArray(cart) &&
    cart.some(
      (item) =>
        item && (item as { product_id?: string }).product_id === orbitSeatProductId,
    )
  );
}

/**
 * Resolves an email to the newest succeeded orbit-seat payment ids, via
 * Dodo's customer lookup followed by their payment list. The email is
 * used for the lookup only, it is never stored anywhere.
 */
async function findPaidPaymentsByEmail(email: string): Promise<string[]> {
  const customersResponse = await dodoGet(
    `/customers?email=${encodeURIComponent(email)}`,
  );
  if (!customersResponse?.ok) return [];

  const customers = listItems(await customersResponse.json().catch(() => null));
  const customerId = customers[0]?.customer_id;
  if (typeof customerId !== "string") return [];

  const paymentsResponse = await dodoGet(
    `/payments?customer_id=${encodeURIComponent(customerId)}&status=succeeded&limit=100`,
  );
  if (!paymentsResponse?.ok) return [];

  const payments = listItems(await paymentsResponse.json().catch(() => null));
  return payments
    .filter(hasOrbitSeat)
    .sort((a, b) =>
      String(b.created_at ?? b.payment_time ?? "").localeCompare(
        String(a.created_at ?? a.payment_time ?? ""),
      ),
    )
    .map((payment) => payment.payment_id)
    .filter((id): id is string => typeof id === "string");
}

async function verifyPayment(paymentId: string): Promise<string | null> {
  if (!API_KEY) return "Payments are not configured.";

  const response = await dodoGet(`/payments/${paymentId}`);
  if (!response) return "The payment could not be verified. Try again.";

  if (response.status === 404) {
    return "That payment id does not match a payment.";
  }
  if (!response.ok) {
    return "The payment could not be verified. Try again.";
  }

  const payment = (await response.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  if (!payment) return "The payment could not be verified. Try again.";

  if (payment.status !== "succeeded") {
    return "This payment has not completed yet.";
  }
  if (!hasOrbitSeat(payment)) {
    return "This payment is not for an orbit seat.";
  }

  return null;
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return error("Invalid form submission.", 400);
  }

  const paymentIdInput = String(form.get("paymentId") ?? "").trim();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return error("That email address does not look valid.", 400);
  }

  // Payment id wins when present (it arrives pre-filled from the checkout
  // redirect); otherwise the payment is found by the email paid with.
  let candidates: string[];
  if (paymentIdInput) {
    if (paymentIdInput.length > 100) {
      return error("A valid payment id is required.", 400);
    }
    const paymentError = await verifyPayment(paymentIdInput);
    if (paymentError) return error(paymentError, 409);
    candidates = [paymentIdInput];
  } else if (email) {
    if (!API_KEY) return error("Payments are not configured.", 503);
    candidates = await findPaidPaymentsByEmail(email);
    if (!candidates.length) {
      return error(
        "No completed orbit seat payment found for that email.",
        409,
      );
    }
  } else {
    return error(
      "Add the email you paid with, or the payment id from your receipt.",
      400,
    );
  }

  const resolved = await resolveClaimablePayment(candidates);
  if (resolved === "not-found") {
    return error(
      "The seat is not registered yet. It appears a minute or two after payment, then you can claim it.",
      409,
    );
  }
  if (resolved === "already-claimed") {
    return error("This seat has already been claimed.", 409);
  }
  if (!resolved || !resolved.paymentId) {
    return error("The claim could not be saved. Try again.", 502);
  }
  const paymentId = resolved.paymentId;

  const name = String(form.get("name") ?? "").trim().slice(0, 60);
  const rawUrl = String(form.get("url") ?? "").trim().slice(0, 300);
  let url: string | undefined;
  if (rawUrl) {
    const parsed = URL.parse(rawUrl);
    if (!parsed || !["http:", "https:"].includes(parsed.protocol)) {
      return error("The URL must start with http:// or https://.", 400);
    }
    url = parsed.toString();
  }

  const logo = form.get("logo");
  if (logo !== null && !(logo instanceof File)) {
    return error("Invalid logo upload.", 400);
  }
  if (logo instanceof File && logo.size > 0) {
    if (!ACCEPTED_LOGO_TYPES.includes(logo.type)) {
      return error("Logos must be PNG, JPEG or WebP.", 415);
    }
    if (logo.size > MAX_LOGO_BYTES) {
      return error("Logos must be 512KB or smaller.", 413);
    }
  }

  const patch: ClaimPatch = {};
  if (name) patch.name = name;
  if (url) patch.url = url;

  if (logo instanceof File && logo.size > 0) {
    const bytes = Buffer.from(await logo.arrayBuffer());
    const logoPath = await commitLogo(paymentId, bytes, logo.type);
    if (!logoPath) {
      return error("The logo could not be saved. Try again.", 502);
    }
    patch.logo = logoPath;
  }

  const result = await commitSponsorClaim(paymentId, patch);
  switch (result) {
    case "committed":
      return NextResponse.json({ ok: true }, { status: 200 });
    case "not-found":
      return error(
        "The seat is not registered yet. It appears a minute or two after payment, then you can claim it.",
        409,
      );
    case "already-claimed":
      return error("This seat has already been claimed.", 409);
    default:
      return error("The claim could not be saved. Try again.", 502);
  }
}
