## Usage

```tsx
import { WorkflowStatusBadge } from "@/components/ui/workflow-status";

export function DeploymentState() {
  return <WorkflowStatusBadge status="in-progress" />;
}
```

The component includes seven workflow states: `pending`, `in-progress`, `submitted`, `in-review`, `success`, `failed`, and `expired`.

## Custom labels

Use `label` when the state needs product-specific language. The semantic colour and icon remain tied to the selected state.

```tsx
<WorkflowStatusBadge status="in-review" label="Awaiting approval" />
```

## Compact size

Use `size="sm"` to reduce the badge height, spacing, text, and icon size in dense layouts.

```tsx
<WorkflowStatusBadge status="in-review" size="sm" />
```

## Icon only

For dense interfaces, render the icon-only form. It works with either size. The state label stays in the accessibility tree as visually hidden text, so screen readers still announce it and no `aria-label` is needed.

```tsx
<WorkflowStatusBadge status="success" iconOnly />
<WorkflowStatusBadge status="success" iconOnly size="sm" />
```

## Custom states

Pass any status string and provide an icon and colour classes for product-specific states. If `label` is omitted, values such as `awaiting_payment` are displayed as “Awaiting payment”.

```tsx
import { Ban, PackageCheck } from "lucide-react";

<WorkflowStatusBadge
  status="queued"
  label="Queued for release"
  icon={PackageCheck}
  colorClassName="bg-cyan-500/12 text-cyan-700 dark:text-cyan-300"
/>

<WorkflowStatusBadge
  status="cancelled"
  icon={Ban}
  colorClassName="bg-orange-500/12 text-orange-700 dark:text-orange-300"
/>
```

The exported `workflowStatusPresentations` map is available when filters, menus, or other UI need to reuse the built-in presentation metadata.

## Status labels

`getWorkflowStatusLabel` returns the default or inferred label for a state, so filters and legends beside the badge can reuse the same copy instead of duplicating it.

```tsx
import { getWorkflowStatusLabel, workflowStatuses } from "@/components/ui/workflow-status";

const options = workflowStatuses.map((status) => ({
  value: status,
  label: getWorkflowStatusLabel(status),
}));
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `status` | `WorkflowStatusValue` | required | Selects a built-in state or identifies a custom state. |
| `label` | `string` | state label | Replaces the visible and accessible label. |
| `icon` | `LucideIcon` | state icon | Replaces the built-in icon. Custom states fall back to `CircleDashed`. |
| `colorClassName` | `string` | state colours | Replaces the badge background and foreground colour classes. |
| `iconClassName` | `string` | | Adds classes to the icon without changing the badge. |
| `size` | `"sm" \| "default"` | `"default"` | Reduces the badge and icon footprint when set to `"sm"`. |
| `iconOnly` | `boolean` | `false` | Renders a circular badge without visible text. |
| `className` | `string` | | Extra classes for placement and spacing. |

## Notes & features

- **Semantic states.** Every built-in state pairs a distinct icon and colour, so users do not need to decode colour alone.
- **No wrapper.** The component only renders the badge. Use a list, table, or card around it according to your layout.
- **Accessible by default.** The icon is decorative and the visible label carries the state. Icon-only badges keep that label as visually hidden text rather than an `aria-label`, which is not reliably exposed on a generic element.
- **Custom states.** Use any status string with `icon` and `colorClassName`, or reuse and extend the exported `workflowStatusPresentations` map.
- **Predictable overrides.** Colour overrides are explicit through `colorClassName`; layout overrides remain in `className`. Both merge through `tailwind-merge`.
- **Reduced motion.** Only the in-progress icon spins. Operating-system reduced-motion preferences stop the browser animation.
