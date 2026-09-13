"use client";

import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

type Status = "idle" | "submitting" | "success";

const inputClass =
  "micro-transition w-full rounded-md bg-background px-3 py-2 text-sm ring-1 ring-inset ring-border " +
  "focus:outline-none focus:ring-primary/60";

const labelClass = "mb-1.5 block font-mono text-xs text-muted-foreground";

/**
 * Post-payment form for an orbit seat. The payment id arrives from the
 * Dodo return redirect; without it the form still renders so the sponsor
 * can paste the id from their receipt.
 */
export function ClaimForm() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("payment_id") ?? "";

  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const data = new FormData(event.currentTarget);
    data.set("paymentId", paymentId);

    setStatus("submitting");
    setError(null);

    try {
      const response = await fetch("/api/sponsor-claim", {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        setError(body?.error ?? "The claim could not be saved. Try again.");
        setStatus("idle");
        return;
      }

      setStatus("success");
      formRef.current?.reset();
    } catch {
      setError("The claim could not be saved. Try again.");
      setStatus("idle");
    }
  }

  if (status === "success") {
    return (
      <p className="px-6 py-4 text-sm text-muted-foreground">
        Seat claimed! Your name, link, and logo go live on the next deploy,
        usually within a minute or two.
      </p>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 px-6 pb-2"
    >
      <div>
        <label htmlFor="claim-email" className={labelClass}>
          Email you paid with
        </label>
        <input
          id="claim-email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className={inputClass}
        />
        <p className="mt-1.5 font-mono text-xs text-muted-foreground">
          Used to find your payment, never shown anywhere.
        </p>
      </div>

      <div>
        <label htmlFor="claim-payment-id" className={labelClass}>
          Payment id (optional)
        </label>
        <input
          id="claim-payment-id"
          name="paymentId"
          defaultValue={paymentId}
          placeholder="pay_..."
          className={inputClass}
        />
        <p className="mt-1.5 font-mono text-xs text-muted-foreground">
          Pre-filled after checkout. Blank is fine, the email above is enough.
        </p>
      </div>

      <div>
        <label htmlFor="claim-name" className={labelClass}>
          Display name
        </label>
        <input
          id="claim-name"
          name="name"
          type="text"
          maxLength={60}
          placeholder="How the seat is labelled"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="claim-url" className={labelClass}>
          Site URL (optional)
        </label>
        <input
          id="claim-url"
          name="url"
          type="url"
          placeholder="https://your-site.dev"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="claim-logo" className={labelClass}>
          Logo (optional, PNG or JPEG up to 512KB)
        </label>
        <input
          id="claim-logo"
          name="logo"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="block w-full font-mono text-xs text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-xs file:text-foreground"
        />
        <p className="mt-1.5 font-mono text-xs text-muted-foreground">
          Skip it and the seat keeps its generated avatar.
        </p>
      </div>

      {error && (
        <p className="font-mono text-xs text-destructive" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="micro-transition self-start rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground ring-1 ring-inset ring-border disabled:opacity-60"
      >
        {status === "submitting" ? "Saving..." : "Claim seat"}
      </button>
    </form>
  );
}
