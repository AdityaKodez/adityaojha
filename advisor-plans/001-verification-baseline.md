# Plan 001: Verification baseline — typecheck + tests + CI exist and pass

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. The reviewer maintains `advisor-plans/README.md`;
> do not edit it.
>
> **Drift check (run first)**: This plan was written against the **working
> tree** at commit `8322b7d` (the tree is intentionally dirty with unrelated
> work — that is normal, do not touch it). Confirm the "Current state"
> excerpts below match the live files before proceeding; on mismatch, treat
> it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: none
- **Category**: tests
- **Planned at**: commit `8322b7d`, 2026-08-31

## Why this matters

This repo has strict TypeScript but zero tests, no `typecheck` script, and no
CI. That already cost a real bug that both `tsc` and `eslint` pass over:
`components/about.tsx` splits the about text into sentences with a
double-escaped regex that never matches (details below). The most dangerous
unguarded code publishes installable JSON to the internet
(`scripts/build-registry.mjs`) and rate-limits the API surface (`proxy.ts`).
After this plan there is one command that proves the codebase works
(`npm run typecheck && npm test`), three characterization tests guard the
dangerous modules, and a CI workflow runs them on every push/PR.

## Current state

- `package.json` scripts (lines 5–12) — no `typecheck`, no `test`, no test
  framework in dependencies:

  ```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "prebuild": "node scripts/build-registry.mjs",
    "registry:build": "node scripts/build-registry.mjs"
  }
  ```

- `components/about.tsx:50-53` — the broken sentence split. In the source
  file the regex literal is `/(?<=\\.)\\s+/` (double backslashes), which
  matches a literal backslash, not a sentence period:

  ```tsx
  const sentences = useMemo(
    () => siteConfig.about.body.split(/(?<=\\.)\\s+/).filter(Boolean),
    [],
  );
  ```

- `proxy.ts:7-33` — token-bucket limiter; `allowRequest` is module-private
  (not exported):

  ```ts
  const RATE_LIMIT = 30; // requests
  const RATE_WINDOW_MS = 60_000; // per minute
  const buckets = new Map<string, { tokens: number; updatedAt: number }>();
  function allowRequest(ip: string): boolean { /* refill + spend */ }
  ```

- `scripts/build-registry.mjs` — reads `registry.json`, inlines each listed
  file's source, writes `public/r/*.json`. Nothing validates that files exist
  or that published files stay self-contained.
- No `.github/` directory exists.
- Repo conventions (`agents.md`): TypeScript strict; verification commands are
  `npx tsc --noEmit` and `npm run lint`; **`next build` may not be available
  in this environment — never use it for verification.** UI copy is lowercase.
  tsconfig already sets `"noEmit": true`.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Typecheck | `npx tsc --noEmit` | exit 0, no errors |
| Lint | `npm run lint` | exit 0 (0 errors) |
| Tests | `npm test` | all pass |
| Registry build | `npm run registry:build` | exit 0, prints emitted files |

## Scope

**In scope** (the only files you may modify or create):

- `package.json` (add devDependency + 3 scripts)
- `vitest.config.ts` (create)
- `lib/sentences.ts` (create)
- `components/about.tsx` (two-line change)
- `proxy.ts` (export one function — no behavior change)
- `tests/sentences.test.ts`, `tests/rate-limit.test.ts`, `tests/registry-invariants.test.ts` (create)
- `.github/workflows/ci.yml` (create)

**Out of scope** (do NOT touch, even though related):

- Any other `components/**` file — the other clipboard/fix work has its own plans.
- `scripts/build-registry.mjs` itself — do not refactor it; the test asserts invariants against it as-is.
- Fixing the rate limiter's eviction or IP-keying — that is a separate plan; here you only characterize current behavior.
- The many unrelated dirty files in `git status` — never run `git add -A`; stage only your files.
- `next build`, pushing, opening PRs.

## Git workflow

- Branch: `advisor/001-verification-baseline` (create from current HEAD).
- Commit per step, conventional style matching the log, e.g.
  `test: add vitest baseline with typecheck script and CI`.
- Stage files individually by name. Do not push.

## Steps

### Step 1: Add vitest and the scripts

Run `npm install -D vitest`. Then in `package.json` scripts, add:

```json
"typecheck": "tsc --noEmit",
"test": "vitest run"
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { environment: "node", include: ["tests/**/*.test.ts"] },
});
```

**Verify**: `npm run typecheck` → exit 0. `npm test` → exits 1 with "No test files found" (expected until step 4).

### Step 2: Extract and fix the sentence split

Create `lib/sentences.ts`:

```ts
export function splitSentences(body: string): string[] {
  return body.split(/(?<=\.)\s+/).filter(Boolean);
}
```

In `components/about.tsx`: replace the `useMemo` body at lines 50–53 with
`siteConfig.about.body` piped through the helper — i.e.
`() => splitSentences(siteConfig.about.body)` — and add
`import { splitSentences } from "@/lib/sentences";`. Keep the `useMemo` and
its `[]` deps. The `@/*` path alias maps to the repo root (see `tsconfig.json`).

**Verify**: `npm run typecheck` → exit 0.

### Step 3: Export the limiter for tests

In `proxy.ts`, change `function allowRequest(ip: string): boolean {` to
`export function allowRequest(ip: string): boolean {` and add a way to reset
state between tests: also export
`export function resetBucketsForTesting(): void { buckets.clear(); }`.
No other change to the file.

**Verify**: `npm run typecheck` → exit 0, `npm run lint` → exit 0.

### Step 4: Write the three tests

`tests/sentences.test.ts` — import `splitSentences` from `@/lib/sentences`
(add the alias to `vitest.config.ts` via `resolve.alias` mirroring
`tsconfig.json` paths: `"@": path.resolve(__dirname, ".")`):

- `"One. Two. Three."` → 3 sentences.
- A body with no periods → 1 sentence.
- Empty string → `[]`.

`tests/rate-limit.test.ts` — import `allowRequest`, `resetBucketsForTesting`
from `../proxy` (relative import to avoid pulling the Next runtime):

- Use `vi.useFakeTimers()` + `vi.setSystemTime`.
- Same IP: first 30 calls return `true`, 31st returns `false`.
- After advancing time 61 s, the same IP is allowed again.
- Different IPs have independent budgets.
- Call `resetBucketsForTesting()` in `beforeEach`.
- Note: importing `proxy.ts` also imports `next/server`. If that import fails
  under vitest, STOP and report (do not restructure the module).

`tests/registry-invariants.test.ts` — using `node:fs`:

- Parse `registry.json`; assert every item has non-empty `name`, `type`,
  `files`; assert every `files[].path` exists on disk.
- For each file's source content, assert it does NOT contain `@/config/` or
  `@/lib/discord-status` (self-containment rule from `agents.md` §14).

**Verify**: `npm test` → all tests pass.

### Step 5: CI workflow

Create `.github/workflows/ci.yml`:

```yaml
name: ci
on:
  push:
    branches: [main]
  pull_request:
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm test
      - run: npm run registry:build
```

**Verify**: file parses as YAML (`npx js-yaml .github/workflows/ci.yml > NUL`
or any YAML check) — content matches the block above.

## Test plan

The three test files above ARE the test plan. Cases listed in step 4.
Verification: `npm test` → all pass, 3 files, ≥ 8 assertions.

## Done criteria

ALL must hold:

- [ ] `npm run typecheck` exits 0
- [ ] `npm run lint` exits 0 with no new warnings
- [ ] `npm test` exits 0; `tests/sentences.test.ts`, `tests/rate-limit.test.ts`, `tests/registry-invariants.test.ts` exist and pass
- [ ] `grep -n "splitSentences" components/about.tsx` shows the helper in use; the double-escaped regex `(?<=\\\\.)` no longer appears in `components/about.tsx`
- [ ] `.github/workflows/ci.yml` exists and matches step 5
- [ ] `git status` shows only in-scope files changed

## STOP conditions

- The excerpts in "Current state" don't match the live files.
- Importing `proxy.ts` under vitest fails for Next-runtime reasons (report; don't restructure).
- `npm run lint` reports errors in files you did not touch (report them; don't fix unrelated files).
- Any step's verification fails twice after a reasonable fix attempt.

## Maintenance notes

- Future bug-fix plans (004, 005) add tests into `tests/` using this setup.
- If `scripts/build-registry.mjs` is ever refactored, keep the invariant test in sync.
- The CI workflow does not deploy; Vercel deploys from `main` independently.
