# Advisor Plan Issues Bugfix Design

## Overview

This design resolves the defects captured from advisor plans 001–004 without changing the portfolio’s valid rendering, public registry contract, or established heatmap color semantics. The work corrects sentence splitting, removes documentation URLs for registry items without an enabled documentation route, isolates GitHub-data failure and loading work behind a streamable section boundary, and makes heatmap lookup local-date-safe and constant-time per cell. It also establishes automated regression coverage for these behaviors and the existing request-limiter allowance rules.

## Glossary

- **Bug_Condition (C)**: An input or system state that currently causes one of the documented defects: malformed sentence splitting, an invalid published docs URL, failed GitHub data preventing page rendering, a shifted contribution date, or repeated heatmap lookup.
- **Property (P)**: The correct observable outcome for an input that satisfies `C`, such as independently rendered sentences, no unavailable docs link, a resilient page response, or an exact date-keyed heatmap count.
- **Preservation**: The behavior for inputs outside `C` that the fixed implementation must retain, including valid content, successful GitHub rendering, registry installation data, zero cells, and request-limiter rules.
- **`splitAboutSentences`**: A small pure helper extracted from `components/about.tsx` that turns non-empty about copy into display sentences.
- **`fetchGithubData`**: The server-side function in `lib/github.ts` that requests and normalizes GitHub contribution data.
- **`GithubSection`**: A new async server component boundary that owns GitHub fetching, failure omission, and the section’s dashed rule; it is rendered under `Suspense` by the home page.
- **Contribution date key**: A bare ISO calendar date (`yyyy-MM-dd`) used directly to associate a contribution with the same local calendar cell.
- **Registry documentation URL**: The optional `meta.docs` field in a `registry.json` item that must only point to a route generated for an enabled component.
- **Request limiter**: The existing rate/allowance behavior covered by the advisor-plan regression requirement; its valid allowance and refill-window outcomes must be captured before any related refactor.

## Bug Details

### Bug Condition

The defects occur across independent inputs: period-separated about copy, disabled registry entries with published documentation metadata, unavailable GitHub API responses, bare date strings in time zones west of UTC, and heatmap grid generation. The page currently awaits GitHub data in `Home`, so its `Suspense` boundary receives already-resolved data and cannot stream the remaining page first.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type AdvisorPlanIssueInput
  OUTPUT: boolean

  RETURN (
    input.kind = "about-copy"
    AND input.text contains a period followed by whitespace
    AND splitAboutSentences_original(input.text) does not return each sentence
  ) OR (
    input.kind = "registry-item"
    AND input.componentEnabled = false
    AND input.publishedDocsUrl exists
  ) OR (
    input.kind = "github-response"
    AND (input.networkFailed OR NOT input.responseOk OR NOT input.isJson OR input.graphqlErrors)
    AND Home_original fails to render independently of the GitHub section
  ) OR (
    input.kind = "contribution-date"
    AND input.date matches "yyyy-MM-dd"
    AND renderedLocalCalendarKey(input.date) != input.date
  ) OR (
    input.kind = "heatmap-grid"
    AND eachCellSearchesContributionList(input.contributions)
  )
END FUNCTION
```

### Examples

- About copy `"I build products. I ship them."` currently remains one display entry because the regular expression matches a literal backslash before any character rather than a normal period delimiter. It must render two entries.
- `progressive-blur` and `infinite-slider` are disabled in `config/components.ts`, but their registry metadata currently publishes `/components/<id>` documentation URLs. Those URLs must not be emitted while their routes remain disabled.
- A GitHub request returning `503`, HTML instead of JSON, a rejected fetch promise, or a GraphQL error must leave the hero and every non-GitHub home section renderable. It must not leave the GitHub dashed divider behind.
- For `"2025-09-13"`, `new Date(date)` is interpreted at UTC midnight; west-of-UTC viewers can compare it as September 12. The September 13 cell must receive the contribution.
- A heatmap with approximately 53 × 7 cells currently calls `Array.find` over contributions for each cell. It must use a precomputed ISO-date lookup instead, and server data must not carry an unused `level` whose thresholds differ from the displayed one-count-per-level colors.

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- About content without a period remains one non-empty display sentence, while empty content produces no entries.
- Enabled components keep valid documentation URLs, and every registry item keeps its source URL and self-contained installable content.
- An absent `GITHUB_TOKEN` continues to omit the GitHub section without an empty divider or a home-page failure.
- A successful GitHub response continues to render the calendar, tooltips, and the existing count-based thresholds: zero, one, two, three, and four-or-more contributions.
- A date with no contribution continues to use the zero-contribution color.
- Existing request-limiter behavior remains unchanged for requests that are within the configured allowance and refill window.
- Registry generation continues to produce valid `public/r/*.json` artifacts after a registry change.

**Scope:**
Inputs outside the bug condition must remain unaffected, including:
- Single-sentence, delimiter-free, and empty about content.
- Enabled registry documentation pages, install commands, source links, and generated file content.
- GitHub requests that succeed with a valid contribution calendar and home pages with no GitHub token.
- Existing local calendar grid construction, zero-count cells, visual colors, tooltips, and month labels.
- Request patterns already permitted by the limiter.

### Expected Result Predicate

```
FUNCTION expectedBehavior(result)
  INPUT: result of the fixed behavior for an AdvisorPlanIssueInput
  OUTPUT: boolean

  IF result.input.kind = "about-copy" THEN
    RETURN result.sentences equal the non-empty period-terminated segments of result.input.text
  END IF

  IF result.input.kind = "registry-item" THEN
    RETURN result.input.componentEnabled OR result.publishedDocsUrl is absent
  END IF

  IF result.input.kind = "github-response" THEN
    RETURN result.homeContentRendered
      AND (result.githubSectionRendered = result.responseWasValid)
      AND (NOT result.emptyGithubDivider)
  END IF

  IF result.input.kind = "contribution-date" THEN
    RETURN result.cellKey = result.input.date
  END IF

  IF result.input.kind = "heatmap-grid" THEN
    RETURN result.lookupUsesIsoDateKey
      AND result.displayedCount equals result.input.countForCell
      AND NOT result.unusedIntensityMetadata
  END IF
END FUNCTION
```

## Hypothesized Root Cause

1. **Escaped sentence delimiter**: `components/about.tsx` uses `/(?<=\\.)\\s+/` as a regular-expression literal. The doubled backslashes prevent it from recognizing ordinary period-plus-whitespace boundaries.

2. **Registry and showcase are independently authored**: `registry.json` publishes static `meta.docs` values, while route generation intentionally filters the component registry to enabled entries. Disabled registry entries can therefore retain URLs for routes that do not exist.

3. **GitHub I/O is in the page’s blocking path**: `Home` awaits `fetchGithubData` before it creates JSX. The `Suspense` boundary wraps only the already-resolved calendar, and `fetchGithubData` calls `response.json()` without first guarding non-success responses or parsing failures.

4. **UTC parsing and repeated searches**: `components/ui/github-map.tsx` uses `new Date(bareIsoDate)` with `isSameDay`, which converts a date-only value through UTC. It also filters once and then searches that array for every generated cell. `lib/github.ts` additionally computes a `level` using thresholds unrelated to the component’s displayed count thresholds, but the calendar does not consume that value.

5. **No executable regression boundary**: `package.json` has no test command or test dependencies, so the sentence, registry, limiter, and published-artifact invariants cannot be repeatedly checked before release.

## Correctness Properties

Property 1: Bug Condition - Sentence segmentation

_For any_ non-empty about string containing period-terminated sentences separated by whitespace, where `isBugCondition` identifies incorrect segmentation, `splitAboutSentences` SHALL return and render one non-empty entry for each sentence in source order.

**Validates: Requirements 2.1**

Property 2: Preservation - Existing valid portfolio behavior

_For any_ input where the bug condition does NOT hold, the fixed code SHALL produce the same result as the original code, preserving delimiter-free and empty about copy, enabled registry docs and install content, token-absent GitHub omission, valid GitHub calendar rendering, zero cells, and allowed request-limiter outcomes.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7**

Property 3: Bug Condition - Registry documentation reachability

_For any_ registry item associated with a disabled or otherwise ungenerated component documentation route, the generated registry artifact SHALL omit its documentation URL while retaining its source URL and installable file data.

**Validates: Requirements 2.2, 2.3, 3.2, 3.7**

Property 4: Bug Condition - GitHub failure isolation and streaming

_For any_ GitHub request that rejects, has a non-success status, cannot be parsed as JSON, contains GraphQL errors, or lacks a valid calendar payload, the fixed page SHALL render non-GitHub content without a GitHub divider; while a valid request is pending, it SHALL stream that content and limit the loading fallback to the GitHub section.

**Validates: Requirements 2.4, 2.5, 3.3**

Property 5: Bug Condition - Local calendar identity and indexed lookup

_For any_ bare ISO contribution date and calendar cell with the same `yyyy-MM-dd` key, the fixed heatmap SHALL display that contribution in that cell regardless of local time zone, resolve it through a date-keyed lookup, and use only the raw count needed by the displayed color scheme.

**Validates: Requirements 2.6, 2.7, 3.4, 3.5**

Property 6: Bug Condition - Repeatable regression verification

_For any_ future change affecting sentence segmentation, request limiting, or registry publication, the automated test suite SHALL detect a violated documented invariant before release.

**Validates: Requirements 2.2, 3.6, 3.7**

## Fix Implementation

### Changes Required

Assuming the root-cause analysis is confirmed by exploratory tests:

**File**: `components/about.tsx` and a new pure helper module such as `lib/about-sentences.ts`

**Function**: `splitAboutSentences`

**Specific Changes**:
1. Extract sentence segmentation into an exported pure helper, returning an empty array for empty or whitespace-only text and filtering empty segments.
2. Use a period boundary expression that matches an actual period followed by whitespace (`/(?<=\.)\s+/`), then have `About` memoize the helper result rather than embedding the expression.
3. Preserve highlighted-text rendering, sentence order, animation, and layout classes unchanged.

**File**: `registry.json`, `config/components.ts`, and `scripts/build-registry.mjs`

**Function**: Registry metadata generation and validation

**Specific Changes**:
1. Remove `meta.docs` from registry entries whose component documentation is disabled or unavailable (currently `progressive-blur` and `infinite-slider`), while retaining `meta.source`, dependencies, and files.
2. Add a regression invariant that checks every published `meta.docs` identifier corresponds to an enabled component entry with an expected documentation route; enabled entries must still have their valid URL.
3. Preserve the existing registry builder’s inlining behavior and run `npm run registry:build` after changes to a published registry file so `public/r/*.json` matches the catalog.

**File**: `lib/github.ts` and a new `components/github-section.tsx`

**Function**: `fetchGithubData` and `GithubSection`

**Specific Changes**:
1. Change `fetchGithubData` to return `Contribution[] | null`, where `null` means the upstream response was unavailable or invalid and `[]` remains a valid empty calendar. Guard missing tokens, network rejections, `response.ok`, JSON parsing, GraphQL errors, and missing expected response structure; log diagnostics server-side without propagating the error to the page.
2. Remove the unused `level` field and `getIntensityLevel`; normalize only `{ date, count }`, which is all the client calendar needs.
3. Move the fetch into `GithubSection`, an async server component. It returns `null` for unavailable data and creates the dashed section wrapper only after valid data exists.
4. In `app/page.tsx`, remove the top-level `await fetchGithubData(...)`; conditionally render `<Suspense fallback={<GitSkeleton />}><GithubSection /></Suspense>` only when a token is configured. This lets the rest of the page stream and prevents an empty divider if the section returns `null`.
5. Keep the GitHub section’s existing token gate, visual calendar, and fallback styling. Confirm the section-rail behavior remains valid when the fetched section is absent; if its current anchor becomes stale, derive that entry from the same successful section state without reintroducing a blocking page fetch.

**File**: `components/ui/github-map.tsx`

**Function**: `GitHubCalendar`

**Specific Changes**:
1. Create the visible date interval with local calendar `Date` values as today, but derive every cell key with `format(day, "yyyy-MM-dd")`.
2. Build a `Map<string, number>` from the supplied contribution data once in `useMemo`, optionally excluding values outside the rendered ISO-key interval through lexical date comparisons rather than parsing date-only input through UTC.
3. Resolve each cell’s count with `contributionByDate.get(cellKey) ?? 0`, keeping the existing zero/one/two/three/four-plus visual thresholds and tooltip content.
4. Remove `new Date(contribution.date)`, `isSameDay`, and the per-cell `find` scan. Because this file is a published registry source, regenerate `public/r/github-map.json` after the change.

**File**: `package.json` and new test files

**Function**: Test command and regression suites

**Specific Changes**:
1. Add a single-run test command and pinned test tooling appropriate for TypeScript unit, integration, and property-based tests (for example, Vitest plus `fast-check`), without altering production dependencies.
2. Add focused tests for pure helpers and registry artifacts, mocked `fetch` tests for GitHub failure modes, and a timezone-controlled heatmap date-key test.
3. Capture the existing request-limiter allowance/refill behavior in tests before modifying any limiter implementation; do not change its behavior as part of this bugfix unless exploratory testing identifies a separate defect.

## Testing Strategy

### Validation Approach

The strategy first demonstrates each defective path on the unfixed behavior, then applies fix checking to all bug-condition inputs and preservation checking to non-bug inputs. Unit tests cover deterministic helpers, property-based tests generate broad input combinations, and integration tests exercise the rendered home page and generated registry artifacts.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples before implementation and confirm the hypothesized causes.

**Test Plan**: Add focused tests against the current behavior, run them before the fix, and record failures for the delimiter expression, disabled docs URLs, unsafe GitHub response handling, pre-render fetch blocking, UTC-shifted dates, and per-cell linear lookup.

**Test Cases**:
1. **Period-separated about copy**: Supply `"one. two."` and assert two sentence entries; this fails before the delimiter correction.
2. **Disabled registry docs**: Compare disabled component IDs to catalog `meta.docs` entries; this fails for `progressive-blur` and `infinite-slider` before metadata cleanup.
3. **Unavailable GitHub response**: Mock rejected, non-OK, non-JSON, GraphQL-error, and malformed-payload responses; the original fetch can reject or let the page fail.
4. **GitHub streaming boundary**: Delay a valid mock response and verify non-GitHub content is available before it resolves; the original page blocks before creating its fallback.
5. **West-of-UTC date**: Run under a west-of-UTC `TZ` with `"2025-09-13"`; the original `new Date` comparison can populate the September 12 cell.
6. **Heatmap lookup work**: Instrument contribution lookup and verify the original cell render searches the collection repeatedly rather than accessing a map.
7. **Limiter baseline**: Exercise requests at, below, and after the allowance/refill thresholds to encode the existing behavior before any related work.

**Expected Counterexamples**:
- Sentence segmentation yields one entry for normal multi-sentence content.
- Disabled components retain dead public documentation URLs.
- Invalid GitHub responses escape the isolated section boundary or delay the page.
- Bare ISO dates move one calendar cell in affected time zones.
- Calendar rendering has O(cells × contributions) lookup behavior and transports unused intensity metadata.

### Fix Checking

**Goal**: Verify that every input satisfying the bug condition produces the defined property.

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  result := fixedFunction(input)
  ASSERT expectedBehavior(result)
END FOR
```

Check all GitHub transport failures independently, verify a delayed valid request reveals `GitSkeleton` only at the GitHub boundary, verify published files after `registry:build`, and run date-key assertions under at least one west-of-UTC time zone.

### Preservation Checking

**Goal**: Verify that inputs outside the bug condition retain their original behavior.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT originalFunction(input) = fixedFunction(input)
END FOR
```

**Testing Approach**: Capture baseline outcomes for delimiter-free and empty content, valid enabled documentation metadata, token-absent and successful GitHub behavior, zero cells, existing color buckets, and allowed limiter requests. Property-based generators should include empty and whitespace text, enabled/disabled item states, arbitrary valid bare ISO dates, contribution counts, and request sequences within existing limiter rules.

### Unit Tests

- Test `splitAboutSentences` for multiple period-separated sentences, one delimiter-free sentence, whitespace-only content, and no empty entries.
- Test registry documentation metadata against enabled component IDs and source/file preservation; assert built JSON remains valid and self-contained.
- Test `fetchGithubData` for missing token, network rejection, non-OK status, JSON parsing error, GraphQL error, malformed payload, valid empty data, and valid normalized data.
- Test heatmap date-key construction and count-to-color thresholds, including a bare ISO date in a west-of-UTC environment.
- Test recorded limiter allowance and refill-window boundary cases without changing its implementation.

### Property-Based Tests

- Generate period-terminated text segments and assert segmentation preserves order and non-empty content.
- Generate registry component states and catalog metadata to assert docs URLs are present exactly for enabled documentation routes while source/install data remains present.
- Generate valid ISO date keys and contribution counts to assert lookup returns the exact count for its matching key, zero otherwise, without date parsing shifts.
- Generate permitted request sequences within the established limiter window and assert their original allow/deny outcomes are preserved.

### Integration Tests

- Render the home page with a delayed successful GitHub request and confirm non-GitHub sections stream while only the GitHub section displays `GitSkeleton`.
- Render with each GitHub failure mode and confirm the remaining page succeeds without a GitHub divider; render with a valid response and confirm the heatmap and tooltips remain available.
- Run `npm run registry:build`, inspect emitted `public/r/registry.json` and per-item artifacts, and confirm disabled docs URLs are absent while installable registry files remain valid.
- Run the test suite, `npx tsc --noEmit`, and `npm run lint`; inspect the result on the existing development server before release.
