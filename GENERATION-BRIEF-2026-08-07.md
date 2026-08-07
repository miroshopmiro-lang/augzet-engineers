# Augzet V2 — Generation Brief

**Date:** 7 August 2026
**For:** Abhinand to run through Fable / GPT Image / whichever generator
**Rule that governs everything here:** generated assets are allowed where a viewer reads them as *illustration* (motion-graphic hero footage, schematics, icons, charts). They are **not** allowed in any slot a viewer reads as *a record of a specific Augzet job* — project cards, case studies, testimonials. Real photography for real work; generation for the argument.

---

## Part A — Hero video: two new clips

### Why

The existing storyboard in `video_prompts.md` is a 9-clip sequence called "First Light", of which six clips are solar. The hero was cut from the middle of it. That is why the largest asset on a site whose positioning fight was *"electrical is the core, solar is one of four"* currently shows nothing but a solar farm.

**The fix does not need a new sequence.** It needs enough electrical footage in front of the existing solar clip that the hero reads electrical-first. That is two clips.

Your existing drone footage stays exactly as it is and does the solar beat.

| Beat | Clip | Status |
|---|---|---|
| 1 | The board | **generate** |
| 2 | The join | **generate** |
| 3 | Solar array | already have it |

Roughly 12 seconds on loop, electrical-led, solar arriving third where it belongs.

**If you only generate one, generate the board.** One electrical clip in front of the solar footage fixes the positioning on its own; the second clip makes the argument rather than just correcting the order.

### Master style block

Prepend to every prompt. This is the existing block, unchanged except the last line — the originals were 1920×1080 at ~6 Mbps, which is why the hero was 6.8 MB.

> Cinematic industrial documentary footage, photorealistic, real film grain, anamorphic lens character, shallow depth of field on macro details, deep focus on aerials. Colour grade shifts with the day: cool pre-dawn blue → warm midday neutral → saturated golden-hour amber → cool night blue with practical light sources. Protected negative space in the upper third for text overlay. Slow, deliberate camera moves, 24fps motion blur. No clear frontal human faces — use silhouette, backlighting, low angle, or distance instead. No text, no logos, no watermarks. Setting is Kerala, India: humid coastal light, coconut palms, laterite and concrete construction, Indian tradespeople.

**Output spec:** 4 seconds each, 1280×720, no audio. Encode with:

```bash
ffmpeg -i in.mp4 -an -vf scale=1280:-2 -c:v libx264 -preset slow -crf 30 -pix_fmt yuv420p -movflags +faststart out.mp4
```

---

### NEW-1 · The board (the single most important clip)

*Camera: slow push-in, locked horizontal.*

> [MASTER BLOCK] Interior, warm practical light: a large modern electrical distribution board with its door open, DIN-rail breakers in neat rows, labelled wiring looms dressed vertically, an energy meter and a monitoring gateway at the top. Slow push-in from waist height. A single green status LED pulses. No humans, no faces. The board fills the lower two-thirds, ceiling and wall left clear above.

**Why:** this is the company thesis in one frame — everything meets at the board, and Augzet designs the board. It should be the first frame of the hero sequence and, if you only generate one clip, generate this one.

---

### NEW-2 · The join

*Camera: slow rise, board to inverter.*

> [MASTER BLOCK] A wall carrying both a building's main electrical distribution board and, beside it, a solar inverter, with conduit visibly running between the two. The camera rises slowly from the board to the inverter, keeping both in frame. Cool interior daylight from the left, one warm lamp off-frame right. No humans, no faces.

**Why:** this is the bridge from beat 1 to beat 3 — it is literally the point where a solar array meets a building's existing electrical system, so the cut to the array footage then makes sense. It is also the company thesis, and it is legible to a homeowner in a way the current opened-inverter-internals photograph is not.

---

### Assembly

Order: **NEW-1 (board) → NEW-2 (the join) → existing drone array clip**

About 12 seconds on loop. Cross-dissolve 0.4s. Encoded weight ~1.3 MB, still well under the 6.8 MB the single old clip cost on its own.

The hero currently plays one clip on loop. Once you have these, the `<video>` in `index.html` takes one pre-assembled sequence — simplest path is to hand me the two new files and I'll concatenate and encode them with the existing clip, so nothing changes in the markup.

---

## Part B — Diagrams (GPT Image or vector)

These replace the "Electrical / The join / Solar" photo strip, which reads as three near-identical dark technical close-ups and whose middle caption ("The join") means nothing to a homeowner.

### Shared style block

> Single-line electrical schematic diagram in the style of a professional engineering drawing. Uniform 2px stroke weight throughout, no weight variation, no tapering. Hard 90-degree corners, no rounded joins. Line only, no fills, no gradients, no drop shadows, no 3D, no isometric projection. Flat vector. Labels in a geometric sans-serif, uppercase, wide letter-spacing, small. Transparent background. Palette: strokes in warm off-white #F4F4F4, the energy path in gold #F0941D, and exactly one element highlighted in red #CD0A1B.

---

### DIAGRAM-1 · The integration schematic — **the important one**

> [SHARED BLOCK] A schematic showing three sources converging on one central distribution board: from the left, a grid supply symbol; from above, a photovoltaic array symbol feeding through an inverter; from the right, an automation controller node. All three connect by single lines into a central distribution board drawn as a rectangle containing breaker symbols. From the bottom of the board, four lines branch out to load symbols: lighting, socket outlet, air-conditioner, water pump. The central distribution board is the only element drawn in red; the lines carrying power are gold; everything else is off-white. Horizontal composition, generous margins.

**Caption to sit under it:** *"Everything meets at the board. We design the board."*

This states the whole company thesis in one image, keeps electrical structurally central with solar as one of three inputs, and cannot be mistaken for a photograph of someone else's job.

---

### DIAGRAM-2 · Four capability marks

Generate as one sheet, four glyphs, identical stroke weight, then split.

> [SHARED BLOCK] Four separate small square icons in one row, each a minimal single-line electrical schematic glyph, identical stroke weight and optical size:
> 1. a distribution board rectangle with three breaker symbols and one circuit branching below
> 2. a central controller node with four signal lines radiating to small device squares
> 3. a photovoltaic panel grid symbol connected to an inverter square
> 4. a multimeter probe touching a terminal, with a small waveform beside it
>
> All strokes off-white, one accent detail per glyph in gold. No labels, no background.

Replaces the four photo crops in the homepage capability list.

---

### DIAGRAM-3 · Bill offset

> [SHARED BLOCK] A simple two-bar vertical chart. Left bar labelled BEFORE, drawn as one solid block outline in off-white. Right bar labelled AFTER, the same total height, split into a lower gold portion labelled SOLAR and a smaller upper off-white portion labelled GRID. Vertical axis labelled in rupees with no specific numbers. Minimal, no gridlines, no chart junk.

Supports the cost-of-delay argument. **Leave the numbers off** until the client supplies a real representative case — an invented payback figure is exactly the problem flagged with the 42 kVA and 24-node specs on the projects page.

---

## Part C — What must be photographed, not generated

Still outstanding from the client. No generator substitutes for these.

1. **Three founder headshots.** Same wall, same light, same crop, shoulders up. Currently the site uses one real group photo of the three of them (`founders-three.jpg`) with names listed beside it, because nothing in the source identifies which person is which — cropping faces out of a group shot to label them by name would be a guess.
2. **3–5 more site-work photos** in the mould of `site-engineer-drawing.jpg` (p13): panel work, automation install, testing with instruments in hand.
3. **One completed villa or commercial exterior at dusk**, lights on, shot by them. The existing `villa-night-lit.jpg` is used in three places.
4. **Real figures for the four unnamed project cards**, or permission to delete them.

**Reference shot for all of it:** `assets/img/photos/site-engineer-drawing.jpg` — natural light, deep focus, working not posing, no eye contact, branded polo. Full photography direction in `AUDIT-2026-08-07.md` §11.
