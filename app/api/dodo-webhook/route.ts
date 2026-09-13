/* Dodo Payments webhook: the only place a paid seat is created. Verifies
   the Standard Webhooks signature, then commits a name-only sponsor entry
   to the repo. The claim form only decorates the seat afterwards. Returns
   2xx only after a successful (or duplicate) commit so Dodo retries on
   transient failures. */

import { orbitSeatProductId } from "@/config/sponsors";
import { commitSponsor } from "@/lib/sponsor-store";
import { NextResponse } from "next/server";
import { Webhook } from "standardwebhooks";

export const dynamic = "force-dynamic";

const WEBHOOK_KEY = process.env.DODO_WEBHOOK_KEY;

interface PaymentPayload {
  type?: string;
  data?: {
    payment_id?: string;
    status?: string;
    created_at?: string;
    customer?: { name?: string };
    product_cart?: Array<{ product_id?: string }>;
  };
}

export async function POST(request: Request) {
  if (!WEBHOOK_KEY) {
    console.error("dodo-webhook: DODO_WEBHOOK_KEY is not set");
    return new Response("Webhook is not configured.", { status: 500 });
  }

  const rawBody = await request.text();
  const webhook = new Webhook(WEBHOOK_KEY);

  try {
    webhook.verify(rawBody, {
      "webhook-id": request.headers.get("webhook-id") ?? "",
      "webhook-signature": request.headers.get("webhook-signature") ?? "",
      "webhook-timestamp": request.headers.get("webhook-timestamp") ?? "",
    });
  } catch (error) {
    console.error("dodo-webhook: signature verification failed", error);
    return new Response("Invalid signature.", { status: 400 });
  }

  let payload: PaymentPayload;
  try {
    payload = JSON.parse(rawBody) as PaymentPayload;
  } catch {
    return new Response("Invalid payload.", { status: 400 });
  }

  // Non-terminal events (failed, processing, cancelled) are acknowledged
  // and ignored: only a succeeded payment earns a seat.
  if (payload.type !== "payment.succeeded") {
    return new Response(null, { status: 200 });
  }

  const data = payload.data;
  const paymentId = data?.payment_id;
  if (!data || !paymentId || data.status !== "succeeded") {
    return new Response(null, { status: 200 });
  }

  if (
    orbitSeatProductId &&
    !data.product_cart?.some((item) => item.product_id === orbitSeatProductId)
  ) {
    console.error(
      `dodo-webhook: payment ${paymentId} is not for the orbit seat product`,
    );
    return new Response(null, { status: 200 });
  }

  const result = await commitSponsor({
    paymentId,
    name: data.customer?.name?.trim().slice(0, 60) || "Sponsor",
    date: data.created_at?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
  });

  if (!result) {
    return new Response("Could not record the sponsor.", { status: 500 });
  }

  // "duplicate" is a retried webhook for an already-recorded payment, which
  // is success as far as Dodo is concerned.
  return NextResponse.json({ ok: true, result }, { status: 200 });
}
