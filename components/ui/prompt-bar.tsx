"use client";

import { ArrowUp, AtSign, FileText, LoaderCircle, Paperclip, Square, X, Zap } from "lucide-react";
import { EditorContent, Node, NodeViewWrapper, ReactNodeViewRenderer, useEditor, type Editor, type JSONContent, type NodeViewProps } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { EditorState } from "@tiptap/pm/state";
import { motion, useReducedMotion } from "motion/react";
import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { InputGroup, InputGroupButton } from "@/components/ui/input-group";
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

type PromptChip = { key: string; label: string; icon: ReactNode; remove?: () => void; restore: () => void };
const ChipContext = createContext<{ chips: PromptChip[]; disabled: boolean }>({ chips: [], disabled: false });

function PromptChipView({ node }: NodeViewProps) {
  const { chips, disabled } = useContext(ChipContext);
  const chip = chips.find((item) => item.key === node.attrs.key);
  return (
    <NodeViewWrapper as="span" contentEditable={false} className="inline-block max-w-full align-baseline">
      <Badge variant="secondary" className={cn("group/chip relative mx-0.5 h-6 max-w-full min-w-0 gap-1.5 rounded-md px-1.5 align-baseline font-normal", chip?.remove && "pr-6")}>
        <span aria-hidden className="shrink-0 [&_svg]:size-3">{chip?.icon || <AtSign />}</span>
        <span className="max-w-52 truncate">{chip?.label || node.attrs.label}</span>
        {chip?.remove && <InputGroupButton size="icon-xs" disabled={disabled} aria-label={`Remove ${chip.label}`} onMouseDown={(event) => event.preventDefault()} onClick={chip.remove} className="absolute right-0 top-0 size-6 cursor-pointer bg-secondary opacity-0 transition-opacity group-hover/chip:opacity-100 group-focus-within/chip:opacity-100 [@media(hover:none)]:opacity-100"><X aria-hidden /></InputGroupButton>}
      </Badge>
    </NodeViewWrapper>
  );
}

const PromptChipNode = Node.create({
  name: "promptChip", group: "inline", inline: true, atom: true, selectable: false,
  addAttributes: () => ({ key: { default: "" }, label: { default: "" } }),
  // Chips can only be created through this component, never by pasted HTML.
  parseHTML: () => [],
  renderHTML: ({ node }) => ["span", { "data-prompt-chip": node.attrs.key }, node.attrs.label],
  renderText: ({ node }) => node.attrs.label,
  addNodeView: () => ReactNodeViewRenderer(PromptChipView),
});

function promptText(editor: Editor) {
  return editor.state.doc.textBetween(0, editor.state.doc.content.size, "\n", (node) => node.type.name === "hardBreak" ? "\n" : "");
}

function textDocument(text: string): JSONContent {
  return { type: "doc", content: text.split("\n").map((line) => ({ type: "paragraph", content: line ? [{ type: "text", text: line }] : [] })) };
}

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
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef(new Map<string, HTMLDivElement>());
  const inFlight = useRef(false);
  const requestId = useRef(0);
  const composing = useRef(false);
  const syncingEditor = useRef(false);
  const chipHistory = useRef(new Map<string, PromptChip>());
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

  const updateSkill = useCallback((next: PromptBarSkill<TSkillData> | null) => {
    if (controlledSkill === undefined) setSelectedSkill(next);
    onSkillChange?.(next);
  }, [controlledSkill, onSkillChange]);
  const chips: PromptChip[] = useMemo(() => [
    ...(skill ? [{ key: `skill-${skill.id}`, label: skill.label, icon: skill.icon || <Zap />, remove: () => updateSkill(null), restore: () => updateSkill(skill) }] : []),
    ...contexts.map((context) => ({ key: `context-${context.id}`, label: context.label, icon: context.icon || <AtSign />, remove: onContextRemove ? () => onContextRemove(context.id) : undefined, restore: () => onContextAdd?.(context) })),
    ...attachments.map((file) => ({ key: `file-${file.name}-${file.size}-${file.lastModified}`, label: file.name, icon: <FileText />, remove: () => setAttachments((current) => current.filter((item) => item !== file)), restore: () => setAttachments((current) => current.includes(file) ? current : [...current, file]) })),
  ], [skill, updateSkill, contexts, onContextRemove, onContextAdd, attachments]);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit.configure({
      blockquote: false, bold: false, bulletList: false, code: false, codeBlock: false,
      dropcursor: false, gapcursor: false, heading: false, horizontalRule: false,
      italic: false, link: false, listItem: false, listKeymap: false, orderedList: false,
      strike: false, trailingNode: false, underline: false,
    }), PromptChipNode],
    content: textDocument(text),
    onFocus: () => setExpanded(true),
    onUpdate: ({ editor: current }) => {
      if (syncingEditor.current) return;
      const present = new Set<string>();
      current.state.doc.descendants((node) => { if (node.type.name === "promptChip") present.add(node.attrs.key); });
      for (const chip of chips) if (!present.has(chip.key)) chip.remove?.();
      for (const key of present) if (!chips.some((chip) => chip.key === key)) chipHistory.current.get(key)?.restore();
      updateText(promptText(current));
      findTrigger(current);
    },
    onSelectionUpdate: ({ editor: current }) => findTrigger(current),
    editorProps: {
      attributes: {
        id, "data-slot": "input-group-control", class: "whitespace-pre-wrap break-words outline-none [&_p]:m-0",
        role: "combobox", "aria-label": label, "aria-multiline": "true",
        "aria-autocomplete": "list", "aria-haspopup": "listbox",
        "aria-expanded": String(menuOpen), "aria-invalid": String(Boolean(message)),
        "aria-disabled": String(disabled), "aria-readonly": String(busy),
        "aria-describedby": `${id}-hint${message ? ` ${id}-error` : ""}`,
      },
      handleKeyDown: (_view, event) => handleEditorKey(event),
      handlePaste: (view, event) => {
        event.preventDefault();
        const pasted = event.clipboardData?.getData("text/plain") || "";
        if (pasted) view.dispatch(view.state.tr.insertText(pasted.replace(/\r\n?/g, "\n")));
        return true;
      },
    },
  });

  // Keep app-owned selections in the document without rebuilding it while typing.
  // Existing chips retain their positions; newly supplied chips use the caret.
  useEffect(() => {
    if (!editor) return;
    for (const chip of chips) chipHistory.current.set(chip.key, chip);
    if (editor.isEditable !== (!disabled && !busy)) editor.setEditable(!disabled && !busy, false);
    const transaction = editor.state.tr.setMeta("addToHistory", false);
    const present = new Set<string>();
    editor.state.doc.descendants((node, position) => {
      if (node.type.name !== "promptChip") return;
      if (chips.some((chip) => chip.key === node.attrs.key) && !present.has(node.attrs.key)) present.add(node.attrs.key);
      else transaction.delete(transaction.mapping.map(position), transaction.mapping.map(position + node.nodeSize));
    });
    let position = transaction.mapping.map(editor.state.selection.from);
    for (const chip of chips) {
      if (present.has(chip.key)) continue;
      transaction.insert(position, editor.schema.nodes.promptChip.create({ key: chip.key, label: chip.label }));
      position += 1;
    }
    if (transaction.docChanged) {
      syncingEditor.current = true;
      editor.view.dispatch(transaction);
      syncingEditor.current = false;
    }
  }, [editor, chips, disabled, busy]);

  useEffect(() => {
    if (editor && value !== undefined && promptText(editor) !== value) {
      // A consumer replacing the controlled value replaces the text, retaining
      // selected metadata inline at the start of the new draft.
      const document = textDocument(value);
      document.content![0].content!.unshift(...chips.map((chip) => ({ type: "promptChip", attrs: { key: chip.key, label: chip.label } })));
      editor.commands.setContent(document, { emitUpdate: false });
    }
    // Only a changed controlled value replaces text. Ordinary editor transactions
    // must not reset the document or caret while onValueChange is being delivered.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, value]);

  // cmdk owns the generated list and option IDs. Connect the editor to those
  // actual nodes while keeping typing focus out of the non-modal popover.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const input = editor?.view.dom;
      const option = activeId ? optionRefs.current.get(activeId) : undefined;
      if (menuOpen && listRef.current) input?.setAttribute("aria-controls", listRef.current.id);
      else input?.removeAttribute("aria-controls");
      if (menuOpen && option) {
        input?.setAttribute("aria-activedescendant", option.id);
        option.scrollIntoView({ block: "nearest" });
      } else input?.removeAttribute("aria-activedescendant");
    });
    return () => cancelAnimationFrame(frame);
  }, [editor, menuOpen, activeId]);

  useEffect(() => () => { requestId.current += 1; }, []);

  function updateText(next: string) {
    if (value === undefined) setDraft(next);
    onValueChange?.(next);
    setSubmitError(undefined);
    setStatus("");
  }

  function findTrigger(current: Editor) {
    const { $from, empty } = current.state.selection;
    const before = $from.parent.textBetween(0, $from.parentOffset, "", "\uFFFC");
    const match = empty && before.match(/(?:^|[\s\uFFFC])([/@])([^\s/@\uFFFC]*)$/);
    if (!match || (match[1] === "/" ? !skills.length : !onContextAdd)) {
      setTrigger(null);
      return;
    }
    setTrigger({ kind: match[1] as "/" | "@", query: match[2], start: $from.pos - match[2].length - 1, end: $from.pos });
  }

  function choose(option: (typeof options)[number]) {
    if (!trigger || !editor) return;
    const key = `${trigger.kind === "/" ? "skill" : "context"}-${option.id}`;
    syncingEditor.current = true;
    editor.chain().focus().insertContentAt({ from: trigger.start, to: trigger.end }, { type: "promptChip", attrs: { key, label: option.label } }).run();
    syncingEditor.current = false;
    updateText(promptText(editor));
    option.select();
    setTrigger(null);
  }

  function handleEditorKey(event: KeyboardEvent) {
    if (event.target instanceof HTMLElement && event.target.closest("button")) return false;
    if (event.isComposing || composing.current || event.keyCode === 229) return false;
    if (menuOpen) {
      if (event.key === "Escape") { setTrigger(null); return true; }
      if ((event.key === "ArrowDown" || event.key === "ArrowUp") && options.length) {
        const index = options.findIndex((option) => option.id === activeId);
        setSelectedId(options[(index + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length].id);
        return true;
      }
      if ((event.key === "Enter" && !event.shiftKey) || event.key === "Tab") {
        const option = options.find((item) => item.id === activeId);
        if (option) choose(option);
        return Boolean(option) || event.key === "Enter";
      }
    }
    if (event.key === "Escape" && !text && !chips.length) { setExpanded(false); editor?.commands.blur(); return true; }
    if (event.key === "Enter" && !event.shiftKey) { formRef.current?.requestSubmit(); return true; }
    return false;
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
    editor?.commands.focus();
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
      if (editor && promptText(editor) === text) {
        // A sent draft starts a new editing history. Undo must not resurrect
        // files or commands from an already submitted prompt.
        editor.view.updateState(EditorState.create({
          schema: editor.schema, doc: editor.schema.nodeFromJSON(textDocument("")),
          plugins: editor.state.plugins,
        }));
        chipHistory.current.clear();
        updateText("");
      }
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
      editor?.commands.focus();
    } catch (cause) {
      setSubmitError(cause instanceof Error ? cause.message : "Could not stop the request.");
    }
  }

  return (
    <ChipContext.Provider value={{ chips, disabled: disabled || busy }}>
    <form ref={formRef} onSubmit={submit} className={cn("w-full min-w-0", className)}>
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
                <motion.div layout="position">
                  <div className="relative">
                  {!text && !chips.length && <span aria-hidden className={cn("pointer-events-none absolute left-3.5 text-sm text-muted-foreground", isExpanded ? "top-3.5 leading-6" : "top-1/2 -translate-y-1/2 leading-5")}>{placeholder}</span>}
                  <EditorContent
                    editor={editor}
                    className={cn("overflow-y-auto px-3.5 py-3.5 text-sm", isExpanded ? "leading-6 [&>.tiptap]:min-h-17" : "pr-30 overflow-hidden leading-5 [&>.tiptap]:min-h-5")}
                    style={{ maxHeight: heightLimit }}
                    onCompositionStart={() => { composing.current = true; }}
                    onCompositionEnd={() => { composing.current = false; }}
                  />
                  </div>
                </motion.div>
                <motion.div layout="position" className={cn("pointer-events-none absolute right-2.5 left-2.5 flex items-center gap-1.5", isExpanded ? "bottom-2" : "top-1/2 -translate-y-1/2")}>
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
                            { label: "Skill", items: skill ? [skill] : [], icon: <Zap />, empty: "No skill selected" },
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
                    <InputGroupButton key={busy ? "stop" : "send"} type={busy && onStop ? "button" : "submit"} variant={busy || canSubmit ? "default" : "ghost"} size="icon-sm" disabled={disabled || (busy ? !onStop : !canSubmit)} aria-label={busy ? (onStop ? "Stop response" : "Sending prompt") : "Send prompt"} onClick={() => { if (busy && onStop) stop(); }} className="ml-1 cursor-pointer rounded-lg">
                      {busy ? (onStop ? <Square aria-hidden /> : <LoaderCircle aria-hidden className="animate-spin motion-reduce:animate-none" />) : <ArrowUp aria-hidden />}
                    </InputGroupButton>
                  </div>
                </motion.div>
              </InputGroup>
            </motion.div>
          </PopoverAnchor>
          <PopoverContent side="top" align="start" sideOffset={8} className="w-[var(--radix-popover-trigger-width)] max-w-[calc(100vw-2rem)] p-0" onOpenAutoFocus={(event) => event.preventDefault()} onCloseAutoFocus={(event) => event.preventDefault()} onInteractOutside={(event) => { if (event.target instanceof globalThis.Node && editor?.view.dom.contains(event.target)) event.preventDefault(); }}>
            <Command shouldFilter={false} value={activeId || ""} onValueChange={setSelectedId}>
              <CommandList ref={listRef} aria-label={trigger?.kind === "/" ? "Skills" : "Context"}>
                <CommandEmpty>No {trigger?.kind === "/" ? "skills" : "context"} found.</CommandEmpty>
                <CommandGroup heading={trigger?.kind === "/" ? "Skills" : "Add context"}>
                  {options.map((option) => (
                    <CommandItem key={option.id} value={option.id} ref={(node) => { if (node) optionRefs.current.set(option.id, node); else optionRefs.current.delete(option.id); }} onSelect={() => choose(option)} onMouseDown={(event) => event.preventDefault()} className="cursor-pointer gap-2.5 py-2">
                      <span aria-hidden className="shrink-0 [&_svg]:size-4">{option.icon || (trigger?.kind === "/" ? <Zap /> : <FileText />)}</span>
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
    </ChipContext.Provider>
  );
}
