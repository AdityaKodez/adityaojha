# Landscapes and different settings

The original references establish a rendering language, not a mandatory ramen/court subject, ground shape, or prop list. Use their fixed orthographic presentation, matte volumes, stable dither, quiet palette and readable activity in a variety of places.

## Change the composition with the place

An urban activity often works on a thin square tile. A river can cut diagonally through an irregular terrain slice. A coast can have terraced rock rising beside a sea surface. A station can use a longer footprint with rails leading the eye. Keep a finite miniature with breathing room, rather than surrounding the scene with generic decorative cards or extending a full-screen skybox to hide composition problems.

Use distinct silhouettes and heights. A lighthouse needs space above the tower and room around its coastline. A pine forest needs gaps between tree canopies so the river, bridge, and characters remain legible. A platform needs clear separation between track, safety edge, waiting area and shelter. Its railway construction should lead the composition; an oversized green hill or foliage mass should not make it read as another forest. Do not place all props on a regular grid or give all scenes the same object density.

## Terrain

Let landforms define the ground edge. Use a few coherent height bands, low-poly slopes or a deliberately cut terrain mesh. Ground vegetation and architecture on the actual surface, not on a hidden flat plane above it. Use visible layers sparingly on cliffs; a thick cuboid base under every setting changes the delicate model-like quality.

Group rock variation into a few stone families. Place smaller stones where erosion, a path, or a water edge makes sense. Avoid uniform random scatter or making every rock a different hue. Keep the outer edge rough at the same apparent detail scale as the source scenes.

## Water

Water should occupy a definite river channel or coastline and meet the land cleanly. Favor a few matte blue-green values, subtle current ribbons or sparse moving highlights, and local shoreline foam. Strong glossy reflections, white glow, and full-surface animated noise fight this visual language.

Tie water motion to the setting: river highlights flow downstream; small waves follow the shore; a boat displaces through water on a coherent path. Water motion may loop as an ambient sub-track while the narrative progresses. Avoid transparent water planes with unstable sorting through the terrain; a controlled opaque material is often sufficient at this scale.

## Vegetation

Use recognizable silhouettes: asymmetric layered pine canopies, a few broad-leaf clusters, reeds along banks, or wind-shaped coastal shrubs. Make trunks, large branches and grass scale consistently with the people and buildings. Vary species, height and clumping intentionally; uniform cones across the whole scene read as a generic procedural forest.

Place vegetation to frame the activity. Keep a clear view of important transitions. Use instancing or merged geometry for repeated grass and foliage; do not allocate geometry or randomize placement on every update.

## Architecture, moving vehicles, and figures

Give each setting its own credible construction. Rails need sleepers and a usable platform edge; a lighthouse needs a base, shaft and lantern; a footbridge needs connected supports and a walking surface. A different color on the ramen-stall model does not establish a new design.

A moving train, boat, or person needs a complete path within the authored stage and bounds. Author arrival, stopping, interaction and departure as separate phases. If an entrance/exit uses a scenic mask or tunnel, model the opening and keep the moving object hidden by actual geometry, rather than teleporting it in the open.

Long stories should contain different actions. A boat merely circling for 45 seconds or a train oscillating back and forth does not demonstrate a longer sequence. Add meaningful preparation, interaction, consequence and settling that fit the subject.

## Palette and lighting

Keep the rendering treatment consistent while changing material families with the setting. A forest may emphasize deep pine, sage, warm timber and cool river water. A coast may emphasize faded cream, slate sea, weathered red, pale stone and sparse grass. A station can use warm concrete, weathered brick/stone, charcoal rails and canopy, steel, cream signage, timber seating, and a restrained railcar color. These are material examples, not extra app UI accents.

Write a short place/material palette before modeling detail. Identify the surfaces occupying most of the image and the materials they should read as. Choose colors for those materials first, then add supporting hues and small accents. Muted does not mean every surface should be green or olive. If the location matters, use its actual construction and regional cues from available references or the user's context instead of inventing a generalized countryside look.

For the bundled station example, the user's direction is to keep green mostly in plausible planting, rather than extending it across the train, canopy, tunnel masonry, platform and ground. Vary the physical design as well as the palette: a canopy supported on posts, a clear platform edge, ballast, brick or stone portal, and a recognizably finished railcar should express the place even in grayscale. Follow a different explicit material or regional brief when supplied. If the user rejects a palette or architecture, repair the example and re-review it before adding it to the skill's visual references.

Use one coherent key-light direction and enough fill for readable shadow detail. Preserve separation between foreground activity and background props. Keep the white surround clean. Sample the dither at the actual display size: fine reeds, rails, cables and branches can disappear if thinner than a logical pixel.

## Review before keeping an example

Only add a generated scene to the skill's style examples after viewing its rendered output and checking the complete sequence. Keep its image, subject, composition choices, palette, camera/pixel settings, and tested playback duration together. Identify it as an original generated example, separate from the two artists' source references.

Reject or repair a scene if its terrain is an arbitrary slab, its activity is hidden by foliage, its water is a shiny effect sheet, its figures float, its vehicle teleports, or its longer sequence is only a short repeated motion. A passing runtime test does not make a weak visual example worth keeping.
