"use client";

import { ArrowUp, AtSign, FileText, LoaderCircle, Paperclip, Sparkles, Square, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useLayoutEffect, useRef, useState, type FormEvent, type ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { InputGroup, InputGroupButton, InputGroupTextarea } from "@/components/ui/input-group";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export type PromptBarContext<TData = unknown> = {
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  /** App-owned content, references, or metadata, passed through unchanged. */
  data?: TData;
};

export type PromptBarSkill<TData = unknown> = PromptBarContext<TData> & {
  /** Instructions for your app to apply when building its prompt. */
  instructions?: string;
};

export type PromptBarUsage = {
  usedTokens: number;
  maxTokens: number;
  /** A percentage from 0 to 100, supplied by your provider. */
  cacheHitRate?: number;
};

export type PromptBarSubmission<TContextData = unknown, TSkillData = unknown> = {
  text: string;
  contexts: readonly PromptBarContext<TContextData>[];
  skill: PromptBarSkill<TSkillData> | null;
  attachments: readonly File[];
};

export type PromptBarProps<TContextData = unknown, TSkillData = unknown> = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  contexts?: readonly PromptBarContext<TContextData>[];
  contextOptions?: readonly PromptBarContext<TContextData>[];
  onContextAdd?: (context: PromptBarContext<TContextData>) => void;
  onContextRemove?: (id: string) => void;
  skills?: readonly PromptBarSkill<TSkillData>[];
  /** Controlled selection. Supply onSkillChange to update it. */
  skill?: PromptBarSkill<TSkillData> | null;
  defaultSkill?: PromptBarSkill<TSkillData> | null;
  onSkillChange?: (skill: PromptBarSkill<TSkillData> | null) => void;
  toolbar?: ReactNode;
  /** The selected model's display name, shown in the context summary. */
  modelLabel?: string;
  /** Provider-reported usage. Omit when measurements are unavailable. */
  contextUsage?: PromptBarUsage;
  onSubmit: (submission: PromptBarSubmission<TContextData, TSkillData>) => void | Promise<void>;
  /** A synchronous cancellation callback, for example AbortController.abort. */
  onStop?: () => void;
  submitting?: boolean;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  maxHeight?: number;
  /** Passed to the native file picker. Validate file contents on your server. */
  accept?: string;
  maxFiles?: number;
  /** Per-file limit in bytes. */
  maxFileSize?: number;
  className?: string;
};

type Trigger = { kind: "/" | "@"; query: string; start: number; end: number };

export function PromptBar<TContextData = unknown, TSkillData = unknown>({
  value, defaultValue = "", onValueChange, contexts = [], contextOptions = [],
  onContextAdd, onContextRemove, skills = [], skill: controlledSkill, defaultSkill = null,
  onSkillChange, toolbar, modelLabel, contextUsage, onSubmit, onStop,
  submitting = false, error, disabled = false,
  placeholder = "Ask anything...", label = "Your prompt", maxHeight = 240,
  accept, maxFiles = 5, maxFileSize = 10 * 1024 * 1024, className,
}: PromptBarProps<TContextData, TSkillData>) {
  const id = useId();
  const reducedMotion = useReducedMotion();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef(new Map<string, HTMLDivElement>());
  const inFlight = useRef(false);
  const requestId = useRef(0);
  const composing = useRef(false);
  const [draft, setDraft] = useState(defaultValue);
  const [expanded, setExpanded] = useState(Boolean(defaultValue || value || contexts.length));
  const [pending, setPending] = useState(false);
  const [submitError, setSubmitError] = useState<string>();
  const [status, setStatus] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<PromptBarSkill<TSkillData> | null>(defaultSkill);
  const skill = controlledSkill === undefined ? selectedSkill : controlledSkill;
  const [trigger, setTrigger] = useState<Trigger | null>(null);
  const [selectedId, setSelectedId] = useState("");
  const [contextOpen, setContextOpen] = useState(false);
  const text = value ?? draft;
  const busy = pending || submitting;
  const canSubmit = Boolean(text.trim() || attachments.length);
  const message = error || submitError;
  const isExpanded = expanded || Boolean(text || contexts.length || attachments.length || skill);
  const heightLimit = Number.isFinite(maxHeight) ? Math.max(96, maxHeight) : 240;
  const fileLimit = Number.isFinite(maxFiles) ? Math.max(1, Math.floor(maxFiles)) : 5;
  const sizeLimit = Number.isFinite(maxFileSize) ? Math.max(1, maxFileSize) : 10 * 1024 * 1024;
  const options = (trigger?.kind === "/"
    ? skills.map((option) => ({ ...option, select: () => updateSkill(option) }))
    : contextOptions.filter((option) => !contexts.some((context) => context.id === option.id))
      .map((option) => ({ ...option, select: () => onContextAdd?.(option) }))
  ).filter((option) => `${option.id} ${option.label} ${option.description || ""}`.toLowerCase().includes(trigger?.query.toLowerCase() || ""));
  const activeId = options.some((option) => option.id === selectedId) ? selectedId : options[0]?.id;
  const menuOpen = Boolean(trigger) && !disabled && !busy;
  if (contextUsage && (
    !Number.isFinite(contextUsage.usedTokens) || contextUsage.usedTokens < 0 ||
    !Number.isFinite(contextUsage.maxTokens) || contextUsage.maxTokens <= 0 ||
    (contextUsage.cacheHitRate !== undefined && (!Number.isFinite(contextUsage.cacheHitRate) || contextUsage.cacheHitRate < 0 || contextUsage.cacheHitRate > 100))
  )) throw new RangeError("PromptBar contextUsage requires non-negative usedTokens, positive maxTokens, and a cacheHitRate between 0 and 100.");
  const usagePercent = contextUsage ? contextUsage.usedTokens / contextUsage.maxTokens * 100 : undefined;
  const compactTokens = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
  const contextCount = contexts.length + attachments.length + (skill ? 1 : 0);
  const contextSummary = [
    `${contexts.length} context ${contexts.length === 1 ? "item" : "items"}`,
    skill ? `${skill.label} skill` : "No skill selected",
    `${attachments.length} ${attachments.length === 1 ? "attachment" : "attachments"}`,
    modelLabel,
    contextUsage ? `${contextUsage.usedTokens.toLocaleString("en-US")} of ${contextUsage.maxTokens.toLocaleString("en-US")} context tokens used, ${usagePercent?.toFixed(1)} percent` : "Context usage unavailable",
    contextUsage?.cacheHitRate !== undefined ? `Average cache hit rate ${contextUsage.cacheHitRate.toFixed(1)} percent` : null,
  ].filter(Boolean).join(". ");

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    function resize() {
      if (!textarea) return;
      textarea.style.height = "0px";
      textarea.style.height = `${isExpanded ? Math.max(96, Math.min(textarea.scrollHeight, heightLimit)) : 48}px`;
    }
    resize();
    let width = textarea.clientWidth;
    const observer = new ResizeObserver(() => {
      if (textarea.clientWidth !== width) {
        width = textarea.clientWidth;
        resize();
      }
    });
    observer.observe(textarea);
    return () => observer.disconnect();
  }, [text, heightLimit, isExpanded]);

  // cmdk owns the generated list and option IDs. Connect the textarea to those
  // actual nodes while keeping typing focus out of the non-modal popover.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const textarea = textareaRef.current;
      const option = activeId ? optionRefs.current.get(activeId) : undefined;
      if (menuOpen && listRef.current) textarea?.setAttribute("aria-controls", listRef.current.id);
      else textarea?.removeAttribute("aria-controls");
      if (menuOpen && option) {
        textarea?.setAttribute("aria-activedescendant", option.id);
        option.scrollIntoView({ block: "nearest" });
      } else textarea?.removeAttribute("aria-activedescendant");
    });
    return () => cancelAnimationFrame(frame);
  }, [menuOpen, activeId]);

  useEffect(() => () => { requestId.current += 1; }, []);

  function updateText(next: string) {
    if (value === undefined) setDraft(next);
    onValueChange?.(next);
    setSubmitError(undefined);
    setStatus("");
  }

  function updateSkill(next: PromptBarSkill<TSkillData> | null) {
    if (controlledSkill === undefined) setSelectedSkill(next);
    onSkillChange?.(next);
  }

  function findTrigger(next: string, caret: number) {
    const match = next.slice(0, caret).match(/(?:^|\s)([/@])([^\s/@]*)$/);
    if (!match || (match[1] === "/" ? !skills.length : !onContextAdd)) {
      setTrigger(null);
      return;
    }
    setTrigger({ kind: match[1] as "/" | "@", query: match[2], start: caret - match[2].length - 1, end: caret });
  }

  function choose(option: (typeof options)[number]) {
    if (!trigger) return;
    option.select();
    const caret = trigger.start;
    updateText(text.slice(0, caret) + text.slice(trigger.end));
    setTrigger(null);
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(caret, caret);
    });
  }

  function attach(files: FileList | null) {
    if (!files?.length) return;
    const next = [...attachments];
    for (const file of Array.from(files)) {
      if (file.size > sizeLimit) {
        setSubmitError(`${file.name} exceeds the ${Math.round(sizeLimit / 1024 / 1024 * 10) / 10} MB limit.`);
        return;
      }
      if (!next.some((item) => item.name === file.name && item.size === file.size && item.lastModified === file.lastModified)) next.push(file);
    }
    if (next.length > fileLimit) {
      setSubmitError(`Attach up to ${fileLimit} files at a time.`);
      return;
    }
    setAttachments(next);
    setSubmitError(undefined);
    setExpanded(true);
    textareaRef.current?.focus();
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (disabled || busy || inFlight.current || !canSubmit) return;
    const currentRequest = ++requestId.current;
    inFlight.current = true;
    setPending(true);
    setTrigger(null);
    setSubmitError(undefined);
    setStatus("");
    try {
      await onSubmit({ text: text.trim(), contexts: [...contexts], skill, attachments: [...attachments] });
      if (currentRequest !== requestId.current) return;
      if (textareaRef.current?.value === text) updateText("");
      setAttachments([]);
      updateSkill(null);
      setStatus("Prompt sent.");
    } catch (cause) {
      if (currentRequest !== requestId.current) return;
      setSubmitError(cause instanceof Error && cause.message ? cause.message : "The prompt could not be sent. Try again.");
    } finally {
      if (currentRequest === requestId.current) {
        inFlight.current = false;
        setPending(false);
      }
    }
  }

  function stop() {
    try {
      onStop?.();
      requestId.current += 1;
      inFlight.current = false;
      setPending(false);
      setStatus("Stopped. Your draft is kept.");
      textareaRef.current?.focus();
    } catch (cause) {
      setSubmitError(cause instanceof Error ? cause.message : "Could not stop the request.");
    }
  }

  const chips = [
    ...(skill ? [{ key: `skill-${skill.id}`, label: skill.label, icon: skill.icon || <Sparkles />, remove: () => updateSkill(null) }] : []),
    ...contexts.map((context) => ({ key: `context-${context.id}`, label: context.label, icon: context.icon || <AtSign />, remove: onContextRemove ? () => onContextRemove(context.id) : undefined })),
    ...attachments.map((file, index) => ({ key: `file-${index}`, label: file.name, icon: <FileText />, remove: () => setAttachments((current) => current.filter((_, position) => position !== index)) })),
  ];

  return (
    <form onSubmit={submit} className={cn("w-full min-w-0", className)}>
      <FieldGroup>
      <Field data-invalid={Boolean(message)} data-disabled={disabled} className="gap-2">
        <FieldLabel htmlFor={id} className="sr-only">{label}</FieldLabel>
        <input ref={fileInputRef} type="file" accept={accept} multiple tabIndex={-1} className="hidden" aria-label="Choose attachments" disabled={disabled || busy} onChange={(event) => {
          attach(event.target.files);
          event.target.value = "";
        }} />
        <Popover open={menuOpen} onOpenChange={(open) => { if (!open) setTrigger(null); }}>
          <PopoverAnchor asChild>
            <motion.div layout={!reducedMotion} transition={{ duration: reducedMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}>
              <InputGroup aria-busy={busy} data-disabled={disabled} className={cn("block h-auto rounded-xl border-0 bg-transparent! ring-1 ring-inset ring-border has-disabled:opacity-100 data-[disabled=true]:opacity-50 has-[[data-slot=input-group-control]:focus-visible]:ring-1 has-[[data-slot][aria-invalid=true]]:ring-1", isExpanded && "pb-12")}>
                {chips.length > 0 && (
                  <motion.div layout="position" className="flex flex-wrap gap-1.5 px-3 pt-3">
                    {chips.map((chip) => (
                      <Badge key={chip.key} variant="secondary" className="h-7 max-w-full min-w-0 gap-1.5 rounded-md font-normal">
                        <span aria-hidden className="shrink-0 [&_svg]:size-3">{chip.icon}</span>
                        <span className="truncate">{chip.label}</span>
                        {chip.remove && <InputGroupButton size="icon-xs" disabled={disabled || busy} aria-label={`Remove ${chip.label}`} onClick={chip.remove}><X aria-hidden /></InputGroupButton>}
                      </Badge>
                    ))}
                  </motion.div>
                )}
                <motion.div layout="position">
                  <InputGroupTextarea
                    ref={textareaRef} id={id} value={text} placeholder={placeholder}
                    disabled={disabled} readOnly={busy} aria-invalid={Boolean(message)}
                    role="combobox" aria-autocomplete="list" aria-haspopup="listbox" aria-expanded={menuOpen}
                    aria-describedby={`${id}-hint${message ? ` ${id}-error` : ""}`}
                    rows={1} className={cn("min-h-0 field-sizing-fixed px-3.5 py-3.5 text-sm leading-5", !isExpanded && "pr-30 overflow-hidden")}
                    onFocus={() => setExpanded(true)}
                    onChange={(event) => { updateText(event.target.value); findTrigger(event.target.value, event.target.selectionStart); }}
                    onSelect={(event) => { if (event.currentTarget.selectionStart === event.currentTarget.selectionEnd) findTrigger(event.currentTarget.value, event.currentTarget.selectionStart); }}
                    onCompositionStart={() => { composing.current = true; }}
                    onCompositionEnd={() => { composing.current = false; }}
                    onKeyDown={(event) => {
                      if (event.nativeEvent.isComposing || composing.current || event.nativeEvent.keyCode === 229) return;
                      if (menuOpen) {
                        if (event.key === "Escape") { event.preventDefault(); setTrigger(null); return; }
                        if ((event.key === "ArrowDown" || event.key === "ArrowUp") && options.length) {
                          event.preventDefault();
                          const index = options.findIndex((option) => option.id === activeId);
                          setSelectedId(options[(index + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length].id);
                          return;
                        }
                        if ((event.key === "Enter" && !event.shiftKey) || event.key === "Tab") {
                          if (options.length || event.key === "Enter") event.preventDefault();
                          const option = options.find((item) => item.id === activeId);
                          if (option) choose(option);
                          return;
                        }
                      }
                      if (event.key === "Escape" && !text && !chips.length) { setExpanded(false); event.currentTarget.blur(); }
                      if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); }
                    }}
                  />
                </motion.div>
                <motion.div layout="position" className="pointer-events-none absolute right-2.5 bottom-2 left-2.5 flex items-center gap-1.5">
                    <motion.fieldset disabled={disabled || busy || !isExpanded} inert={!isExpanded} aria-hidden={!isExpanded} aria-label="Prompt options" initial={false} animate={{ opacity: isExpanded ? 1 : 0 }} transition={{ duration: reducedMotion ? 0 : 0.18 }} className={cn("mr-auto min-w-0 max-w-full [&>button]:max-w-full", isExpanded && "pointer-events-auto")}>
                      {toolbar}
                    </motion.fieldset>
                  <div className="pointer-events-auto ml-auto flex shrink-0 items-center gap-0.5">
                    <InputGroupButton size="icon-sm" disabled={disabled || busy} aria-label="Attach files" title="Attach files" onClick={() => fileInputRef.current?.click()}><Paperclip aria-hidden /></InputGroupButton>
                    <HoverCard open={contextOpen && !menuOpen} onOpenChange={setContextOpen} openDelay={150} closeDelay={100}>
                      <HoverCardTrigger asChild>
                        <InputGroupButton size="icon-sm" aria-label="Context details" aria-describedby={`${id}-context-summary`} aria-expanded={contextOpen && !menuOpen} aria-controls={contextOpen && !menuOpen ? `${id}-context-card` : undefined} onClick={() => setContextOpen((open) => !open)} className="relative rounded-full">
                          <svg aria-hidden viewBox="0 0 32 32" className="size-7! -rotate-90" fill="none">
                            <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="2" className="text-border" />
                            {usagePercent !== undefined && usagePercent > 0 && <circle cx="16" cy="16" r="11" pathLength="100" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray={`${Math.min(100, usagePercent)} 100`} className="text-primary" />}
                          </svg>
                        </InputGroupButton>
                      </HoverCardTrigger>
                      <HoverCardContent id={`${id}-context-card`} role="region" aria-labelledby={`${id}-context-title`} side="top" align="end" sideOffset={8} collisionPadding={12} className="max-h-[var(--radix-hover-card-content-available-height)] w-80 max-w-[calc(100vw-1.5rem)] gap-3 overflow-y-auto motion-reduce:animate-none">
                        <div className="flex flex-col gap-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span id={`${id}-context-title`} className="font-medium">Context window</span>
                            <span className="font-mono text-xs tabular-nums text-muted-foreground">{contextUsage ? `${compactTokens.format(contextUsage.usedTokens)}/${compactTokens.format(contextUsage.maxTokens)} (${usagePercent?.toFixed(1)}%)` : "Usage unavailable"}</span>
                          </div>
                          {usagePercent !== undefined && <Progress value={Math.min(100, usagePercent)} aria-label="Context window usage" aria-valuetext={`${usagePercent.toFixed(1)}% used`} className="h-2.5" />}
                          <div className="flex items-center justify-between gap-3 text-xs">
                            <span className="text-muted-foreground">Average cache hit rate</span>
                            <span className="font-mono tabular-nums">{contextUsage?.cacheHitRate !== undefined ? `${contextUsage.cacheHitRate.toFixed(1)}%` : "Unavailable"}</span>
                          </div>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs font-medium">Included context</span>
                          <span className="font-mono text-xs text-muted-foreground">{contextCount} {contextCount === 1 ? "item" : "items"}</span>
                        </div>
                        <div className="flex flex-col gap-2">
                          {[
                            { label: "Context", items: contexts, icon: <AtSign />, empty: "No context added" },
                            { label: "Skill", items: skill ? [skill] : [], icon: <Sparkles />, empty: "No skill selected" },
                            { label: "Attachments", items: attachments.map((file, index) => ({ id: String(index), label: file.name, description: `${Math.max(1, Math.ceil(file.size / 1024)).toLocaleString()} KB` })), icon: <Paperclip />, empty: "No files attached" },
                          ].map((group) => (
                            <div key={group.label} className="flex items-start gap-2.5">
                              <span aria-hidden className="pt-0.5 text-muted-foreground [&_svg]:size-3.5">{group.icon}</span>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium">{group.label}</p>
                                {group.items.length ? <ul className="mt-1 flex flex-col gap-1.5">{group.items.map((item) => <li key={item.id} className="text-xs"><span className="block break-words">{item.label}</span>{item.description && <span className="block text-muted-foreground">{item.description}</span>}</li>)}</ul> : <p className="text-xs text-muted-foreground">{group.empty}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                        <Separator />
                        <div className="flex flex-col gap-2 text-xs">
                          {modelLabel && <div className="flex items-start justify-between gap-3"><span className="text-muted-foreground">Model</span><span className="text-right">{modelLabel}</span></div>}
                          <span className="font-medium">Tools</span>
                          {skills.length > 0 && <div className="flex items-center justify-between gap-3"><span className="text-muted-foreground">{skills.length} skills available</span><kbd className="font-mono">/</kbd></div>}
                          {onContextAdd && <div className="flex items-center justify-between gap-3"><span className="text-muted-foreground">Add context</span><kbd className="font-mono">@</kbd></div>}
                          <p className="text-muted-foreground">Attach up to {fileLimit} files, {Math.round(sizeLimit / 1024 / 1024 * 10) / 10} MB each.</p>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                    <InputGroupButton type={busy && onStop ? "button" : "submit"} variant={busy || canSubmit ? "default" : "ghost"} size="icon-sm" disabled={disabled || (busy ? !onStop : !canSubmit)} aria-label={busy ? (onStop ? "Stop response" : "Sending prompt") : "Send prompt"} onClick={busy && onStop ? stop : undefined} className="ml-1 rounded-lg">
                      {busy ? (onStop ? <Square aria-hidden /> : <LoaderCircle aria-hidden className="animate-spin motion-reduce:animate-none" />) : <ArrowUp aria-hidden />}
                    </InputGroupButton>
                  </div>
                </motion.div>
              </InputGroup>
            </motion.div>
          </PopoverAnchor>
          <PopoverContent side="top" align="start" sideOffset={8} className="w-[var(--radix-popover-trigger-width)] max-w-[calc(100vw-2rem)] p-0" onOpenAutoFocus={(event) => event.preventDefault()} onCloseAutoFocus={(event) => event.preventDefault()} onInteractOutside={(event) => { if (event.target === textareaRef.current) event.preventDefault(); }}>
            <Command shouldFilter={false} value={activeId || ""} onValueChange={setSelectedId}>
              <CommandList ref={listRef} aria-label={trigger?.kind === "/" ? "Skills" : "Context"}>
                <CommandEmpty>No {trigger?.kind === "/" ? "skills" : "context"} found.</CommandEmpty>
                <CommandGroup heading={trigger?.kind === "/" ? "Skills" : "Add context"}>
                  {options.map((option) => (
                    <CommandItem key={option.id} value={option.id} ref={(node) => { if (node) optionRefs.current.set(option.id, node); else optionRefs.current.delete(option.id); }} onSelect={() => choose(option)} onMouseDown={(event) => event.preventDefault()} className="gap-2.5 py-2">
                      <span aria-hidden className="shrink-0 [&_svg]:size-4">{option.icon || (trigger?.kind === "/" ? <Sparkles /> : <FileText />)}</span>
                      <span className="min-w-0"><span className="block truncate">{option.label}</span>{option.description && <span className="block text-xs text-muted-foreground">{option.description}</span>}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <p id={`${id}-hint`} className="sr-only">Type / for skills or @ for context. Use arrow keys and Enter to choose. Enter to send, Shift+Enter for a new line. Escape closes suggestions or collapses an empty prompt.</p>
        <p id={`${id}-context-summary`} className="sr-only">{contextSummary}</p>
        {message && <FieldError id={`${id}-error`} className="text-xs">{message}</FieldError>}
        <p role="status" aria-live="polite" className="sr-only">{busy ? "Sending prompt..." : status}</p>
      </Field>
      </FieldGroup>
    </form>
  );
}
