# Implementation notes

## Tested runtime

`assets/diorama-runtime.js` is an ES module tested with `three@0.180.0` on a WebGL2 browser. It is a reusable starting point, not the original artists' implementation. It imports the bare specifier `three`; supply that through the host bundler or a local import map. A standalone demo needs both `three.module.min.js` and its sibling `three.core.min.js` from the same official package, plus its license. Do not mix releases.

For a new isolated project, pin `three@0.180.0`. In an existing project, inspect its installed package and verify the relevant APIs before choosing a dependency or changing versions.

## Runtime interface

```js
import { THREE, createDiorama, box, cylinder, rod, material, makeRandom } from './diorama-runtime.js';

const stage = createDiorama(container, {
  label: 'A tiny outdoor basketball court with three players.',
  pixelSize: 2,
  levels: 8,
  dither: 0.85,
});

const world = new THREE.Group();
box(world, [8, 0.12, 7], [0, 0, 0], material('#71845a'));
// Add the requested subject's geometry and a coherent action here.
stage.setWorld(world, {
  target: [0, 0.8, 0],
  duration: 45,
  loop: false,
  startTime: 0,
  update(timeSeconds) { /* assign poses from absolute scene time */ },
  stillTime: 1.2,
});

stage.setPlaying(false);
stage.seek(24);
stage.replay();
stage.setStyle({ dither: 0.5, levels: 10, pixelSize: 2 });
stage.dispose();
```

The geometry line is a usage example, not a complete scene. Create real subject geometry and an action for the user's request.

## Runnable examples

`assets/demo/` contains complete authored scenes, a small scene picker with an accessible timeline, locally bundled Three.js 0.180.0 and its MIT license, and browser checks. It imports the single runtime at `assets/diorama-runtime.js`. These are original examples built for this skill, rather than the source artists' code.

To run without installing Node dependencies, serve the skill's `assets` directory with a local HTTP server, for example `python -m http.server 8767 --bind 127.0.0.1` from that directory, then open `http://127.0.0.1:8767/demo/`. ES modules require HTTP; double-clicking the HTML from disk is insufficient. A host bundler may instead import a scene builder and the runtime into its own component lifecycle.

The example app plays finite stories once and holds the ending by default. The timeline supports seeking, Replay starts the sequence again, and Loop explicitly repeats the complete sequence. See [sequences.md](sequences.md) before changing story duration or choreography.

Helper contracts:

- `material(color, options?)`: `MeshLambertMaterial`, with a hexadecimal/sRGB scene color. Reuse material instances where appropriate.
- `box(parent, [width,height,depth], [x,y,z], material)`: creates and returns a shadow-casting box mesh.
- `cylinder(parent, [radiusTop,radiusBottom,height], [x,y,z], material, segments=8)`: creates a vertical cylinder.
- `rod(parent, fromXYZ, toXYZ, radius, material, segments=6)`: cylinder oriented between two local positions. Rebuild dynamic limbs by transforming a persistent rod, not allocating a new mesh every frame.
- `makeRandom(seed=1)`: deterministic seeded RNG in `[0,1)` for material variation and prop placement.
- `THREE`: the imported Three.js namespace, re-exported for scene files.

`setWorld` disposes the prior world's geometry, materials and material textures. Give it exclusive ownership; do not share disposable resources with another stage. `update` accepts absolute time and must set, rather than accumulate, transforms. Use the largest animated silhouette in the static bounding envelope, or pass `bounds: new THREE.Box3(min, max)` to `setWorld`. That supplied envelope is part of the framing contract and must contain the whole animation, including weather and steam.

`stage.playing` exposes actual playback. `currentTime`, `duration`, `loop`, and `ended` expose the master timeline. Reduced motion starts paused at `stillTime`; an explicit play control can opt into animation. `onError(message)`, `onPlayingChange(boolean)`, `onTimeChange({time,duration,ended})`, and `onComplete()` may be supplied to `createDiorama` for HTML controls or fallback handling. Finite playback stops and holds at its end; `seek`, `replay`, and `setLoop` provide explicit control. See [sequences.md](sequences.md) for the longer-scene contract. The runtime renders on changes and automatically suspends continuous frames while hidden/offscreen. `setStyle` clamps its numeric options to useful ranges.

## Why the pass order matters

The runtime renders the lit scene into a low-resolution nearest-filtered linear target, then draws it through a full-screen `ShaderMaterial`. The shader converts the sampled linear color to sRGB once, applies a stable 4x4 Bayer threshold while quantizing color, and writes directly to the display. `toneMapped` is false for that pass. Do not append another output/color-conversion pass to this particular pipeline; that would wash out the palette.

A Bayer threshold perturbs the rounding boundary between neighboring quantized values. It is deterministic, anchored to `gl_FragCoord`, and has zero-mean offset. Random per-frame noise makes the artwork crawl. The exact white background is preserved rather than quantized into a screen-wide checkerboard.

The scene's rendering resolution, and not just CSS size, establishes the pixel grid. High-DPI screens do not need an unbounded device-pixel ratio for this look. Thin details need at least one or two logical pixels at the final size; thicken the geometry or adjust the camera if they vanish.

## Compose and animate

Use a single scene, orthographic camera, renderer, and post-process target per visible illustration. Keep multiple subject worlds as scene builders and dispose the old one when replacing it. Do not create a renderer on every render or animation frame.

Build static texture variation once using the seeded RNG. Use instancing or merged geometry for large repeated fields, such as grass, pebbles, and rain. Keep counts proportional to visible size; avoid thousands of tiny mesh allocations where a single `Points` or `InstancedMesh` is sufficient.

For figures, put the torso and head in a body group. Add shoulders and hips as joints and animate limb rotations. A two-segment arm can touch a moving hand target. Ground the shoes and keep their contact stable while the upper body moves. Use continuous functions of absolute time so pause, resume, seeking, replay, and fixed still frames agree. Plan sufficient articulation and bounds for the later stages of a longer scene, not just its initial pose.

Weather should be bounded. Use deterministic per-particle phase offsets and modulo height for rain, with wrap points hidden above/below the visible action. Fade steam near its spawn and disappearance; do not use transparency that obscures the whole stall. Include moving particles in the framing envelope without allowing invisible particles to make the subject tiny.

## Lifecycle and access

Use client-only initialization when integrating into an SSR app. Instantiate after the container mounts, and call `dispose` on teardown. Reuse the app's existing error boundary or show a useful HTML error state if WebGL initialization fails. `createDiorama` throws on construction failure after reporting through `onError`; catch it at the integration boundary. Never leave a loading skeleton indefinitely because a module or graphics context failed.

The runtime has a canvas accessible name, a context-loss fallback, reduced-motion support, resize observation, page-visibility handling and offscreen suspension. Host controls remain ordinary HTML buttons with visible focus and approximately 44px touch targets. If using a static fallback image, give it a descriptive alt and preserve the same composition.

Do not claim a non-WebGL fallback was tested unless it was. To test context loss, use a developer tool against the local demo and verify both the visible error and recovery or a working retry path.

## Primary API references

Use pinned source when adapting this implementation to its tested release:

- [Three.js r180 package manifest](https://github.com/mrdoob/three.js/blob/r180/package.json)
- [r180 OrthographicCamera documentation](https://github.com/mrdoob/three.js/blob/r180/docs/api/en/cameras/OrthographicCamera.html)
- [r180 WebGLRenderer](https://github.com/mrdoob/three.js/blob/r180/src/renderers/WebGLRenderer.js)
- [r180 WebGLRenderTarget](https://github.com/mrdoob/three.js/blob/r180/src/renderers/WebGLRenderTarget.js)
- [r180 color-space shader definitions](https://github.com/mrdoob/three.js/blob/r180/src/renderers/shaders/ShaderChunk/colorspace_pars_fragment.glsl.js)

The style can be recreated with another capable renderer. Keep the visual contract, output transform, stable dither, animation continuity, and lifecycle behavior rather than translating API calls mechanically.
