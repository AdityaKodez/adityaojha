# Plan 004: github-map — timezone-safe dates, O(n) lookup, drop dead `level`

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on. If
> anything in "STOP conditions" occurs, stop and report — do not improvise.
> The reviewer maintains `advisor-plans/README.md`; do not edit it.
>
> **Drift check (run first)**: Written against the **working tree** at commit
> `8322b7d` (tree is intentionally dirty — normal). Confirm the excerpts below
> match the live files; on mismatch, STOP.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: `advisor-plans/001-verification-baseline.md` (uses its test setup)
- **Category**: bug
- **Planned at**: commit `8322b7d`, 2026-08-31

## Why this matters

`components/ui/github-map.tsx` is both the home-page heatmap and a published
registry item, so every defect ships to consumers:

1. **Wrong day for many visitors.** API dates are bare `"2025-09-13"` strings;
   `new Date("2025-09-13")` parses as UTC midnight, but the calendar cells
   are built in local time. For anyone west of UTC that shifts every
   contribution to the previous cell.
2. **O(n²) render.** Every one of ~371 cells runs
   `contributions.find(isSameDay(...))` over ~365 entries — ~135k date
   comparisons per render.
3. **Dead memo.** `startDate`/`endDate` are fresh `new Date()` objects each
   render and are listed as `useMemo` deps, so the memo recomputes every render.
4. **Two divergent intensity schemes.** `lib/github.ts` computes a `level`
   (≤3/≤6/≤11 buckets) that the component never reads; the component colors by
   raw count (0/1/2/3/else). The component's doc
   (`content/components/github-map.md`) describes the count-based scheme —
   keep that one, delete the dead server-side `level`.

## Current state

- `components/ui/github-map.tsx:39-55` (the unstable memo + UTC parsing):

  ```tsx
  const today = new Date();
  const startDate = subMonths(today, 12); // One year back
  const endDate = today;
  ...
  const contributions = useMemo(() => {
    return data.filter((d) =>
      isWithinInterval(new Date(d.date), { start: startDate, end: endDate }),
    );
  }, [data, startDate, endDate]);
  ```

- `components/ui/github-map.tsx:79-82` (the O(n²) lookup in the render loop):

  ```tsx
  const contribution = contributions.find((c) =>
    isSameDay(new Date(c.date), day),
  );
  ```

- `components/ui/github-map.tsx:58-64` — `getColor(count)` maps 0/1/2/3/else
  onto `colors[0..4]`. Keep unchanged.
- `lib/github.ts:20-24,76-89` — the dead producer side:

  ```ts
  export type Contribution = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4; };
  ...
  return days.map((day) => ({ ...day, level: getIntensityLevel(day.count) }));
  function getIntensityLevel(count: number): 0 | 1 | 2 | 3 | 4 { ... }
  ```

- Consumers of `fetchGithubData`: `components/github-section.tsx` if plan 003
  has landed, otherwise `app/page.tsx` — either way the value flows into
  `<GitHubCalendar data={...} />`, whose `ContributionDay` type is
  `{ date: string; count: number }` (already a subset — removing `level`
  breaks nothing downstream).
- **Registry rule** (`agents.md` §14): this file is listed in `registry.json`;
  after editing it you MUST run `npm run registry:build`. Published files must
  stay self-contained — keep all changes inside this one file.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Typecheck | `npx tsc --noEmit` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Tests | `npm test` | all pass |
| Registry build | `npm run registry:build` | exit 0, "Successfully built 10 registry items." |

## Scope

**In scope**:

- `components/ui/github-map.tsx`
- `lib/github.ts`
- `tests/github-map.test.ts` (create)
- `app/components/[id]/demos/github-map-demo.tsx` — ONLY if step 5 produces a
  type error caused by demo fixture data carrying a `level` field; then remove
  that field and nothing else.

**Out of scope**:

- `content/components/github-map.md` (already documents the kept behavior).
- The calendar's visual design, tooltip markup, month labels.
- `app/page.tsx` / `components/github-section.tsx` beyond what falls out of the type change.
- Unrelated dirty files; never `git add -A`.

## Git workflow

- Branch: `advisor/004-github-map-fixes` from current HEAD (rebase onto 001's branch if it hasn't merged).
- Conventional commits, e.g. `fix(components): correct github-map date handling and lookup`.
- Stage only in-scope files. Do not push.

## Steps

### Step 1: Add exported pure helpers to the component

In `components/ui/github-map.tsx`, above the component, add and export:

```tsx
/** Parse a bare "YYYY-MM-DD" date as local time (Date parses it as UTC). */
export function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Index contributions by their ISO date string for O(1) cell lookup. */
export function indexByDate(
  data: { date: string }[],
): Map<string, { date: string }> {
  return new Map(data.map((entry) => [entry.date, entry]));
}
```

(Keep the generics loose enough that `ContributionDay` satisfies them.)

**Verify**: `npx tsc --noEmit` → exit 0.

### Step 2: Replace the filter memo with a stable index

Inside the component, replace the `today/startDate/endDate` block and the
`contributions` memo with:

```tsx
const { startDate, endDate } = useMemo(() => {
  const end = new Date();
  return { startDate: subMonths(end, 12), endDate: end };
}, []);

const weeks = Math.ceil(
  (endDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000),
);

const contributionsByDate = useMemo(() => indexByDate(data), [data]);
```

**Verify**: `npx tsc --noEmit` → exit 0.

### Step 3: Replace the per-cell `find` with a Map lookup

In `renderWeeks`, replace the lookup with:

```tsx
const contribution = contributionsByDate.get(format(day, "yyyy-MM-dd"));
```

Remove imports that are now unused (`isWithinInterval`, `isSameDay` if no
longer referenced). Note `format` is already imported from `date-fns`.
Boundary note: cells outside the data's date range simply miss the Map and
render `colors[0]` — same as before when `find` missed.

**Verify**: `npx tsc --noEmit` → exit 0. `npm run lint` → exit 0.

### Step 4: Drop the dead `level` from the server fetch

In `lib/github.ts`: change `Contribution` to
`{ date: string; count: number }`, return `days` directly instead of mapping
in `level`, and delete `getIntensityLevel`.

**Verify**: `npx tsc --noEmit` → exit 0 (this catches any consumer still reading `level`).

### Step 5: Tests

Create `tests/github-map.test.ts` importing the helpers from
`../components/ui/github-map`:

- `parseLocalDate("2025-09-13")` → local year 2025, month index 8, date 13
  (assert via `getFullYear/getMonth/getDate`, NOT `toISOString` — the point is
  locality).
- `indexByDate([{date:"2025-01-02"},{date:"2025-01-03"}])` → `.get("2025-01-03")`
  returns the entry; `.get("2025-01-04")` is `undefined`.
- Round-trip: for `new Date(2025, 0, 5)`, `format(day, "yyyy-MM-dd")` equals
  `"2025-01-05"` (import `format` from `date-fns` in the test) — this is the
  key the Map is queried with.

**Verify**: `npm test` → all tests pass (including plans 001's existing tests if present).
If importing the component file fails under vitest because of its
`motion/react` or `./tooltip` import chain, STOP and report — do not restructure the component.

### Step 6: Rebuild the registry + visual check

Run `npm run registry:build`. Then, with the dev server on
http://localhost:3000 (reuse the running one; do not start a second), view `/`
and confirm the heatmap renders with colored cells and tooltips.

**Verify**: build prints `Successfully built 10 registry items.`; heatmap visible.

## Done criteria

ALL must hold:

- [ ] `npx tsc --noEmit` exits 0; `npm run lint` exits 0
- [ ] `npm test` exits 0 with `tests/github-map.test.ts` passing
- [ ] `grep -n "getIntensityLevel\|level" lib/github.ts` → no matches
- [ ] `grep -n "contributions.find" components/ui/github-map.tsx` → no matches
- [ ] `npm run registry:build` exits 0 and `public/r/github-map.json` contains `parseLocalDate`
- [ ] Only in-scope files modified

## STOP conditions

- Excerpts don't match live files.
- Step 4 produces type errors in files other than the conditional demo file.
- The vitest import chain fails (step 5).
- The heatmap renders empty despite contribution data existing (check the Map key format before assuming; if still broken, report).

## Maintenance notes

- `level` is gone from the data contract; if a future design wants
  GitHub-style quartiles, recompute them client-side in `getColor`.
- The exported helpers are part of the published file — keep them dependency-free.
- Reviewer: sanity-check the heatmap in a west-of-UTC timezone if possible
  (e.g. set `TZ=America/New_York` when starting a dev server) — cell/day
  alignment is the core regression this plan fixes.
