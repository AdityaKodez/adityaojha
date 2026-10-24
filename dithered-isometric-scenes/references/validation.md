# Validation record

Verified on 2026-10-23 in the Codex in-app Chromium browser with WebGL2. These are original reconstructions of the referenced visual language; they are not the artists' source scenes or an exact recovered implementation.

| Area | Observed result |
| --- | --- |
| Shared runtime | 34/34 checks in ordinary motion and 34/34 with reduced motion. Covers pause/resume, resize, low-resolution canvas, replacement/disposal, offscreen suspension, context loss/recovery, seeking, completion/hold, replay and explicit looping. |
| Installed scene contracts | 11/11 for each of ramen, basketball, forest, station and coast. Samples the complete timeline and phase boundaries for finite transforms, bounds, deterministic seeking, continuity, varied poses and the complete-story loop seam. |
| Full playback | Each authored 45-second story reached all of its phases, completed once and held its ending. Per-phase frames were inspected. |
| Responsive controls | All five installed scenes checked at 320px and 390px. Document scroll width equaled client width, one canvas remained, controls were at least 44px high, and keyboard End/Home changed Replay back to Play. Forest, station and coast also received explicit narrow-screen visual review. |
| Reduced-motion stills | All five installed scenes started paused at their composed still, with an explicit Play control. |
| Console | No warnings or errors during final installed scene checks and scene switching. |

The revised station uses masonry, warm paving, charcoal ironwork and a cream/maroon railcar. Its rejected green-dominated candidate is excluded from the style references. The forest and coastal examples have their own reviewed palettes and physical compositions. See [examples.md](examples.md) for images and design decisions, and [validation-results.json](validation-results.json) for the recorded check summaries.

## Reproduce

Serve the skill's `assets` folder over HTTP, then use these paths relative to that server:

- `/demo/`: five-scene picker, timeline, Play/Replay and explicit Loop controls.
- `/demo/qa.html`: shared runtime and original two-scene checks. Repeat with the browser's reduced-motion preference enabled.
- `/demo/scene-check.html?scene=station`: complete scene contract checks. Replace `station` with `ramen`, `basketball`, `forest` or `coast` for the other builders.
- `/demo/sequence-review.html?scene=coast`: records actual playback, phase images, completion count and final-frame hold. Keep the page visible and the stage onscreen until completion. The same scene identifiers work here.
- `/demo/?scene=station&time=20.95`: paused revised station frame. Other reviewed stills are `forest&time=18.7` and `coast&time=20`.

## Limits

The examples author 45 seconds of activity each. A separate three-minute clock/seek check verifies runtime duration handling; it does not demonstrate a three-minute authored story. Longer requested stories still require additional meaningful choreography and full-duration review.

Playback time excludes hidden/offscreen suspension, and large frame deltas are capped. Consequently, a 45-second story can take longer than 45 seconds of wall time during testing. Responsive checks used desktop browser emulation, not physical phones. Other browser engines, production integration, and total WebGL initialization failure were not tested; context-loss fallback and recovery were tested.
