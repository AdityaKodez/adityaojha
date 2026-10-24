---
name: dithered-isometric-scenes
description: "Build animated isometric miniature scenes and longer staged 3D sequences with matte low-poly geometry, ordered pixel dithering, and a quiet white stage. Use for Small Plays-style dioramas, tiny worlds, and WebGL illustrations like the referenced basketball court and ramen stall. Supports finite stories and explicit loops; not a general dashboard or retro-game UI theme."
---

# Dithered Isometric Scenes

Recreate the visual language in these two references:

- [Dhruv: Small Play - Naruto Eating at Ichiraku Ramen](https://x.com/dhruvtwt_/status/2113621514235138388)
- [Shawn: Small plays - Basketball](https://x.com/zzzzshawn/status/2111546123546661289)

The shared look is an **animated, dithered 3D miniature on an empty white stage**. It is not the surrounding X interface. Build an actual scene with coherent volume and a small narrative, rather than a flat pixel icon, generic voxel pile, dashboard, or game HUD.

## Start with the visual evidence

Read [references/style-guide.md](references/style-guide.md) and view its two bundled reference frames before composing a new scene. The guide separates visible facts from inferred implementation choices. The screenshots keep this skill usable if X is unavailable; live access is optional unless the task depends on details they do not show.

Identify the requested subject, narrative scope, duration, playback mode, and output format. For a vague scene request, choose a recognizable everyday activity and state that assumption. Preserve a specific subject or layout the user supplies. Do not replace it with an easier scene or collapse a longer sequence into a short repeated gesture.

Inspect the host project's rendering setup and conventions. Keep unrelated application screens, colors, dependencies, and configuration outside the change. If asked for this look inside an existing app, apply it to the illustration region; the reference does not establish a site-wide typography or component system.

## The visual contract

1. **One small world.** Use a finite ground tile, often square and projected as a diamond, with a thin, imperfect edge. A landscape can use an irregular shoreline, a terraced cliff or a cut section of terrain. Keep its physical boundary visible and preserve substantial empty space around the silhouette. Do not force every setting into the same flat square.
2. **Orthographic three-quarter view.** Start around 45 degrees in azimuth and 30-38 degrees above the ground. Parallel edges stay parallel. Keep the camera still unless camera motion is requested.
3. **Simple volume, fine texture.** Model ordinary objects with boxes, low-segment cylinders, planes, and small articulated figures. The reference is not made of large Minecraft-like cubes. Use a low-resolution render and an ordered screen-space dither to unify all surfaces, characters, and shadows.
4. **A palette that belongs to the place.** Choose muted material colors from the actual subject, architecture, location, and mood. Charcoal, slate, cream, timber, brick, water and vegetation are possible families, not a fixed green-brown preset. A forest may be predominantly green; a railway station should read through its masonry, platform, rails, roof and vehicle materials. The reviewed station uses green mainly in vegetation; another regional or heritage brief may call for painted green ironwork or vehicles. Keep the materials matte and use warm details where the activity calls for them.
5. **Readable local light.** Use one directional key, ambient fill, and grounded shadows. An interior can have restrained warm local light. Keep the surrounding white field clean, without a fake floor, vignette, grain overlay, or atmospheric gradient.
6. **A story at the requested scale.** A short ambient miniature can center on one repeating action. A longer scene needs distinct, connected actions with preparation, development, payoff, and settling. Rain, steam, and idle gestures can loop underneath; they do not substitute for the main sequence. Animate joints and object paths coherently; uniform bobbing is not an action.
7. **Quiet framing.** If the deliverable needs controls, keep them in ordinary readable HTML outside the artwork. Do not infer pixel fonts, neon buttons, inventory panels, or scoreboards from the scene's texture.

Composition and recognizable action take priority over the count of decorative objects.

## Build it

For a new WebGL illustration, read [references/implementation.md](references/implementation.md). The tested starting point is [assets/diorama-runtime.js](assets/diorama-runtime.js): copy it into the output project and import it there. It provides the orthographic stage, nearest-neighbor render target, ordered-dither pass, projected-bounds fitting, lifecycle, and a few geometry helpers. Build subject-specific geometry and motion separately. Do not edit the installed skill while using it for an ordinary task.

For landscapes, water, vegetation, or a setting structurally different from the two source scenes, also read [references/landscapes.md](references/landscapes.md). Preserve the shared rendering language while letting terrain, silhouette, palette, and activity respond to the actual place.

See [references/examples.md](references/examples.md) for rendered adaptations that passed visual review and sequence checks. Use their material and composition decisions as subject-specific examples, rather than imposing one example's palette on every new scene.

The runtime was verified with **Three.js 0.180.0**. This is a tested pin, not a claim about the latest release. Respect a host project's installed version and verify its relevant APIs before adapting the runtime. Use an existing Three.js stack where possible; do not install a second copy or a React abstraction solely for this skill.

Build the silhouette and focal action first, then add material variation and small props. Apply the dither after lighting and before presentation. Keep it anchored to the logical render grid so it does not become random temporal noise. Keep interaction text outside the shader.

Before adding many props, make a short place/material palette: dominant built or natural surfaces, supporting materials, and one or two small activity accents. Match the design as well as the hue to the setting. Do not make a train station by coloring the forest green, or a coast by recoloring an urban tile. Check the silhouette and dominant color masses at thumbnail size. A palette or design the user rejects must be revised before it is retained as a skill example, even if its runtime tests pass.

For a longer scene, read [references/sequences.md](references/sequences.md) before implementing motion. Plan a master timeline and use deterministic absolute-time tracks. Specify the duration and whether playback ends or repeats. When neither is given for a narrative scene, a useful starting point is 45 seconds, played once and held on its ending. A loop must be explicit; do not wrap the entire narrative every few seconds.

Cap long frame deltas. Stop unnecessary rendering when ended, paused, offscreen, or hidden; honor reduced motion with a composed still frame. Resize the render target and camera to the container without cropping any phase of the sequence. Dispose replaced geometry, materials, textures, renderer targets, and listeners.

## Verify the actual result

Render the result in a browser and compare it with the bundled frames at a similar apparent size. Check these observable properties:

- The entire finite base, tallest prop, figures, and major shadows fit inside the stage on desktop and mobile.
- The subject reads immediately at thumbnail size. Shadows explain contact and volume; small props do not obscure the activity.
- Pixels remain crisp and consistent, with visible ordered tonal transitions. The treatment is not merely a noise layer or a CSS pixelation filter on a smooth scene.
- Watch the entire requested duration. Inspect all phase boundaries and compare start, middle, payoff, and ending. Distinct phases must change poses, object ownership, or activity meaningfully; multiplying a short loop's period or repeating it to fill a minute does not satisfy a longer-sequence request.
- A held ball meets its hand, feet remain grounded, and transfers or impacts happen at their actual times. An explicit loop must return continuously; finite playback must stop at its ending without restarting.
- Seek forward and backward across every transition and compare the result with normal playback. Pause/resume, replay, scene replacement, and reduced motion must agree with the same master timeline.
- Pause freezes the complete scene; resume continues without a jump. Reduced motion starts with a useful still frame. Hidden/offscreen scenes do not accumulate animation frames.
- Test a narrow viewport, keyboard-accessible controls, resizing, and WebGL failure/context loss. The page keeps a meaningful accessible description or fallback rather than a silent blank canvas.
- No runtime errors, broken assets, duplicate render loops, or leaked WebGL contexts appear during scene replacement.

Fix a visible mismatch in camera, scale, palette, lighting, or action before adding more detail. Report which checks were run and keep any fidelity limitation explicit. A clean console alone does not prove a style match. See [references/validation.md](references/validation.md) for the bundled examples' verified scope and reproducible checks.
