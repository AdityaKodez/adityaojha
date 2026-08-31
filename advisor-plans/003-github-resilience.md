# Plan 003: Home page survives GitHub API failures and streams past the heatmap

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
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `8322b7d`, 2026-08-31

## Why this matters

Today the home page `await`s the GitHub GraphQL fetch at the top of the page
component. Any GitHub outage, rate-limit HTML response, or network error makes
`response.json()` throw, which turns the **entire portfolio into a 500** —
every section, not just the heatmap. The `Suspense` + skeleton around the
calendar is decorative: the data is already resolved before the boundary
renders, so first byte also blocks on GitHub (~60 s cache means this happens
on every revalidation). After this plan: the fetch lives in an async server
child inside the existing Suspense boundary (page streams immediately, skeleton
actually shows), and failures degrade to "section skipped" instead of a crash.

## Current state

- `app/page.tsx:45-50` — the blocking fetch (server component):

  ```tsx
  export default async function Home() {
    const shouldRenderGithub =
      siteConfig.sectionFlags.github && Boolean(process.env.GITHUB_TOKEN);
    const contributionData = shouldRenderGithub
      ? await fetchGithubData(siteConfig.personal.githubUsername)
      : [];
  ```

- `app/page.tsx:66-74` — the never-triggered boundary:

  ```tsx
  const content =
    sectionId === "github" ? (
      // The section rule lives here: GitHubCalendar is a bare registry
      // component, so it ships without the home page's dashed divider.
      <div key="github" className="border-t border-dashed">
        <Suspense fallback={<GitSkeleton />}>
          <GitHubCalendar data={contributionData} />
        </Suspense>
      </div>
    ) : (
      staticSections[sectionId]
    );
  ```

- `lib/github.ts:38-55` — no `response.ok` guard, unguarded JSON parse:

  ```ts
  const response = await fetch(GITHUB_GRAPHQL_API, { /* ... */ });
  const json = await response.json();
  if (json.errors) { console.error("GitHub API Errors:", json.errors); return []; }
  ```

- `fetchGithubData` throws `"GITHUB_TOKEN is missing"` when the env var is
  absent (`lib/github.ts:29-32`) — keep that; the page already gates on the
  token before rendering the section.
- Conventions: this repo keeps one dashed top rule per section; the divider
  for the GitHub section is the wrapper `div` above (`agents.md` §10). The
  GitHub section being absent when `GITHUB_TOKEN` is missing is by design
  (`agents.md` §16). A dev server is normally already running on
  http://localhost:3000 — reuse it, do not start a second one.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Typecheck | `npx tsc --noEmit` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Dev check | open http://localhost:3000 | home renders fully |

## Scope

**In scope**:

- `app/page.tsx`
- `components/github-section.tsx` (create)
- `lib/github.ts`

**Out of scope**:

- `components/ui/github-map.tsx` — the calendar component has its own plan (004); do not touch it here.
- `components/skeletons/github-skeleton.tsx` — keep as the fallback.
- Star-count fetch in `components/header-actions.tsx` — separate concern.
- Unrelated dirty files; never `git add -A`.

## Git workflow

- Branch: `advisor/003-github-resilience` from current HEAD.
- Commits (conventional style, see `git log`): e.g.
  `fix(home): isolate github section fetch behind suspense with error fallback`.
- Stage only in-scope files. Do not push.

## Steps

### Step 1: Make `fetchGithubData` failure-safe

In `lib/github.ts`, after the `fetch` call and before `await response.json()`:

```ts
if (!response.ok) {
  console.error("GitHub API request failed:", response.status);
  return [];
}
```

Then wrap the JSON parse + shaping in try/catch so non-JSON bodies (rate-limit
HTML, network errors) can't throw:

```ts
let json: any;
try {
  json = await response.json();
} catch {
  console.error("GitHub API returned a non-JSON response.");
  return [];
}
```

Keep the existing `json.errors` handling and the token-missing throw
unchanged. If the file already avoids `any` style elsewhere, match the local
typing — an explicit `unknown` + narrowing or a minimal inline type both work;
do not restructure beyond this.

**Verify**: `npx tsc --noEmit` → exit 0. `npm run lint` → exit 0.

### Step 2: Create the async section component

Create `components/github-section.tsx` (server component, no `"use client"`):

```tsx
import { GitHubCalendar } from "@/components/ui/github-map";
import { siteConfig } from "@/config/site";
import { fetchGithubData } from "@/lib/github";

export async function GitHubSection() {
  const contributions = await fetchGithubData(
    siteConfig.personal.githubUsername,
  );

  if (contributions.length === 0) {
    return null;
  }

  // GitHubCalendar is a bare registry component, so it ships without the
  // home page's dashed divider — the section rule lives here.
  return (
    <div className="border-t border-dashed">
      <GitHubCalendar data={contributions} />
    </div>
  );
}
```

**Verify**: `npx tsc --noEmit` → exit 0.

### Step 3: Rewire `app/page.tsx`

- Remove the `fetchGithubData` import, the `shouldRenderGithub` constant, and
  the `contributionData` await (lines shown in Current state).
- Replace the `sectionId === "github"` branch with:

  ```tsx
  sectionId === "github" ? (
    <Suspense key="github" fallback={<GitSkeleton />}>
      <GitHubSection />
    </Suspense>
  ) : (
    staticSections[sectionId]
  )
  ```

- Add `import { GitHubSection } from "@/components/github-section";`.
- The `GitHubCalendar` import in `app/page.tsx` becomes unused — remove it.
- Gate note: with no `GITHUB_TOKEN`, `fetchGithubData` throws — that would now
  happen inside the boundary. Preserve the old gating by rendering the branch
  conditionally: compute
  `const showGithub = siteConfig.sectionFlags.github && Boolean(process.env.GITHUB_TOKEN);`
  in `Home()` and render `null` for the `github` id when `showGithub` is
  false. (This keeps the token-missing path exactly as designed.)

**Verify**: `npx tsc --noEmit` → exit 0. `npm run lint` → exit 0.

### Step 4: Check the running site

A dev server should already be running on http://localhost:3000 (do not start
a second). Load `/` and confirm: the page renders all sections; the GitHub
heatmap appears (with `GITHUB_TOKEN` present in `.env`) or is absent without
a broken divider (without it). If you cannot reach a browser, verify
`curl -s http://localhost:3000 -o NUL -w "%{http_code}"` → `200`.

## Done criteria

ALL must hold:

- [ ] `npx tsc --noEmit` exits 0
- [ ] `npm run lint` exits 0, no new warnings
- [ ] `grep -n "await fetchGithubData" app/page.tsx` → no matches
- [ ] `components/github-section.tsx` exists and is the only caller of `fetchGithubData` besides its definition
- [ ] Home page returns 200 and renders fully with and without network access to GitHub (simulate failure mentally: `fetchGithubData` now returns `[]`, section returns `null` — no throw path remains except the token-missing one, which is gated)

## STOP conditions

- Excerpts don't match live files.
- Removing the page-level await breaks some other usage of `contributionData` you discover — report it.
- The dev server check shows a missing section divider or duplicated border (one-border-per-edge rule) — report what you see.

## Maintenance notes

- Plan 004 changes `GitHubCalendar` internals; `GitHubSection` only passes
  `data` through, so the plans compose cleanly.
- If caching behavior changes (`next: { revalidate: 60 }` in `lib/github.ts`),
  remember the skeleton only shows on cache miss.
