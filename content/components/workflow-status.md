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

## Status labels

`getWorkflowStatusLabel` returns the default label for a state, so filters and legends beside the badge can reuse the same copy instead of duplicating it.

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
| `status` | `WorkflowStatus` | required | Selects the label, icon, and semantic presentation. |
| `label` | `string` | state label | Replaces the visible and accessible label. |
| `size` | `"sm" \| "default"` | `"default"` | Reduces the badge and icon footprint when set to `"sm"`. |
| `iconOnly` | `boolean` | `false` | Renders a circular badge without visible text. |
| `className` | `string` | | Extra classes for placement and spacing. |

## Notes & features

- **Semantic states.** Every built-in state pairs a distinct icon and colour, so users do not need to decode colour alone.
- **No wrapper.** The component only renders the badge. Use a list, table, or card around it according to your layout.
- **Accessible by default.** The icon is decorative and the visible label carries the state. Icon-only badges keep that label as visually hidden text rather than an `aria-label`, which is not reliably exposed on a generic element.
- **Predictable overrides.** Classes merge through `tailwind-merge`, so anything you pass in `className` replaces the matching default instead of sitting next to it.
- **Reduced motion.** Only the in-progress icon spins. Operating-system reduced-motion preferences stop the browser animation.
