Replace the props table on /components/[id] with a per-prop accordion

Current state: props are GFM markdown tables in content/components/*.md, rendered through the shared table override in components/content/markdown-components.tsx and styled by .prose table CSS in app/globals.css. There is no dedicated PropsTable component. The repo has an unused vendored Radix accordion primitive at components/ui/accordion.tsx.

## Changes

### 1. New file: components/content/props-accordion.tsx ("use client")

- PropDoc type: { prop, type, required, defaultValue, notes }.
- extractPropsFromTableNode(node): pure function that walks the AST node the table override receives. Detects a props table by its header row (first two cells read "Prop" and "Type", backticks stripped, case-insensitive); returns null otherwise so generic tables keep rendering as tables. Cell text extraction preserves inline code as backtick-wrapped segments. Default column: "required" becomes a required flag, an em dash or empty becomes no default, anything else is the literal value.
- PropsAccordion({ items }): renders the vendored Radix Accordion primitives.
  - Root: type="multiple", all rows closed initially, className "my-5 rounded-md border bg-muted/35 overflow-hidden" — mirrors the boxed table look it replaces (same radius token and muted wash).
  - Rows separated by the vendored not-last:border-b hairline.
  - Trigger via className overrides on the vendored trigger: px-3 py-2.5, items-center, hover:bg-muted/40, hover:no-underline, built-in chevrons hidden. Row content:
    - prop name: font-mono text-[0.8125rem] font-medium (13px, same as today's table/code size)
    - "required" badge when applicable: tiny pill, font-mono text-[10px], ring-1 ring-inset (pills use ring-inset per border rules)
    - type: right aligned, font-mono text-xs text-muted-foreground, truncates with a title tooltip on narrow screens
    - Plus icon rotating 45deg when open (group-data-state), matching the AccordionSection house collapsible language
  - Content: notes paragraph at text-sm text-muted-foreground (14px body per typography rules) with inline-code chips preserved (split on backticks, styled by the ambient .prose code rule); below it a "default: <value>" meta line in font-mono text-xs, omitted when there is no default (required is shown by the trigger badge).

### 2. Edit components/content/markdown-components.tsx

- The table override first tries extractPropsFromTableNode; when it returns items it renders PropsAccordion, otherwise it keeps the existing scroll-wrapped table for generic tables. Update the file comment. Single shared override map is preserved, so both markdown surfaces stay in sync; only props-shaped tables change appearance.

### 3. Edit app/components/[id]/page.tsx

- Remove the now-dead [&_table]:w-full from the docs container.

### No changes

- content/components/*.md stays the source of truth, no content migration.
- app/globals.css keeps .prose table CSS for any future generic table.
- Registry untouched: neither markdown-components.tsx nor accordion.tsx is a registry item, so no registry:build needed.
- Docs with multiple prop groups (e.g. command-palette) get one accordion per table, with the existing `ComponentName` paragraph above each preserved.

## Verification

1. npx tsc --noEmit
2. npm run lint
3. Dev server: check /components/progress-bars (11 props, required badge, long union types), /components/command-palette (multiple groups), and one project case-study page (shares the override, must be unaffected). Check narrow width for type truncation and both themes.
4. Per house rules, ask before pushing once verified.