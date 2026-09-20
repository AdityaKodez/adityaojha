"use client";

import { siteConfig } from "@/config/site";
import { socialsConfig } from "@/config/socials";
import { sponsorTiers } from "@/config/sponsors";
import { revealOnMount } from "@/lib/motion";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleAlert,
  Loader2,
  LockKeyhole,
  Upload,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type Status = "idle" | "submitting" | "success";

type ClaimErrorCode = "not-registered";

type ClaimError = {
  message: string;
  code?: ClaimErrorCode;
};

/** What the seat now carries, kept from the submitted form for the receipt. */
type ClaimedSeat = {
  name: string;
  /** Host and path only; the scheme lives in the field, not the value. */
  url: string;
  logoName: string;
};

const X_HANDLE = socialsConfig.find((social) => social.id === "x");
const X_URL = X_HANDLE?.href ?? "https://x.com/AdiKodez";
const MAX_LOGO_BYTES = 512 * 1024;
const ACCEPTED_LOGO_TYPES = ["image/png", "image/jpeg", "image/webp"];
const CHECKOUT_HREF = "/api/sponsor-checkout";
const SEAT_PRICE =
  sponsorTiers.find((tier) => tier.enabled !== false)?.price ??
  sponsorTiers[0]?.price ??
  5;
const DRAFT_KEY = "akoder:sponsor-claim-draft";

type ClaimDraft = {
  email: string;
  paymentId: string;
  name: string;
  link: string;
};

const EMPTY_DRAFT: ClaimDraft = {
  email: "",
  paymentId: "",
  name: "",
  link: "",
};

function parseDraft(raw: string | null): ClaimDraft {
  if (!raw) return EMPTY_DRAFT;
  try {
    const parsed = JSON.parse(raw) as Partial<ClaimDraft>;
    if (!parsed || typeof parsed !== "object") return EMPTY_DRAFT;
    return {
      email: typeof parsed.email === "string" ? parsed.email.slice(0, 320) : "",
      paymentId:
        typeof parsed.paymentId === "string" ? parsed.paymentId.slice(0, 100) : "",
      name: typeof parsed.name === "string" ? parsed.name.slice(0, 60) : "",
      link:
        typeof parsed.link === "string"
          ? parsed.link.replace(/^\s*(?:https?:\/\/|\/\/)/i, "").slice(0, 292)
          : "",
    };
  } catch {
    return EMPTY_DRAFT;
  }
}

let draftCache: ClaimDraft | null = null;
const draftListeners = new Set<() => void>();

function readDraft(): ClaimDraft {
  try {
    return parseDraft(window.localStorage.getItem(DRAFT_KEY));
  } catch {
    return EMPTY_DRAFT;
  }
}

function getDraftSnapshot(): ClaimDraft {
  if (draftCache === null) draftCache = readDraft();
  return draftCache;
}

function getServerDraftSnapshot(): ClaimDraft {
  return EMPTY_DRAFT;
}

function subscribeToDraft(onStoreChange: () => void) {
  draftListeners.add(onStoreChange);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== DRAFT_KEY) return;
    draftCache = null;
    draftListeners.forEach((listener) => listener());
  };
  window.addEventListener("storage", onStorage);
  return () => {
    draftListeners.delete(onStoreChange);
    window.removeEventListener("storage", onStorage);
  };
}

function persistDraft(draft: ClaimDraft) {
  try {
    if (!draft.email && !draft.paymentId && !draft.name && !draft.link) {
      window.localStorage.removeItem(DRAFT_KEY);
      return;
    }
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // Private mode or quota. The form still works without a draft.
  }
}

function setDraft(next: ClaimDraft) {
  draftCache = next;
  persistDraft(next);
  draftListeners.forEach((listener) => listener());
}

function patchDraft(patch: Partial<ClaimDraft>) {
  setDraft({ ...getDraftSnapshot(), ...patch });
}

function clearDraft() {
  draftCache = EMPTY_DRAFT;
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    // ignore
  }
  draftListeners.forEach((listener) => listener());
}

function useClaimDraft() {
  return useSyncExternalStore(
    subscribeToDraft,
    getDraftSnapshot,
    getServerDraftSnapshot,
  );
}

const SHARE_URL = `https://x.com/intent/post?text=${encodeURIComponent(
  `Just took a seat on ${X_HANDLE?.handle ?? "@AdiKodez"}’s orbit ✦`,
)}&url=${encodeURIComponent(`${siteConfig.meta.url}/#sponsors`)}`;

const NEXT_STEPS = [
  {
    label: "Seat details saved",
    detail: "Your name, link and logo are committed.",
    state: "done",
  },
  {
    label: "Deploy running",
    detail: "The site is rebuilding with your seat in it.",
    state: "active",
  },
  {
    label: "Live on the orbit",
    detail: "Usually a minute or two from now.",
    state: "pending",
  },
] as const;

const inputClass =
  "micro-transition min-h-11 w-full min-w-0 rounded-md bg-background px-3 py-2.5 text-sm text-foreground ring-1 ring-inset ring-border " +
  "placeholder:text-muted-foreground hover:ring-muted-foreground/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60";
const labelClass = "mb-2 block text-sm font-medium text-foreground";
/**
 * The page column. Must match COLUMN in page.tsx so the form, the heading and
 * the footer share one left edge.
 */
const COLUMN = "mx-auto w-full max-w-2xl px-4";
const linkClass =
  "micro-transition rounded-sm text-foreground underline underline-offset-4 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring";
const actionClass =
  "micro-transition inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/** One receipt line. `div` inside `dl` is valid and keeps the pair aligned. */
function SummaryRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <dt className="shrink-0 font-mono text-[11px] text-muted-foreground">{label}</dt>
      <dd className="min-w-0 truncate text-right text-sm">{children}</dd>
    </div>
  );
}

/** Post-payment setup. An email or a receipt payment ID identifies the seat. */
export function ClaimForm() {
  const searchParams = useSearchParams();
  const queryPaymentId = searchParams.get("payment_id") ?? "";
  const draft = useClaimDraft();
  const [paymentTouched, setPaymentTouched] = useState(false);
  const paymentId = paymentTouched
    ? draft.paymentId
    : queryPaymentId.trim() || draft.paymentId;
  const [paymentDetailsOpen, setPaymentDetailsOpen] = useState(
    Boolean(queryPaymentId.trim()),
  );
  const [status, setStatus] = useState<Status>("idle");
  const [claimed, setClaimed] = useState<ClaimedSeat | null>(null);
  const [error, setError] = useState<ClaimError | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoName, setLogoName] = useState("");
  const logoInputRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  function saveDraft(patch: Partial<ClaimDraft>) {
    patchDraft({
      ...patch,
      paymentId: patch.paymentId ?? (queryPaymentId.trim() || draft.paymentId),
    });
  }

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
      // Text fields survive reload via localStorage. The logo file input
      // cannot, so only warn when a file is sitting in the picker.
      if (!logoName) return;
      event.preventDefault();
      event.returnValue = "";
    }
    window.addEventListener("beforeunload", warnBeforeLeaving);
    return () => window.removeEventListener("beforeunload", warnBeforeLeaving);
  }, [status, logoName]);

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
    saveDraft({
      link: event.target.value.replace(/^\s*(?:https?:\/\/|\/\/)/i, ""),
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    // Keep the editable receipt ID from the form, not the original query value.
    const data = new FormData(event.currentTarget);
    // The visible field holds only the host and path; the API needs a full URL.
    const host = draft.link.trim().replace(/^\/+/, "");
    data.set("url", host ? `https://${host}` : "");
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
          code?: ClaimErrorCode;
        } | null;
        setError({
          message: body?.error ?? "The claim could not be saved. Try again.",
          code: body?.code,
        });
        setStatus("idle");
        return;
      }
      // Keep what was sent so the success view can show it back. The saved
      // form data is deliberately limited to the receipt details it displays.
      setClaimed({
        name: String(data.get("name") ?? "").trim(),
        url: host,
        logoName,
      });
      setStatus("success");
      clearDraft();
    } catch {
      setError({
        message: "The claim could not be saved. Check your connection and try again.",
      });
      setStatus("idle");
    }
  }

  return (
    <>
      <div className={`${COLUMN} pb-8`}>
        {status === "success" ? (
          <section aria-labelledby="claim-success" className="pb-2">
            <motion.div {...revealOnMount({ y: 6 })}>
              <p className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 font-mono text-[11px] text-primary ring-1 ring-inset ring-primary/25">
                <Check aria-hidden className="size-3" />
                Seat claimed
              </p>
              <h2
                ref={successRef}
                id="claim-success"
                tabIndex={-1}
                className="mt-3 w-fit rounded-sm text-base font-medium tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                You’re in, right beside Bit.
              </h2>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                Your details are saved and a deploy is already on its way.
                There is nothing else for you to do.
              </p>

              <div className="mt-7 border-t border-dashed pt-6">
                <p className="text-sm font-medium tracking-tight">What you saved</p>
                <dl className="mt-2 divide-y divide-dashed">
                  <SummaryRow label="Display name">
                    {claimed?.name || (
                      <span className="text-muted-foreground">Left as it was</span>
                    )}
                  </SummaryRow>
                  <SummaryRow label="Link">
                    {claimed?.url ? (
                      <a
                        href={`https://${claimed.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${linkClass} inline-flex max-w-full items-center gap-1`}
                      >
                        <span className="truncate">{claimed.url}</span>
                        <ArrowUpRight aria-hidden className="size-3.5 shrink-0" />
                        <span className="sr-only">, opens in a new tab</span>
                      </a>
                    ) : (
                      <span className="text-muted-foreground">None added</span>
                    )}
                  </SummaryRow>
                  <SummaryRow label="Logo">
                    {claimed?.logoName || (
                      <span className="text-muted-foreground">Generated avatar kept</span>
                    )}
                  </SummaryRow>
                </dl>
              </div>

              <div className="mt-7 border-t border-dashed pt-6">
                <p className="text-sm font-medium tracking-tight">What happens next</p>
                <ol className="mt-3 space-y-3">
                  {NEXT_STEPS.map((step) => (
                    <li key={step.label} className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${
                          step.state === "done"
                            ? "bg-primary text-primary-foreground"
                            : step.state === "active"
                              ? "ring-1 ring-inset ring-primary/50"
                              : "ring-1 ring-inset ring-border"
                        }`}
                      >
                        {step.state === "done" ? (
                          <Check className="size-3" />
                        ) : (
                          <span
                            className={`size-1.5 rounded-full ${
                              step.state === "active"
                                ? "bg-primary motion-safe:animate-pulse"
                                : "bg-muted-foreground/40"
                            }`}
                          />
                        )}
                      </span>
                      <span className="min-w-0">
                        <span
                          className={`block text-sm ${
                            step.state === "pending" ? "text-muted-foreground" : "text-foreground"
                          }`}
                        >
                          {step.label}
                        </span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                          {step.detail}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-7 border-t border-dashed pt-5">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/#sponsors"
                    className={`${actionClass} bg-primary text-primary-foreground hover:bg-primary/90`}
                  >
                    See the orbit <ArrowRight aria-hidden className="size-4" />
                  </Link>
                  <a
                    href={SHARE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${actionClass} bg-background ring-1 ring-inset ring-border hover:bg-muted`}
                  >
                    Share on X <ArrowUpRight aria-hidden className="size-4" />
                    <span className="sr-only">, opens in a new tab</span>
                  </a>
                </div>
                <p className="mt-3 text-pretty text-xs leading-relaxed text-muted-foreground">
                  The seat is permanent. Nothing renews, nothing expires, and
                  there is nothing to manage.
                </p>
              </div>
            </motion.div>
          </section>
        ) : (
          <form
            onSubmit={handleSubmit}
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
                value={draft.email}
                onChange={(event) => saveDraft({ email: event.target.value })}
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
                    onChange={(event) => {
                      const next = event.target.value;
                      setPaymentTouched(true);
                      saveDraft({ paymentId: next });
                      if (next.trim()) setPaymentDetailsOpen(true);
                    }}
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
                    value={draft.name}
                    onChange={(event) => saveDraft({ name: event.target.value })}
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
                      value={draft.link}
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
                <div
                  ref={errorRef}
                  tabIndex={-1}
                  role="alert"
                  className="mb-4 space-y-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-destructive"
                >
                  <p className="flex items-start gap-2 rounded-md bg-destructive/5 p-3 text-xs leading-relaxed text-destructive">
                    <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
                    <span>{error.message}</span>
                  </p>
                  {error.code === "not-registered" && (
                    <div className="rounded-md bg-muted/20 p-3 ring-1 ring-inset ring-border">
                      <p className="text-sm font-medium tracking-tight">
                        Already paid, or still need a seat?
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {`If you already paid, wait a minute and try again. If you have not, take a $${SEAT_PRICE} seat and you will return here.`}
                      </p>
                      <a
                        href={CHECKOUT_HREF}
                        aria-busy={checkingOut}
                        className={`${actionClass} mt-3 w-full bg-background ring-1 ring-inset ring-border hover:bg-muted ${
                          checkingOut ? "cursor-wait opacity-60" : ""
                        }`}
                        onClick={(event) => {
                          event.preventDefault();
                          if (checkingOut) return;
                          setCheckingOut(true);
                          saveDraft({ paymentId });
                          // Full-page navigation: the route 302s to Dodo's
                          // hosted checkout, which a client router would try
                          // to render instead of following.
                          window.location.assign(
                            new URL(CHECKOUT_HREF, window.location.origin),
                          );
                        }}
                      >
                        {checkingOut ? (
                          <>
                            <Loader2 aria-hidden className="size-4 motion-safe:animate-spin" />
                            Opening checkout…
                          </>
                        ) : (
                          <>
                            Take a ${SEAT_PRICE} seat
                            <ArrowUpRight aria-hidden className="size-4" />
                          </>
                        )}
                      </a>
                    </div>
                  )}
                </div>
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

      {/* mt-auto pins the band to the bottom of the min-h-dvh frame, so the
          short success state does not leave the frame hanging mid-page. */}
      <footer className="mt-auto border-t border-dashed bg-muted/15 py-8 text-center">
        <div className={COLUMN}>
          <h2 className="text-balance text-base font-medium tracking-tight">Bit’s got good company.</h2>
          <p className="mx-auto mt-2 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
            Thanks for backing the work. You help keep the components free and the little experiments going.
          </p>
          <div className="mx-auto mt-6 flex flex-col items-center gap-1 text-xs leading-relaxed text-muted-foreground">
            <p>{status === "success" ? "Need to change something later?" : "Just paid? Your seat may take a minute or two to register."}</p>
            <a href={X_URL} target="_blank" rel="noopener noreferrer" className={`${linkClass} inline-flex min-h-9 items-center gap-1.5`}>
              {status === "success" ? "DM me on X" : "Need a hand? DM me"}
              <ArrowUpRight aria-hidden className="size-3.5" />
              <span className="sr-only">{status === "success" ? "" : " on X"}{X_HANDLE ? ` (${X_HANDLE.handle})` : ""}, opens in a new tab</span>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
