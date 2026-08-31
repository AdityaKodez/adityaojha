# Plan 002: Stop shipping 404 docs links in published registry items

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

The site publishes a shadcn registry: `registry.json` is the catalog and
`scripts/build-registry.mjs` inlines each item into `public/r/<name>.json`,
which consumers install with `npx shadcn add`. Two items — `progressive-blur`
and `infinite-slider` — carry `meta.docs` URLs pointing at
`https://akoder.xyz/components/<id>`, but their showcase entries are disabled
(`enabled: false` in `config/components.ts`), so the route returns `notFound()`
and the links 404. Consumers installing these components get a dead docs link.
The maintainer chose to **remove the dead links** (the pages stay disabled).

## Current state

- `registry.json` — 10 items. The two affected items contain (excerpts):

  ```json
  "name": "progressive-blur",
  ...
  "meta": {
    "docs": "https://akoder.xyz/components/progressive-blur",
    "source": "https://github.com/AdityaKodez/adityaojha/blob/main/components/ui/progressive-blur.tsx"
  },
  ```

  ```json
  "name": "infinite-slider",
  ...
  "meta": {
    "docs": "https://akoder.xyz/components/infinite-slider",
    "source": "https://github.com/AdityaKodez/adityaojha/blob/main/components/motion-primitives/infinite-slider.tsx"
  },
  ```

- `config/components.ts:57-77` — both entries exist with `enabled: false`
  (order 5 and 6). Leave them as-is.
- `app/components/[id]/page.tsx` — `findComponent()` skips disabled entries
  and the page calls `notFound()`. Do not touch this file.
- Repo rule (`agents.md` §14): **any edit to a file listed in `registry.json`
  — and `registry.json` itself — must be followed by `npm run registry:build`**
  or the published JSON goes stale.
- The other 8 items' `meta.docs` URLs point at enabled pages and stay.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Typecheck | `npx tsc --noEmit` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Registry build | `npm run registry:build` | exit 0, prints "Successfully built 10 registry items." |

## Scope

**In scope**:

- `registry.json` (remove two `docs` keys)
- `public/r/*` (regenerated output — do not hand-edit; the build writes it)

**Out of scope**:

- `config/components.ts` — do NOT flip `enabled`; the pages stay off by decision.
- `app/sitemap.ts`, `app/components/**`, the component source files.
- The other 8 registry items.
- Unrelated dirty files (`git status` is crowded — stage only your files, never `git add -A`).

## Git workflow

- Branch: `advisor/002-registry-docs-links` from current HEAD.
- One commit, style per `git log`: `fix(registry): drop dead docs links for disabled showcase items`.
- Stage only `registry.json` (plus `public/r/` changes **only if** that dir is
  already tracked/committed in your branch — check `git ls-files public/r`;
  if empty, leave the regenerated files uncommitted). Do not push.

## Steps

### Step 1: Remove the two `docs` keys

In `registry.json`, delete the `"docs": "https://akoder.xyz/components/progressive-blur"`
line from the `progressive-blur` item's `meta` object and the
`"docs": "https://akoder.xyz/components/infinite-slider"` line from the
`infinite-slider` item's `meta` object. Keep both `source` keys and keep valid
JSON (mind trailing commas).

**Verify**: `node -e "JSON.parse(require('fs').readFileSync('registry.json','utf8')); console.log('ok')"` → prints `ok`.

### Step 2: Rebuild the published JSON

Run `npm run registry:build`.

**Verify**: exit 0; output includes `Successfully built 10 registry items.`

### Step 3: Confirm the built output no longer carries the links

**Verify**: `grep -rn "akoder.xyz/components/progressive-blur" public/r/` → no matches.
`grep -rn "akoder.xyz/components/infinite-slider" public/r/` → no matches.
`grep -c "\"docs\"" public/r/registry.json` → 8 (the remaining enabled items).

## Done criteria

ALL must hold:

- [ ] `registry.json` parses; only 8 `docs` keys remain, all pointing at enabled ids
- [ ] `npm run registry:build` exits 0
- [ ] The two grep checks in step 3 return no matches
- [ ] `npx tsc --noEmit` exits 0 (sanity — nothing else changed)
- [ ] `git status` shows only `registry.json` modified (plus untracked `public/r/` if that's the local state)

## STOP conditions

- The `meta` blocks differ from the excerpts above.
- `npm run registry:build` fails.
- You find more than these two `docs` URLs pointing at disabled ids — report the list instead of guessing.

## Maintenance notes

- If `progressive-blur`/`infinite-slider` showcase pages are ever re-enabled
  (`enabled: true` in `config/components.ts`), restore their `meta.docs` keys
  and re-run `npm run registry:build`.
- Reviewer note: check no consumer-facing contract depends on `meta.docs`
  existing (the shadcn CLI treats `meta` as optional).
