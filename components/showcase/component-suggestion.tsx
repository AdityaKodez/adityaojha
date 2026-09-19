"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Plus, Send, X } from "lucide-react";

import { componentsSectionConfig } from "@/config/components";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/lib/use-mobile";
import BitBlob from "@/components/landing/bit";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CatalogView } from "@/components/showcase/components-view";
import XIcon from "@/public/x-icon";

const suggestion = componentsSectionConfig.suggestion;

/* Mirrors the caps enforced by app/api/component-suggestion/route.ts. */
const MIN_IDEA_LENGTH = 20;
const MAX_IMAGES = 3;
const MAX_IMAGE_BYTES = 1_500_000;
const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

type SubmitStatus = "idle" | "submitting" | "success" | "error";

/**
 * The catalog's trailing slot. What used to be a dead "next block on the
 * bench" filler is now the entry point for suggesting that block: a CTA in
 * the same grid position that opens the suggestion dialog on desktop
 * and a bottom drawer on mobile.
 */
export function ComponentSuggestion({ variant }: { variant: CatalogView }) {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (next: boolean) => {
    if (next) {
      trackEvent("component_suggestion_opened", { view: variant });
    }
    setOpen(next);
  };

  return (
    <>
      {variant === "list" ? (
        <SuggestionListCta onClick={() => handleOpenChange(true)} />
      ) : (
        <SuggestionCardCta onClick={() => handleOpenChange(true)} />
      )}
      <SuggestionDialog
        open={open}
        onOpenChange={handleOpenChange}
        view={variant}
      />
    </>
  );
}

/** List view CTA. Mirrors a catalog row: icon box, title, description. */
function SuggestionListCta({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex w-full items-stretch text-left transition-colors hover:bg-muted/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <div className="relative z-10 flex h-full w-full items-center gap-4 px-4 py-5">
        <div className="relative flex size-10 shrink-0 items-center justify-center rounded-sm bg-background text-muted-foreground transition-colors group-hover:text-foreground">
          <Plus className="h-4 w-4" />
          <div className="pointer-events-none absolute inset-0 rounded-sm border border-dashed border-muted-foreground/20 transition-colors group-hover:border-muted-foreground/40" />
        </div>
        <div className="flex min-w-0 grow flex-col">
          <h3 className="truncate text-sm font-medium tracking-tight text-muted-foreground transition-colors group-hover:text-foreground">
            {suggestion.cardTitle}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground/80">
            {suggestion.cardDescription}
          </p>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 border border-dashed border-muted-foreground/15 transition-colors group-hover:border-muted-foreground/30" />
    </button>
  );
}

/** Card view CTA. Keeps the tab stand-in so its body lines up with real cards. */
function SuggestionCardCta({ onClick }: { onClick: () => void }) {
  return (
    <div className="relative flex min-w-0 flex-col">
      {/* Stands in for the tab strip so the dashed box lines up with the
          preview body of a real card, not with its tab. */}
      <div className="-mb-px flex items-center py-2">
        <div className="size-6" />
      </div>

      <button
        type="button"
        onClick={onClick}
        className="catalog-card-body group relative flex flex-1 flex-col items-center justify-center gap-2 overflow-hidden rounded-tr-md rounded-b-md border border-dashed p-6 text-center transition-colors hover:border-muted-foreground/30 hover:bg-muted/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <span className="relative flex size-8 items-center justify-center rounded-sm bg-background text-muted-foreground transition-colors group-hover:text-foreground">
          <Plus className="size-4" />
          <span className="pointer-events-none absolute inset-0 rounded-sm border border-dashed border-muted-foreground/20 transition-colors group-hover:border-muted-foreground/40" />
        </span>
        <p className="text-sm font-medium tracking-tight text-muted-foreground transition-colors group-hover:text-foreground">
          {suggestion.cardTitle}
        </p>
        <p className="font-mono text-[11px] text-muted-foreground/50">
          {suggestion.cardHint}
        </p>
      </button>
    </div>
  );
}

function SuggestionDialog({
  open,
  onOpenChange,
  view,
}: {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  view: CatalogView;
}) {
  const [idea, setIdea] = useState("");
  const [references, setReferences] = useState("");
  const [name, setName] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [fileNotice, setFileNotice] = useState<string | null>(null);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isMascotHovered, setIsMascotHovered] = useState(false);
  const isMobile = useIsMobile();

  const isFormActive =
    isInputFocused ||
    idea.trim().length > 0 ||
    references.trim().length > 0 ||
    files.length > 0;

  const ideaRef = useRef<HTMLTextAreaElement>(null);
  const referencesRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = (element: HTMLTextAreaElement | null) => {
    if (!element) return;
    element.style.height = "auto";
    const borderHeight = element.offsetHeight - element.clientHeight;
    element.style.height = `${element.scrollHeight + borderHeight}px`;
  };

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      adjustHeight(ideaRef.current);
      adjustHeight(referencesRef.current);
    });
    return () => cancelAnimationFrame(frame);
  }, [open, idea, references]);

  /* Object URLs are revoked where they are removed; the ref exists so the
     ones still alive at unmount do not leak. */
  const previewsRef = useRef<string[]>([]);
  useEffect(() => {
    previewsRef.current = previews;
  }, [previews]);
  useEffect(
    () => () => {
      previewsRef.current.forEach((url) => URL.revokeObjectURL(url));
    },
    []
  );

  const resetForm = () => {
    setIdea("");
    setReferences("");
    setName("");
    setHoneypot("");
    setFiles([]);
    setPreviews([]);
    setFileNotice(null);
    setStatus("idle");
    setErrorMessage(null);
    setIsInputFocused(false);
    setIsMascotHovered(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) resetForm();
    onOpenChange(next);
  };

  const addImages = (incoming: FileList | null) => {
    if (!incoming || incoming.length === 0) return;
    const accepted: File[] = [];
    let skipped = 0;
    for (const file of Array.from(incoming)) {
      if (
        files.length + accepted.length >= MAX_IMAGES ||
        !ACCEPTED_IMAGE_TYPES.includes(file.type) ||
        file.size > MAX_IMAGE_BYTES
      ) {
        skipped += 1;
        continue;
      }
      accepted.push(file);
    }
    if (accepted.length > 0) {
      setFiles((prev) => [...prev, ...accepted]);
      setPreviews((prev) => [
        ...prev,
        ...accepted.map((file) => URL.createObjectURL(file)),
      ]);
    }
    setFileNotice(
      skipped > 0
        ? `${skipped} file${skipped === 1 ? "" : "s"} skipped. ${suggestion.imagesHint}`
        : null
    );
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;

    const trimmedIdea = idea.trim();
    if (trimmedIdea.length < MIN_IDEA_LENGTH) {
      setStatus("error");
      setErrorMessage(suggestion.ideaTooShortMessage);
      return;
    }

    setStatus("submitting");
    setErrorMessage(null);

    const data = new FormData();
    data.set("idea", trimmedIdea);
    data.set("references", references.trim());
    data.set("name", name.trim().replace(/^@/, ""));
    data.set("website", honeypot);
    files.forEach((file) => data.append("images", file));

    let failureReason:
      | "invalid"
      | "network"
      | "unavailable"
      | "rate_limited" = "network";
    let message: string | null = suggestion.errorDescription;

    try {
      const response = await fetch("/api/component-suggestion", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        setStatus("success");
        trackEvent("component_suggestion_submitted", {
          view,
          has_reference: references.trim().length > 0 || files.length > 0,
        });
        return;
      }

      const body = (await response.json().catch(() => null)) as {
        error?: string;
        message?: string;
      } | null;

      if (body?.error === "rate_limited") {
        failureReason = "rate_limited";
        message = suggestion.rateLimitMessage;
      } else if (body?.error === "unavailable") {
        failureReason = "unavailable";
        message = suggestion.unavailableMessage;
      } else if (body?.error === "invalid") {
        failureReason = "invalid";
        message = body.message ?? suggestion.errorDescription;
      }
    } catch {
      // Network failure; keep the generic message.
    }

    setStatus("error");
    setErrorMessage(message);
    trackEvent("component_suggestion_failed", {
      view,
      reason: failureReason,
    });
  };

  const Header = isMobile ? DrawerHeader : DialogHeader;
  const Title = isMobile ? DrawerTitle : DialogTitle;
  const Description = isMobile ? DrawerDescription : DialogDescription;
  const Footer = isMobile ? DrawerFooter : DialogFooter;

  const panel = (
    <>
      <Header
          className={cn(
            "flex p-0 text-left",
            status === "success"
              ? "flex-col items-center gap-3 pr-0 text-center"
              : "flex-row items-center gap-3.5 space-y-0"
          )}
        >
          <div
            onMouseEnter={() => setIsMascotHovered(true)}
            onMouseLeave={() => setIsMascotHovered(false)}
            className="flex shrink-0 items-center justify-center select-none"
          >
            <BitBlob
              awake={
                status === "success" ||
                isMascotHovered ||
                isFormActive ||
                status === "submitting"
              }
              gaze={
                status === "success" || isMascotHovered
                  ? "up"
                  : isFormActive || status === "submitting"
                    ? "down"
                    : "right"
              }
              className={cn(
                "transition-transform duration-300 ease-out",
                status === "success"
                  ? "size-14 rotate-3"
                  : isFormActive
                    ? "size-12 scale-105 -rotate-3"
                    : "size-12 -rotate-1 hover:scale-105"
              )}

              aria-hidden
            />
          </div>
          <div
            className={cn(
              "flex min-w-0 flex-col gap-0.5",
              status !== "success" && "flex-1"
            )}
          >
            <Title>
              {status === "success"
                ? suggestion.successTitle
                : suggestion.title}
            </Title>
            <Description>
              {status === "success"
                ? suggestion.successDescription
                : suggestion.description}
            </Description>
          </div>
        </Header>

        {status === "success" ? (
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={() => handleOpenChange(false)}
          >
            {suggestion.doneLabel}
          </Button>
        ) : (
          <form
            onSubmit={submit}
            onFocus={() => setIsInputFocused(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setIsInputFocused(false);
              }
            }}
            className="mt-1 flex flex-col gap-4"
          >
            {/* Honeypot. Humans never see it; bots that fill it are dropped
                server-side with a fake success so they learn nothing. */}
            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={(event) => setHoneypot(event.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="suggestion-idea"
                className="text-xs font-normal text-muted-foreground"
              >
                {suggestion.ideaLabel}
              </Label>
              <Textarea
                ref={ideaRef}
                id="suggestion-idea"
                value={idea}
                onChange={(event) => {
                  setIdea(event.target.value);
                  adjustHeight(event.target);
                }}
                onInput={(event) => adjustHeight(event.currentTarget)}
                placeholder={suggestion.ideaPlaceholder}
                rows={3}
                maxLength={2000}
                required
                minLength={MIN_IDEA_LENGTH}
                className="resize-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="suggestion-references"
                className="text-xs font-normal text-muted-foreground"
              >
                {suggestion.referencesLabel}
              </Label>
              <Textarea
                ref={referencesRef}
                id="suggestion-references"
                value={references}
                onChange={(event) => {
                  setReferences(event.target.value);
                  adjustHeight(event.target);
                }}
                onInput={(event) => adjustHeight(event.currentTarget)}
                placeholder={suggestion.referencesPlaceholder}
                rows={2}
                maxLength={2000}
                className="resize-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <span
                id="suggestion-images-label"
                className="text-xs font-normal text-muted-foreground"
              >
                {suggestion.imagesLabel}
              </span>
              <label
                htmlFor="suggestion-images"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  addImages(event.dataTransfer.files);
                }}
                className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-input px-4 py-4 text-center transition-colors hover:border-muted-foreground/40 hover:bg-muted/30"
              >
                <ImagePlus className="size-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {suggestion.imagesButton}
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {suggestion.imagesHint}
                </span>
              </label>
              <input
                id="suggestion-images"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                multiple
                hidden
                onChange={(event) => {
                  addImages(event.target.files);
                  event.target.value = "";
                }}
              />
              {fileNotice ? (
                <p className="text-xs text-muted-foreground">{fileNotice}</p>
              ) : null}
              {previews.length > 0 ? (
                <ul
                  className="mt-1 flex flex-wrap gap-2"
                  aria-labelledby="suggestion-images-label"
                >
                  {files.map((file, index) => (
                    <li key={previews[index]} className="relative">
                      {/* Local preview of a just-picked file. There is no
                          optimized source for next/image to work with. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previews[index]}
                        alt={file.name}
                        className="size-14 rounded-md object-cover ring-1 ring-inset ring-muted-foreground/15"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        aria-label={`${suggestion.removeImageLabel}: ${file.name}`}
                        className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-background text-muted-foreground ring-1 ring-inset ring-muted-foreground/20 transition-colors hover:text-foreground"
                      >
                        <X className="size-3" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="suggestion-name"
                className="text-xs font-normal text-muted-foreground"
              >
                {suggestion.nameLabel}
              </Label>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>
                    <XIcon size={14} aria-hidden />
                  </InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="suggestion-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={suggestion.namePlaceholder}
                  maxLength={80}
                  autoComplete="off"
                  spellCheck={false}
                />
              </InputGroup>
            </div>

            <Footer className="mt-1 flex w-full flex-col gap-2 p-0 sm:flex-col sm:justify-stretch">
              {errorMessage ? (
                <p
                  role="alert"
                  className="text-left text-sm leading-relaxed text-destructive"
                >
                  {errorMessage}
                </p>
              ) : null}
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                className="w-full"
                disabled={status === "submitting"}
              >
                {status === "submitting" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
                {status === "submitting"
                  ? suggestion.submittingLabel
                  : suggestion.submitLabel}
              </Button>
            </Footer>
          </form>
        )}
    </>
  );

  if (isMobile) {
    return (
      <Drawer
        open={open}
        onOpenChange={handleOpenChange}
        shouldScaleBackground={false}
      >
        <DrawerContent className="max-h-[88dvh] bg-background">
          <div
            className={cn(
              "flex min-h-0 flex-col no-scrollbar overflow-y-auto px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-2",
              status === "success" ? "gap-5" : "gap-[1.1rem]"
            )}
          >
            {panel}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={status === "success" ? "gap-5" : "gap-[1.1rem]"}>
        {panel}
      </DialogContent>
    </Dialog>
  );
}
