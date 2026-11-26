## Usage

```tsx
import { Sofa } from "lucide-react";
import { UsageCard } from "@/components/ui/usage-card";

export function WorkspaceSeats() {
  return (
    <UsageCard
      label="Seats used"
      value={18}
      limit={25}
      icon={<Sofa />}
    />
  );
}
```

`label`, `value`, and `limit` are required. The component renders one card, so you can stack multiple meters in a billing panel or arrange them in a dashboard grid.

```tsx
import { CloudCog, HardDriveUpload, Sofa } from "lucide-react";
import { UsageCard } from "@/components/ui/usage-card";

export function BillingUsage() {
  return (
    <div className="flex max-w-sm flex-col gap-3">
      <UsageCard label="Seats used" value={18} limit={25} icon={<Sofa />} />
      <UsageCard
        label="Storage used"
        value={611}
        limit={1000}
        unit="gb"
        icon={<HardDriveUpload />}
      />
      <UsageCard
        label="API calls"
        value={82540}
        limit={100000}
        icon={<CloudCog />}
      />
    </div>
  );
}
```

## Thresholds and status

By default, `UsageCard` derives its semantic status from the rounded usage percentage:

- Below `dangerThreshold` (default `80`), the card renders `good` with a neutral progress fill and a green `Good` badge.
- At or above `dangerThreshold`, the card renders `action-required` with a red progress fill, red percentage readout, and a red `Action required` badge.
- When `warningThreshold` is set below `dangerThreshold`, values in between render `warning` with an amber progress fill, amber percentage readout, and an amber `Warning` badge.

The status pill reuses `WorkflowStatusBadge` (`@akoder/workflow-status`), which the shadcn CLI installs automatically as a registry dependency.

```tsx
<UsageCard
  label="Bandwidth"
  value={740}
  limit={1000}
  unit="gb"
  warningThreshold={70}
  dangerThreshold={90}
/>
```

Pass `status` explicitly to override automatic threshold derivation, use `statusLabel` or `statusIcon` to customize the badge, or pass `showStatus={false}` to omit the pill.

## Formatting

Large integers with five or more digits format with space grouping by default (`82 540 / 100 000`), while four-digit totals stay compact (`611 / 1000 gb`). Formatting is deterministic across server and client renders to avoid locale hydration mismatches.

Use `unit`, `formatValue`, and `formatPercentage` to adapt the readout to currencies, durations, or custom copy:

```tsx
<UsageCard
  label="Monthly spend"
  value={420}
  limit={500}
  formatValue={(amount) => `$${amount}`}
  formatPercentage={(percent) => `${percent}% of budget`}
/>
```

The component also exports `formatUsageNumber` if you want to reuse the default number formatting outside the card.

## Props

The component exports `UsageCardProps`, `UsageCardStatus`, `usageCardStatuses`, and `formatUsageNumber`. Additional props forward to the root `div`.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `string` | required | Metric heading in the top-left of the inner card. |
| `value` | `number` | required | Current usage amount. Negative or nonfinite values clamp to `0`. |
| `limit` | `number` | required | Quota ceiling. Nonfinite or nonpositive values render `0%`. |
| `unit` | `string` | - | Optional unit suffix aligned to the baseline after `limit`. |
| `icon` | `ReactNode` | - | Optional decorative icon shown before `label`. |
| `status` | `UsageCardStatus` | derived | Explicit `"good"`, `"warning"`, or `"action-required"` state. |
| `statusLabel` | `string` | state label | Custom text inside the status pill. |
| `statusIcon` | `LucideIcon` | state icon | Custom icon forwarded to `WorkflowStatusBadge`. |
| `showStatus` | `boolean` | `true` | Hides the status pill when `false`. |
| `dangerThreshold` | `number` | `80` | Percentage (`0` to `100`) at or above which status becomes `"action-required"`. |
| `warningThreshold` | `number` | - | Optional percentage (`0` to `100`) at or above which status becomes `"warning"`. |
| `formatValue` | `(amount: number) => string` | `formatUsageNumber` | Formats both `value` and `limit`. |
| `formatPercentage` | `(percent: number) => string` | `` `${percent}% used` `` | Formats the inline progress label and `aria-valuetext`. |
| `className` | `string` | - | Extra classes merged onto the outer tray. |

## Accessibility and notes

- **Progress semantics.** The bottom tray renders `role="progressbar"` with `aria-label`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, and `aria-valuetext`.
- **State clarity.** Each status pairs an icon, label, and semantic color via `WorkflowStatusBadge`, so thresholds do not rely on color alone.
- **Boundary handling.** At `0%`, the filled bar collapses cleanly without a stray dot; at `100%` or above, the remaining track hides while the label continues reporting the actual rounded percentage.
- **Reduced motion.** Progress bar transitions disable automatically when `prefers-reduced-motion: reduce` is active.
- **Server-component friendly.** `UsageCard` has no client-only hooks and works in both React Server Components and Client Components.
