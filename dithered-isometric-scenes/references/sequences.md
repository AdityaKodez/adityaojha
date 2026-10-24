# Longer scenes and playback

The reference videos demonstrate the visual treatment of small worlds. Their short repeated actions do not limit the duration or narrative of a requested reconstruction. The user explicitly requires the 3D scene and the skill to accommodate longer sequences.

## Choose duration and mode separately

Establish the intended length and the ending behavior. A 45-second finite story and a 45-second loop can share geometry but have different endings. For a narrative with no supplied duration, begin around 30-60 seconds; the bundled longer demonstration uses 45 seconds. Preserve a longer requested duration. Do not turn that duration into repeated copies of a short ambient cycle.

Use these modes deliberately:

- **Once and hold:** progress from beginning to ending, stop rendering continuous frames, and retain the final composition. Replay is an explicit action.
- **Loop the full sequence:** wrap only after the entire authored sequence and its return transition. The last state must connect to the first without teleporting actors or props.
- **Ambient:** an intentionally endless environment with subordinate short cycles. Use only when that is the user's requested experience.

Keep the camera and scene footprint coherent over time. A fixed camera works well for long stories too; duration alone does not justify orbiting the world.

The bundled scene builders are authored as 45-second examples. The runtime accepts other positive durations, including sequences lasting minutes, but a longer requested story needs tracks and beats authored for that duration. Changing only the runtime's duration would leave a 45-second builder holding its last pose for the remaining time. Treat the examples as scene/track patterns, not as a duration-independent story generator.

## Write a beat sheet before tracks

Make a compact table containing start time, end time, action, actor/prop state, and continuity dependency. Include preparatory poses, travel time, reactions, and quiet rests. Do not make every second equally busy. Use about four to nine materially different beats for a 30-60 second scene, adjusted to the actual story.

Examples of connected activity:

- Basketball: establish positions, dribble while approaching, prepare and pass, receive and set feet, shoot, ball crosses the rim, rebound or retrieval, reaction, composed rest.
- Ramen: customer settles, cook prepares food, bowl is served to the counter, diner reaches and eats, pause and conversation, bowl is set down, weather eases, ending hold.

These are examples, not required stories. Props must follow their owners and travel through the scene; hiding a prop and reappearing it elsewhere is not a handoff.

## Use one master clock

Define every moving object's state as a function of absolute master time. Separate story progression from local repeating detail:

```js
const t = Math.max(0, Math.min(timeSeconds, duration));
const preparation = smoothstep((t - preparationStart) / preparationLength);
const localRainTime = timeSeconds; // independent background motion, if visible
```

Do not apply `% shortPeriod` to master time. Local cycles are appropriate for rain, breathing, steam and individual dribbles during their authored phase. Stop or transition those local cycles when the story moves on.

Use named intervals and deterministic interpolation. Cubic easing suits a hand reaching; ballistic trajectories suit a thrown or falling ball. Choose action-specific curves and retain velocity across phase boundaries where the physical action requires it. Large-object transforms, gesture weights, visibility, material changes, and ball ownership should all be recomputed for any given time.

Seek must work without replaying earlier frames. Avoid accumulated `position += velocity * delta`, one-shot timers, frame-count-based events, or random choices inside `update`. A stateful simulation needs an explicit deterministic replay/checkpoint strategy; do not add one when ordinary authored tracks suffice.

## Plan the 3D scene for all phases

Model the props and articulation needed later, even when they are initially unused. Give hands reachable targets, feet plausible paths or fixed contacts, and props stable attachment/transfer points. Include the whole action in the camera envelope: a shot may rise above a hoop, a customer may move toward a stool, and a served bowl traverses the counter.

The maximum animation bounds are not the initial frame's bounds. Compute or conservatively declare them, then sample the entire duration densely and at every transition. Keep camera fitting stable; do not refit around moving props every frame.

For changing ownership, use a world-space transfer track or analytically matched attachment transforms. At the exact handoff, the old owner's hand, prop, and new track must agree. At receipt, the receiver and prop must agree before attaching it. Maintain a clear contact point and timing, rather than only the approximate silhouette.

## Runtime contract

The bundled runtime accepts these `setWorld(world, settings)` fields:

- `duration`: positive finite number of seconds for a story; omit only for deliberately ambient content.
- `loop`: whether to repeat the entire duration, default `false`.
- `startTime`: normal-playback starting time, default `0` for a finite story.
- `stillTime`: composed frame for reduced-motion initial state.
- `update(timeSeconds)`: reconstruct all state at that absolute time.
- `bounds`, `target`: stable framing for the complete sequence.

Controls use `stage.seek(seconds)`, `stage.setLoop(boolean)`, `stage.setPlaying(boolean)`, and `stage.replay()`. Read `currentTime`, `duration`, `ended`, `loop`, and `playing`. The stage clamps finite playback at its end and stops continuous rendering. `onTimeChange({time,duration,ended})` lets the host update an accessible timeline. `onComplete()` fires on natural finite completion, not merely because a seek visited the ending.

For a finite sequence, the master clock starts at `startTime` during ordinary playback; reduced motion uses `stillTime` while paused. Scene replacement resets the new sequence's own time and duration. A paused seek remains paused. Repeated play/replay actions must not schedule duplicate frame loops. If a scene is paused by visibility or context loss, resume without an elapsed-time jump.

## Verification

Watch a complete real-time playthrough. Use seeking in addition to, not instead of, that watch. Check at least the following:

- Actual duration and completion behavior match the request.
- Start, middle, payoff and ending tell different parts of one story.
- Sampled transforms remain finite and inside bounds throughout, including transitions.
- Object and joint positions stay continuous across transitions unless a cut is intentional.
- Prop/hand contacts and impacts line up at authored times.
- Seeking forward then backward gives the same pose as seeking directly to that time.
- Repeated pause/resume and replay retain timing, and the final frame holds in once mode.
- Loop mode wraps the complete sequence only and meets its stated seam-continuity contract.
- Reduced motion supplies a useful still frame with an explicit way to play.

Keep evidence from several times and note any remaining approximation in the choreography. A full-length time counter on a repeating short pose is not evidence of a long sequence.
