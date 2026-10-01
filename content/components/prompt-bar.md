## Usage

```tsx
import { PromptBar } from "@/components/ui/prompt-bar";

export function PromptInput() {
  return (
    <PromptBar
      contexts={[
        { id: "page", label: "Current page", description: "The page being edited" },
      ]}
      onSubmit={async ({ text, contexts }) => {
        // Supply this endpoint in your own app.
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            contexts: contexts.map(({ id, label }) => ({ id, label })),
          }),
        });
        if (!response.ok) throw new Error("The prompt could not be sent. Try again.");
      }}
    />
  );
}
```

The component owns its pending state while it awaits `onSubmit`. Resolve the callback when your app has accepted the submission. Throw or reject to show an error and keep the draft. The component has no AI SDK dependency and does not make network requests itself. Use it inside a client component.

## Custom slash commands and context

Supply your own slash commands through `skills` and your own mention choices through `contextOptions`. There are no built-in skills, file paths, or prompt templates. Both menus search the item's `id`, `label`, and `description`.

- `/` selects one skill. Selecting another replaces it. The skill can carry `instructions` and typed `data` for any behavior your app supports.
- `@` calls `onContextAdd` with the complete context item. Update `contexts` to display the chip. Already selected IDs are hidden from the menu.
- Selecting either replaces the typed command fragment with a chip at the caret. Chips stay inline with the surrounding text. The plain text and selected objects arrive separately in `onSubmit`.
- `data` is app-owned and passed through unchanged. Use it for text content, file IDs, page references, or other metadata. A file label alone does not load its contents.

This example assembles a usable prompt in the consumer. Its context data is typed, so the same payload is available in `onContextAdd` and `onSubmit` without a cast:

```tsx
"use client";

import { useState } from "react";
import {
  PromptBar,
  type PromptBarContext,
  type PromptBarSkill,
} from "@/components/ui/prompt-bar";

type FileContext = { path: string; content: string };
type SkillData = { mode: "review" | "rewrite" };

const skills: PromptBarSkill<SkillData>[] = [
  {
    id: "review",
    label: "Code review",
    description: "Check correctness and accessibility",
    instructions: "Review the supplied code. Explain actionable issues and fixes.",
    data: { mode: "review" },
  },
  {
    id: "rewrite",
    label: "Rewrite",
    instructions: "Rewrite the supplied code to satisfy the request. Explain the changes.",
    data: { mode: "rewrite" },
  },
];

export function ReviewInput({
  files,
  send,
}: {
  files: FileContext[];
  send: (prompt: string, mode?: SkillData["mode"]) => Promise<void>;
}) {
  const [contexts, setContexts] = useState<PromptBarContext<FileContext>[]>([]);
  const contextOptions: PromptBarContext<FileContext>[] = files.map((file) => ({
    id: file.path,
    label: file.path,
    description: "Include this file's contents",
    data: file,
  }));

  return (
    <PromptBar<FileContext, SkillData>
      skills={skills}
      contextOptions={contextOptions}
      contexts={contexts}
      onContextAdd={(item) => setContexts((current) =>
        current.some((context) => context.id === item.id) ? current : [...current, item]
      )}
      onContextRemove={(id) => setContexts((current) =>
        current.filter((item) => item.id !== id)
      )}
      onSubmit={async ({ text, skill, contexts: selected, attachments }) => {
        // This example supports text attachments. Restrict and validate as needed.
        const attachedText = await Promise.all(attachments.map(async (file) =>
          `File: ${file.name}\n${await file.text()}`
        ));
        const prompt = [
          skill?.instructions,
          text,
          ...selected.map((item) => item.data
            ? `File: ${item.data.path}\n${item.data.content}`
            : undefined
          ),
          ...attachedText,
        ].filter(Boolean).join("\n\n");

        await send(prompt, skill?.data?.mode);
      }}
      accept=".txt,.md,.ts,.tsx"
    />
  );
}
```

Prompt assembly, file loading, upload, tool execution, and model requests belong to your app. The prompt bar does not append `instructions` or `data` to `text` automatically. For remote context, pass an ID in `data`, resolve it in your submit handler or server, and throw if it cannot be loaded. Validate permissions, contents, and file limits on your server; `accept` is only a picker hint. Keep secrets out of client-side options.

### Control the selected skill

By default, the prompt bar owns skill selection. Use `defaultSkill` for an initial selection, or pass `skill` and `onSkillChange` to control it:

```tsx
const [skill, setSkill] = useState<PromptBarSkill<SkillData> | null>(null);

<PromptBar<FileContext, SkillData>
  skills={skills}
  skill={skill}
  onSkillChange={setSkill}
  onSubmit={sendSubmission}
/>
```

In this fragment, `sendSubmission` is your callback accepting `PromptBarSubmission<FileContext, SkillData>`. `onSkillChange` receives the selected item, or `null` when its chip is removed or a submission succeeds. Failures and Stop preserve the selection. Keep controlled and uncontrolled modes consistent for the component's lifetime. In controlled mode, your app must update `skill` when the callback fires.

## With Model Picker

Install Model Picker separately with `npx shadcn add @akoder/model-picker`, then compose it through the `toolbar` slot:

```tsx
import { useState } from "react";
import { ModelPicker, defaultModelProviders } from "@/components/ui/model-picker";
import {
  PromptBar,
  type PromptBarContext,
  type PromptBarSubmission,
} from "@/components/ui/prompt-bar";

export function ContextualInput({
  send,
}: {
  send: (message: PromptBarSubmission & { model: string }) => Promise<void>;
}) {
  const [model, setModel] = useState(defaultModelProviders[0].models[0].id);
  const [contexts, setContexts] = useState<PromptBarContext[]>([
    { id: "page", label: "Current page" },
    { id: "component", label: "model-picker.tsx" },
  ]);

  return (
    <PromptBar
      contexts={contexts}
      onContextRemove={(id) =>
        setContexts((current) => current.filter((context) => context.id !== id))
      }
      toolbar={
        <ModelPicker
          providers={defaultModelProviders}
          value={model}
          onValueChange={setModel}
          closeOnSelect
        />
      }
      onSubmit={(message) => send({ ...message, model })}
    />
  );
}
```

Provider catalogs, model selection and context data stay in the consumer. Toolbar buttons must use `type="button"` unless they deliberately submit the form. Do not put another form inside the toolbar.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `onSubmit` | `(submission: PromptBarSubmission) => void \| Promise<void>` | Required | Receives trimmed text and a snapshot of the current contexts. Resolving clears the submitted draft; rejecting preserves it and shows an error. |
| `value` | `string` | Uncontrolled | Controlled text. Supply `onValueChange` to update it. Keep the controlled mode consistent for the life of the component. |
| `defaultValue` | `string` | `""` | Initial uncontrolled draft. |
| `onValueChange` | `(value: string) => void` | None | Called when text changes, including successful submission clearing it. |
| `contexts` | `readonly PromptBarContext[]` | `[]` | Context chips. Give each item a stable, unique id. |
| `contextOptions` | `readonly PromptBarContext[]` | `[]` | Consumer-defined choices for the `@` menu. |
| `onContextAdd` | `(context: PromptBarContext) => void` | None | Enables the `@` menu. Receives the full item; update `contexts` to include it. |
| `onContextRemove` | `(id: string) => void` | None | Shows removal buttons. Update your contexts when called. Without it, chips are read-only. |
| `skills` | `readonly PromptBarSkill[]` | `[]` | Consumer-defined choices for the `/` menu. |
| `skill` | `PromptBarSkill \| null` | Uncontrolled | Controlled selection. Pair with `onSkillChange`. `null` means no selection. |
| `defaultSkill` | `PromptBarSkill \| null` | `null` | Initial uncontrolled selection. Later changes do not replace it. |
| `onSkillChange` | `(skill: PromptBarSkill \| null) => void` | None | Fires on selection, removal, and successful submission clearing. |
| `toolbar` | `ReactNode` | None | Optional controls below the input, such as Model Picker. |
| `onStop` | `() => void` | None | Synchronous cancellation callback, such as aborting the consumer's AbortController. Shows Stop while busy. Late completions of the stopped submission do not clear the draft. |
| `submitting` | `boolean` | `false` | Additional consumer-owned busy state. The consumer must reset it after stopping. |
| `error` | `string` | None | Additional consumer-owned error message. Clear it in the consumer when resolved. |
| `disabled` | `boolean` | `false` | Disables input, context removal, toolbar controls and sending. |
| `placeholder` | `string` | `"Ask anything..."` | Empty input hint. |
| `label` | `string` | `"Your prompt"` | Accessible prompt input label, visually hidden. |
| `maxHeight` | `number` | `240` | Textarea height ceiling in pixels. Values below 96 clamp to 96; non-finite values use 240. |
| `modelLabel` | `string` | None | Selected model's name in context details. |
| `contextUsage` | `PromptBarUsage` | None | Provider-reported `usedTokens`, `maxTokens`, and optional `cacheHitRate` (0 to 100). Omit when unavailable. |
| `accept` | `string` | None | Native file-picker hint. Does not validate or read contents. |
| `maxFiles` | `number` | `5` | Maximum number of attachments. Finite values clamp to an integer of at least 1. |
| `maxFileSize` | `number` | `10485760` | Per-file size limit in bytes (10 MB). Finite values clamp to at least 1. |
| `className` | `string` | None | Additional form layout classes. |

### Context item

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `string` | Stable, unique identifier supplied to `onContextRemove`. |
| `label` | `string` | Visible chip label, truncated when necessary. |
| `description` | `string` | Optional menu and context-details text. Also searchable. |
| `icon` | `ReactNode` | Optional chip and menu icon. |
| `data` | `TData` | Optional consumer-defined payload. Preserved in selection callbacks and submissions. |

### Skill item

`PromptBarSkill<TData>` includes all context-item fields plus optional `instructions: string`. Instructions describe how your app should handle the prompt; they are passed through, not executed. IDs must be stable and unique within each menu.

### Submission

`PromptBarSubmission<TContextData, TSkillData>` contains:

| Field | Type | Notes |
| --- | --- | --- |
| `text` | `string` | Trimmed input, without selected command fragments. |
| `contexts` | `readonly PromptBarContext<TContextData>[]` | Snapshot of selected context items, including their payloads. |
| `skill` | `PromptBarSkill<TSkillData> \| null` | Selected slash command, including instructions and payload. |
| `attachments` | `readonly File[]` | Actual browser files. Read or upload them in the consumer. |

The generic parameters default to `unknown`. Supply payload types on the component, `PromptBarProps`, and `PromptBarSubmission` when you want typed access. Arrays are copied for submission, but nested `data` is not deep-cloned. Treat selected items and their payloads as immutable. Do not JSON-serialize the entire submission: icons are React nodes and attachments are browser files. Select the fields your endpoint accepts, and upload files with `FormData` or your app's uploader.

## Behavior

- Enter sends; Shift+Enter creates a new line. Enter during IME composition does not send.
- Submission requires non-whitespace text or an attachment. A skill or context chip alone does not enable sending. A synchronous lock prevents duplicate sends before React renders the pending state.
- The inline input grows with its text and container width, then scrolls at `maxHeight`. Tiptap manages editing, selection, and text undo. The registry installs its React, ProseMirror, and StarterKit dependencies.
- Input is read-only while submitting, so the submitted draft stays stable. If a consumer replaces controlled text while a request is pending, successful completion does not clear the replacement.
- A failure keeps the text and context. Editing or retrying clears internally caught errors. The consumer owns explicit `error` props.
- Stop preserves the draft. The consumer must actually cancel its work in `onStop`; the prompt bar ignores that request's later result.
- Skills use a Zap icon by default. Supply an item's `icon` to override it.
- Inline chips wrap with the text and long labels truncate. Remove buttons appear on hover or keyboard focus and remain visible on touch devices.
- Replacing a controlled `value` replaces the text and puts retained context, skill, and attachment chips at the start of the new draft.
- Screen readers receive the label, keyboard hint, error and submission status. Icons do not add duplicate accessible names.

## Demo

The preview uses fixture skills, context items, model names, usage measurements, and a sample response. It makes no AI request and does not load the file named in its context menu. Type `/` or `@` to inspect selection, or send and immediately choose **Stop response** to inspect cancellation.

The installed component contains no analytics. This site's demo tracks only a successful demo submission marker, never prompt text or context content.
