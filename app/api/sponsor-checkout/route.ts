/* Creates a Dodo checkout session for the $5 orbit seat and redirects the
   visitor to the hosted checkout. Used as a plain link target so the client
   never touches the Dodo SDK and no checkout script enters the bundle. */

import { orbitSeatProductId } from "@/config/sponsors";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const API_KEY = process.env.DODO_PAYMENTS_API_KEY;
const DODO_BASE =
  process.env.DODO_PAYMENTS_MODE === "test"
    ? "https://test.dodopayments.com"
    : "https://live.dodopayments.com";

export async function GET(request: Request) {
  if (!API_KEY || !orbitSeatProductId) {
    return new Response("Sponsor checkout is not configured yet.", {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }

  try {
    const returnUrl = new URL("/sponsor/claim", request.url).toString();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    const response = await fetch(`${DODO_BASE}/checkouts`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_cart: [{ product_id: orbitSeatProductId, quantity: 1 }],
        return_url: returnUrl,
        metadata: { source: "orbit-seat" },
      }),
    }).finally(() => clearTimeout(timeout));

    if (!response.ok) {
      console.error(
        `sponsor-checkout: dodo responded ${response.status}`,
        await response.text().catch(() => ""),
      );
      return new Response("Checkout could not be created. Try again.", {
        status: 502,
        headers: { "Cache-Control": "no-store" },
      });
    }

    const data = (await response.json()) as { checkout_url?: string };
    if (!data.checkout_url) {
      return new Response("Checkout could not be created. Try again.", {
        status: 502,
        headers: { "Cache-Control": "no-store" },
      });
    }

    return NextResponse.redirect(data.checkout_url, 302);
  } catch (error) {
    console.error("sponsor-checkout:", error);
    return new Response("Checkout could not be created. Try again.", {
      status: 502,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
