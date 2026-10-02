## Usage

```tsx
import { TodoList } from "@/components/ui/todo-list";

const tasks = [
  { id: "user-testing", title: "Organize a user testing session" },
  { id: "client-review", title: "Prepare designs for client review" },
  { id: "meditation", title: "15-minute meditation" },
];

export function Tasks() {
  return <TodoList defaultItems={tasks} />;
}
```

Click anywhere on a task to complete it. The checkbox fills, a line sweeps across the title, and the row springs beneath unfinished tasks. Click again to restore it. Rows fit their content and wrap on narrow screens.

## Controlled state

```tsx
"use client";

import { useState } from "react";
import { TodoList, type TodoItem } from "@/components/ui/todo-list";

export function Tasks() {
  const [tasks, setTasks] = useState<TodoItem[]>([
    { id: "draft", title: "Prepare the first draft" },
    { id: "review", title: "Review with the team", completed: true },
  ]);

  return <TodoList items={tasks} onItemsChange={setTasks} />;
}
```

`onItemsChange` receives the updated items in their original array order. Rendering groups unfinished tasks first, preserving the source order within each group. Reopening a task restores its position among unfinished tasks. Keep ids unique and stable. Blank ids, duplicate ids, and blank titles throw an error.

`defaultItems` initializes local state once. Use `items` with `onItemsChange` when your app owns the data or adds and removes tasks. A controlled list without `onItemsChange` is read-only. Storage belongs to the consumer.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `items` | `TodoItem[]` | None | Controlled tasks. Takes priority over `defaultItems`. |
| `defaultItems` | `TodoItem[]` | `[]` | Initial tasks for an uncontrolled list. |
| `onItemsChange` | `(items: TodoItem[]) => void` | None | Called with updated tasks when a checkbox changes. |
| `accentColor` | `string` | `var(--primary)` | CSS color for completed checkboxes, with a blue fallback when the token is missing. |
| `disabled` | `boolean` | `false` | Disables all tasks. |
| `label` | `string` | `"Todo list"` | Accessible name of the list. |
| `emptyMessage` | `string` | `"No tasks yet."` | Text shown when there are no items. |
| `className` | `string` | None | Extra classes on the list or empty state. |

`TodoItem`

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `id` | `string` | Required | Unique, stable task identifier. |
| `title` | `string` | Required | Task text. |
| `completed` | `boolean` | `false` | Whether the task is complete. |

## Accessibility and motion

- Each row is a keyboard-focusable checkbox with its task title as the accessible name and completion exposed through `aria-checked`.
- Tab moves between tasks. Space or Enter toggles the focused task. Focus stays on the same task while it moves.
- Reduced motion removes the reordering animation, checkmark scaling, and the strike-through sweep. State changes still work immediately.
- Card, text, and completion colors follow your theme. Completed checkboxes use your primary color and its foreground token. Override `accentColor` to customize the fill.
