# Contact doodles

Quirky, fast-and-rough drawings of Jadelynn doing her hobbies.
One is picked at random when the page loads; clicking the doodle shuffles to another.

## Expected files (white background, roughly square)
- `coding.png`   — coding cross-legged with headphones
- `matcha.png`   — walking with a matcha
- `puzzle.png`   — working on a jigsaw puzzle
- `swimming.png` — swimming
- `robot.png`    — standing next to a robot arm

PNG or SVG both work. Any file in the list below that doesn't exist is skipped
automatically, and if none exist the slot just hides itself — no broken images.

## How to add / change
Edit `DOODLE_SOURCES` in `script.js`. Each entry is:
```js
{ src: 'images/doodles/coding.png', alt: 'Doodle of Jadelynn coding' }
```
- `alt` — describes the image for screen readers.
- Add more entries for more doodles — there's no limit.

## Style tips for a consistent set
- Fast, rough, hand-drawn line look — complete, not unfinished.
- Black ink outline; accessories / props / outfit colored in with bright markers.
- Plain white background, roughly square framing (displayed up to ~200px wide).
- Generate them in one session (reuse the same seed / style reference if possible).
