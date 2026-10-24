# Visual evidence and art direction

## Sources

Inspected in the browser on 2026-10-23:

| Source | Bundled visual | Visible evidence |
| --- | --- | --- |
| [Dhruv's ramen scene](https://x.com/dhruvtwt_/status/2113621514235138388) | [ramen-reference.jpg](ramen-reference.jpg) | Rainy ramen stall, two seated diners, cook, dark teal pitched roof, cream signage, orange-red curtains and lanterns, tiled finite base, warm interior, steam and small gestures. |
| [Shawn's basketball scene](https://x.com/zzzzshawn/status/2111546123546661289) | [basketball-reference.jpg](basketball-reference.jpg) | Outdoor half court, blue painted key on charcoal asphalt, off-white court markings, three moving figures, ball, hoop, bench and bin, rough grass edge, oblique ground shadows, large white surround. |

Shawn says ["Its webgl, w dither on it"](https://x.com/zzzzshawn/status/2111726390190162282) in the replies. The videos establish the appearance and motion, not the original scene code, exact palette, camera coordinates, shader, or framework. The implementation below is a tested reconstruction of the look.

## What makes it recognizable

The stage is a small, self-contained place with the physical specificity of a model railway set. It has a readable setting and an ordinary human activity. The white background isolates that activity. Pixelated edges and fine dither grain live on the same resolution grid, while the objects retain three-dimensional lighting.

The reference basketball scene is wider and lower than the ramen scene. The stall is vertically layered: tile, stools and diners, counter, cook and curtains, sign, roof. Do not force both subjects into an identical bounding box. Preserve their proportions and fit the camera around them.

The fine texture is distinct from large voxel blocks, loose scattered points, ASCII art, halftone outlines, blur, and film grain. A dithered image still needs convincing underlying geometry and lighting.

## Useful starting measurements

These are reconstruction ranges, not recovered original values:

| Property | Starting point | What to judge visually |
| --- | --- | --- |
| Camera | Orthographic, azimuth 45 degrees, elevation 30-38 degrees | See two ground edges, the tops of props, and readable vertical faces. |
| Subject width | Roughly 65-88% of the artwork viewport | Leave breathing room; avoid cropping an outer grass edge or roof. |
| Logical resolution | About 360-600 pixels across the whole art region | Fine enough for thin limbs, court lines, and signs; visibly pixelated at presentation size. |
| Pixel scale | Often 1.5-2.5 CSS pixels per logical pixel on desktop | Use one grid; do not independently pixelate each object. |
| Dither | Fixed 4x4 Bayer matrix, about 0.7-1.0 threshold strength | Tonal bands mix into an even, stable grain on surfaces. |
| Color quantization | Start near 7-10 levels per channel | Retain muted color families and visible shadow separation. |
| Ground thickness | Roughly 1-3% of ground width | It is a thin slice of a place, not a floating cliff. |
| Figures | Roughly 12-20% of ground width in height | People read as tiny articulated people, not large toy statues. |
| Ambient sub-cycle | About 3-8 seconds | A local gesture or environmental detail; not the full duration of a longer story. |
| Narrative duration | Start around 30-60 seconds when unspecified | Several connected actions with development, payoff, and a composed ending; use the actual requested length. |

Do not force integer CSS upscaling when it creates a clipping or layout problem. Keep the WebGL output at a logical low resolution with `image-rendering: pixelated`, then judge the actual browser result.

## Palette families

Use these as material examples sampled approximately from the two source settings, not as a universal preset for new subjects. A new place needs its own material palette and color hierarchy. Map app chrome to the host's existing semantic tokens.

| Role | Reconstruction color |
| --- | --- |
| White surround | `#ffffff` |
| Deep charcoal | `#303b3b` |
| Asphalt | `#4b5050` |
| Painted key / cool tiles | `#376579` |
| Grass | `#71845a` |
| Grass shadow | `#4c6245` |
| Faded markings / sign paper | `#ddd6be` |
| Timber | `#855a3d` |
| Warm wood / amber | `#c68c4f` |
| Lantern / clothing accent | `#c76137` |
| Roof | `#304b49` |

Use subtle per-tile or per-object variation, not random rainbow colors. Separate skin, hair, clothes, and shoes with a few clear values. A small head and a few jointed segments are enough; facial detail is unnecessary at this scale.

## Scene recipes

### Basketball

Create a charcoal half court within a thin concrete-and-grass tile. Add actual court geometry: perimeter, key, free-throw circle/arc, three-point arc, backboard, rim and short net. Use narrow off-white markings. A bench and bin sit near the far edge; they should feel smaller than the hoop. Let shadows run diagonally across the court.

Make two or three figures occupy different depths. For a dribble, the orange ball must visibly meet the ground and return to the hand in a repeatable trajectory. For a shot, coordinate arm release, the ball's arc, hoop contact, and a way to reset without a teleport. A good dribble is preferable to a broken shot.

### Ramen

Use a teal-and-cream tiled footprint with a modest open-front wooden stall. Add a deep pitched roof with visible eaves, posts, counter, a cloth curtain split into panels, a narrow cream sign, small stools, bowls, a cook and diners. Layer cool outdoor surfaces around a warm interior. Use legible, original signage if the user does not request the original words; do not invent Japanese glyphs.

The hero gesture is a diner leaning toward a bowl or lifting food. Use rising steam that resets invisibly and sparse rain confined to the miniature's footprint. Keep the rain low contrast; it must not create a rectangular veil across the white stage. Decorate with a plant, bottles, a lantern and counter utensils only after the stall and figures read clearly.

## Failure corrections

| Symptom | Correct the cause |
| --- | --- |
| Generic 3D toy / glossy render | Use matte materials, smaller bevel-free geometry, smaller figures, low-resolution render, and ordered dithering. |
| Black or dirty white surround | Keep background luminance exactly white; do not dither the empty background or apply full-screen noise. |
| Flat pixel icon | Establish volumetric geometry, one light direction, contact shadows, and occlusion between meaningful layers. |
| Excessive checkerboard / posterization | Raise color levels or lower dither strength. Inspect at presentation size before raising resolution. |
| Blurry edges | Disable MSAA, avoid a second smoothing pass, use nearest filters and pixelated CSS presentation. |
| Busy diorama | Remove secondary props; clarify the focal activity and silhouette. |
| Whole scene sways or bobs | Keep stage and camera fixed. Animate only the joints and objects involved in the action. |
| Isometric look lost on mobile | Refit the orthographic frustum from projected object bounds. Do not switch to a perspective camera. |

## Scope

These posts do not establish application navigation, forms, dashboard layout, typography, dark theme behavior, or sound. Create those only when the actual task asks for them, using the existing product's conventions. Credit the reference artists in supporting documentation; do not imply that a reconstruction is their original code or assets.
