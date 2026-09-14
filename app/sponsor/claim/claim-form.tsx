"use client";

import { socialsConfig } from "@/config/socials";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleAlert,
  Loader2,
  LockKeyhole,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Status = "idle" | "submitting" | "success";

const X_HANDLE = socialsConfig.find((social) => social.id === "x");
const X_URL = X_HANDLE?.href ?? "https://x.com/AdiKodez";
const MAX_LOGO_BYTES = 512 * 1024;
const ACCEPTED_LOGO_TYPES = ["image/png", "image/jpeg", "image/webp"];

const inputClass =
  "micro-transition min-h-11 w-full min-w-0 rounded-md bg-background px-3 py-2.5 text-sm text-foreground ring-1 ring-inset ring-border " +
  "placeholder:text-muted-foreground hover:ring-muted-foreground/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60";
const labelClass = "mb-2 block text-sm font-medium text-foreground";
const linkClass =
  "micro-transition rounded-sm text-foreground underline underline-offset-4 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring";

/** Post-payment setup. An email or a receipt payment ID identifies the seat. */
export function ClaimForm() {
  const searchParams = useSearchParams();
  const [paymentId, setPaymentId] = useState(searchParams.get("payment_id") ?? "");
  const [paymentDetailsOpen, setPaymentDetailsOpen] = useState(Boolean(paymentId.trim()));
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoName, setLogoName] = useState("");
  const [link, setLink] = useState("");
  const logoInputRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const dirtyRef = useRef(false);

  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    };
  }, [logoPreview]);

  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  useEffect(() => {
    if (status === "success") {
      successRef.current?.focus();
      return;
    }
    function warnBeforeLeaving(event: BeforeUnloadEvent) {
      if (!dirtyRef.current) return;
      event.preventDefault();
      event.returnValue = "";
    }
    window.addEventListener("beforeunload", warnBeforeLeaving);
    return () => window.removeEventListener("beforeunload", warnBeforeLeaving);
  }, [status]);

  function handleLogoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    const message = file && !ACCEPTED_LOGO_TYPES.includes(file.type)
      ? "Choose a PNG, JPEG or WebP image."
      : file && file.size > MAX_LOGO_BYTES
        ? "This image is too large. Choose one under 512 KB."
        : file && file.size === 0
          ? "This file is empty. Choose another image."
          : null;

    input.setCustomValidity(message ?? "");
    setLogoError(message);
    setLogoName(file?.name ?? "");
    setLogoPreview(file && !message ? URL.createObjectURL(file) : null);
    if (message) input.focus();
  }

  function removeLogo() {
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
      logoInputRef.current.setCustomValidity("");
      logoInputRef.current.focus();
    }
    setLogoError(null);
    setLogoName("");
    setLogoPreview(null);
  }

  /** The field owns the scheme, so a pasted one is stripped instead of doubled. */
  function handleLinkChange(event: React.ChangeEvent<HTMLInputElement>) {
    setLink(event.target.value.replace(/^\s*(?:https?:\/\/|\/\/)/i, ""));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    // Keep the editable receipt ID from the form, not the original query value.
    const data = new FormData(event.currentTarget);
    // The visible field holds only the host and path; the API needs a full URL.
    const host = link.trim().replace(/^\/+/, "");
    data.set("url", host ? `https://${host}` : "");
    setStatus("submitting");
    setError(null);

    try {
      const response = await fetch("/api/sponsor-claim", {
        method: "POST",
        body: data,
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error ?? "The claim could not be saved. Try again.");
        setStatus("idle");
        return;
      }
      setStatus("success");
      dirtyRef.current = false;
    } catch {
      setError("The claim could not be saved. Check your connection and try again.");
      setStatus("idle");
    }
  }

  return (
    <>
      <div className="mx-auto w-full max-w-2xl px-4 pb-8">
        {status === "success" ? (
          <section aria-labelledby="claim-success" className="py-6">
            <span className="mb-5 inline-flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Check aria-hidden className="size-5" />
            </span>
            <h2
              ref={successRef}
              id="claim-success"
              tabIndex={-1}
              className="w-fit rounded-sm text-base font-medium tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              You’re part of the orbit.
            </h2>
            <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
              Your seat details are saved. They go live on the next deploy,
              usually within a minute or two.
            </p>
            <Link
              href="/#sponsors"
              className="micro-transition mt-6 inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Back to the orbit <ArrowRight aria-hidden className="size-4" />
            </Link>
          </section>
        ) : (
          <form
            onSubmit={handleSubmit}
            onChange={() => { dirtyRef.current = true; }}
            aria-label="Claim your sponsor seat"
            aria-busy={status === "submitting"}
          >
            <fieldset disabled={status === "submitting"} className="min-w-0">
              <legend className="mb-1 flex items-center gap-2.5 text-sm font-medium tracking-tight">
                <span className="font-mono text-[11px] tabular-nums text-primary">01</span>
                Find your payment
              </legend>
              <p className="mb-5 text-xs leading-relaxed text-muted-foreground">
                Use your checkout email or the payment ID on your receipt.
              </p>
              <label htmlFor="claim-email" className={labelClass}>Checkout email</label>
              <input
                id="claim-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                spellCheck={false}
                autoCapitalize="none"
                required={!paymentId.trim()}
                placeholder="you@example.com…"
                aria-describedby="claim-email-help"
                className={inputClass}
              />
              <p id="claim-email-help" className="mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground">
                <LockKeyhole aria-hidden className="mt-0.5 size-3 shrink-0" />
                Just for the payment lookup. Never shown publicly.
              </p>
              <details
                open={paymentDetailsOpen}
                onToggle={(event) => setPaymentDetailsOpen(event.currentTarget.open)}
                className="mt-4"
              >
                <summary className="micro-transition w-fit cursor-pointer rounded-sm py-1 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
                  {paymentId.trim() ? "Payment ID from checkout" : "Have a payment ID instead?"}
                </summary>
                <div className="pt-3">
                  <label htmlFor="claim-payment-id" className={labelClass}>
                    Payment ID <span className="font-normal text-muted-foreground">(optional)</span>
                  </label>
                  <input
                    id="claim-payment-id"
                    name="paymentId"
                    value={paymentId}
                    onChange={(event) => setPaymentId(event.target.value)}
                    maxLength={100}
                    autoComplete="off"
                    spellCheck={false}
                    autoCapitalize="none"
                    placeholder="pay_…"
                    aria-describedby="claim-payment-help"
                    className={`${inputClass} font-mono text-xs`}
                  />
                  <p id="claim-payment-help" className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    If you add an ID, the email is optional. We verify payment when you submit.
                  </p>
                </div>
              </details>
            </fieldset>

            <fieldset disabled={status === "submitting"} className="mt-7 min-w-0 border-t border-dashed pt-6">
              <legend className="sr-only">Personalize your seat</legend>
              <div aria-hidden="true" className="mb-1 flex items-center gap-2.5 text-sm font-medium tracking-tight">
                <span className="font-mono text-[11px] tabular-nums text-primary">02</span>
                Personalize your seat
              </div>
              <p className="mb-5 text-xs leading-relaxed text-muted-foreground">
                All optional. Leave a field blank to keep its current details.
              </p>
              <div className="space-y-5">
                <div>
                  <label htmlFor="claim-name" className={labelClass}>Display name</label>
                  <input
                    id="claim-name"
                    name="name"
                    type="text"
                    autoComplete="nickname"
                    maxLength={60}
                    placeholder="Your name or project…"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="claim-url" className={labelClass}>Your link</label>
                  {/* The scheme is part of the control, not something to type.
                      type="text" on purpose: a bare host is valid here, and
                      native url validation would reject it before submit. */}
                  <div className="micro-transition flex min-h-11 items-stretch overflow-hidden rounded-md bg-background ring-1 ring-inset ring-border focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring">
                    <span
                      aria-hidden="true"
                      className="flex select-none items-center border-r bg-muted px-3 font-mono text-xs text-muted-foreground"
                    >
                      https://
                    </span>
                    <input
                      id="claim-url"
                      name="url"
                      type="text"
                      inputMode="url"
                      autoComplete="url"
                      spellCheck={false}
                      autoCapitalize="none"
                      maxLength={292}
                      value={link}
                      onChange={handleLinkChange}
                      placeholder="your-site.dev"
                      aria-describedby="claim-url-help"
                      className="min-h-11 w-full min-w-0 bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                    />
                  </div>
                  <p id="claim-url-help" className="mt-2 text-xs text-muted-foreground">
                    A website, repo or profile. The https:// is added for you.
                  </p>
                </div>
                <div>
                  <label htmlFor="claim-logo" className={labelClass}>Your logo</label>
                  <div className="relative rounded-md bg-muted/20 ring-1 ring-inset ring-border focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring">
                    <input
                      ref={logoInputRef}
                      id="claim-logo"
                      name="logo"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleLogoChange}
                      aria-describedby={`claim-logo-help${logoError ? " claim-logo-error" : ""}`}
                      aria-invalid={Boolean(logoError)}
                      className="peer sr-only"
                    />
                    <label htmlFor="claim-logo" className="micro-transition flex min-h-20 cursor-pointer items-center gap-3 rounded-md p-3 hover:bg-muted/60 peer-disabled:cursor-wait peer-disabled:opacity-60">
                      <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-background text-muted-foreground">
                        {logoPreview ? (
                          // Local upload thumbnail; no remote image request.
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={logoPreview} alt="" width={40} height={40} className="size-full object-cover" />
                        ) : <Upload className="size-4" />}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-medium" title={logoName || undefined}>
                          {logoName || "Choose a logo"}
                        </span>
                        <span className="mt-1 block text-[11px] text-muted-foreground">PNG, JPEG or WebP · Up to 512 KB</span>
                      </span>
                    </label>
                  </div>
                  {logoName && <button type="button" onClick={removeLogo} className={`${linkClass} mt-2 min-h-8 text-xs`}>Remove logo</button>}
                  {logoError && <p id="claim-logo-error" role="alert" className="mt-2 text-xs leading-relaxed text-destructive">{logoError}</p>}
                  <p id="claim-logo-help" className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    Shown in a circle. Skip it to keep your generated avatar.
                  </p>
                </div>
              </div>
            </fieldset>

            <div className="mt-7 border-t border-dashed pt-5">
              {error && (
                <p ref={errorRef} tabIndex={-1} role="alert" className="mb-4 flex items-start gap-2 rounded-md bg-destructive/5 p-3 text-xs leading-relaxed text-destructive focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-destructive">
                  <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
                  <span>{error}</span>
                </p>
              )}
              <button
                type="submit"
                disabled={status === "submitting"}
                className="micro-transition inline-flex min-h-11 w-full touch-manipulation items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-wait disabled:opacity-60"
              >
                {status === "submitting"
                  ? <><Loader2 aria-hidden className="size-4 motion-safe:animate-spin" /> Saving your seat…</>
                  : <>Claim my seat <ArrowRight aria-hidden className="size-4" /></>}
              </button>
              <span role="status" className="sr-only">{status === "submitting" ? "Saving your seat. Please wait." : ""}</span>
              <p className="mt-3 text-pretty text-xs leading-relaxed text-muted-foreground">
                Check your details before claiming. This form can only be submitted once per seat.
              </p>
            </div>
          </form>
        )}
      </div>

      <footer className="relative border-t border-dashed bg-muted/15 px-4 pb-6 pt-8 text-center">
        <h2 className="text-balance text-base font-medium tracking-tight">Bit’s got good company.</h2>
        <p className="mx-auto mt-2 max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground">
          Thanks for backing the work. You help keep the components free and the little experiments going.
        </p>
        <div className="mx-auto mt-6 flex max-w-sm flex-col items-center gap-1 text-xs leading-relaxed text-muted-foreground">
          <p>{status === "success" ? "Need to change something later?" : "Just paid? Your seat may take a minute or two to register."}</p>
          <a href={X_URL} target="_blank" rel="noopener noreferrer" className={`${linkClass} inline-flex min-h-9 items-center gap-1.5`}>
            {status === "success" ? "DM me on X" : "Need a hand? DM me"}
            <ArrowUpRight aria-hidden className="size-3.5" />
            <span className="sr-only">{status === "success" ? "" : " on X"}{X_HANDLE ? ` (${X_HANDLE.handle})` : ""}, opens in a new tab</span>
          </a>
        </div>
      </footer>
    </>
  );
}
