# Bugfix Requirements Document

## Introduction

Resolve the defects identified in advisor plans 001–004: incorrect sentence segmentation, missing regression safeguards, dead published documentation links, GitHub-data failure propagation, and GitHub heatmap date and efficiency defects. The correction must preserve valid portfolio rendering, registry contracts, and existing visual intensity semantics.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN the about content contains multiple period-terminated sentences separated by whitespace THEN the system treats the content as one sentence instead of separating the sentences for display.

1.2 WHEN a regression affects sentence segmentation, request limiting, or published registry-item invariants THEN the system has no repeatable automated verification that detects the regression before release.

1.3 WHEN a consumer follows the published documentation link for a disabled registry item THEN the system directs the consumer to a page that is unavailable.

1.4 WHEN the GitHub data request fails, returns a non-success response, returns a non-JSON response, or encounters a network error THEN the system can fail the entire home page instead of omitting the unavailable GitHub section.

1.5 WHEN the home page requests GitHub data THEN the system waits for that request before it can stream the remaining home-page content, so the loading fallback does not protect the initial render.

1.6 WHEN a visitor west of UTC views a contribution represented by a bare ISO date THEN the system can render that contribution in the preceding calendar cell.

1.7 WHEN the heatmap renders contribution cells THEN the system repeatedly scans all contributions for each cell and produces unused intensity metadata with rules that differ from the displayed count-based intensity scheme.

### Expected Behavior (Correct)

2.1 WHEN the about content contains multiple period-terminated sentences separated by whitespace THEN the system SHALL separate and display each sentence independently.

2.2 WHEN a regression affects sentence segmentation, request limiting, or published registry-item invariants THEN the system SHALL provide repeatable automated verification that identifies the regression before release.

2.3 WHEN a registry item has no enabled documentation page THEN the system SHALL NOT publish a documentation URL for that item.

2.4 WHEN the GitHub data request fails, returns a non-success response, returns a non-JSON response, or encounters a network error THEN the system SHALL render the remaining home page successfully and omit the unavailable GitHub section.

2.5 WHEN the home page requests GitHub data THEN the system SHALL allow the remaining home-page content to render while the GitHub section is pending and show its loading fallback only for that section.

2.6 WHEN a contribution is represented by a bare ISO date THEN the system SHALL associate it with the calendar cell for that same local calendar date.

2.7 WHEN the heatmap renders contribution cells THEN the system SHALL resolve contributions by their ISO-date key without repeatedly scanning the full contribution list and SHALL provide only the contribution data required by the displayed count-based intensity scheme.

### Unchanged Behavior (Regression Prevention)

3.1 WHEN the about content has no period delimiter THEN the system SHALL CONTINUE TO display the full non-empty content as one sentence, and SHALL CONTINUE TO produce no sentence entries for empty content.

3.2 WHEN a registry item has an enabled documentation page THEN the system SHALL CONTINUE TO publish its valid documentation URL; its source URL and installable content SHALL remain available for every registry item.

3.3 WHEN the GitHub token is absent THEN the system SHALL CONTINUE TO omit the GitHub section without rendering an empty divider or failing the home page.

3.4 WHEN the GitHub data request succeeds with contribution data THEN the system SHALL CONTINUE TO render the GitHub heatmap, its tooltips, and the existing count-based color thresholds.

3.5 WHEN a heatmap cell has no matching contribution THEN the system SHALL CONTINUE TO render the zero-contribution color for that cell.

3.6 WHEN the request limiter receives requests within its existing allowance and refill window rules THEN the system SHALL CONTINUE TO apply those rules without behavioral change.

3.7 WHEN published registry content is generated after a registry change THEN the system SHALL CONTINUE TO produce valid, self-contained installable registry data.
