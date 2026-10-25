# Genres framework

## Run it
Open `index.html`, or run `python3 -m http.server` here and visit `http://localhost:8000`. Browsers block music until the first click; use the play button if needed.

## Files
`index.html` structure · `styles.css` design tokens, scaling, layout · `script.js` config, data, behavior. Create `assets/` (see paths in `script.js`); missing files are skipped safely.

## How scaling works (styles.css sections 1 and 6)
- The hero is a **stage** with a reference ratio (`--stage-w` : `--stage-h`, 16:9, or 4:5 on portrait screens). It fits the screen like a picture and everything inside uses `cqw` units, so it scales together. Spare space shows the theme background.
- Columns use `minmax(0, 1fr)` and `html, body { overflow-x: clip }`, so nothing widens the page.
- Only the marquee has its own clipping box; the cassette may poke out of its square by `--frame-break`.

## Common edits (search for `EDIT HERE` / `REPLACE ASSET`)
- **Brand name and header icon:** `CONFIG.brand`.
- **Add an album:** copy an object in `PRODUCTS`; anything you leave out comes from `PRODUCT_DEFAULTS`. Add its font to the Google Fonts link in `index.html`.
- **Add a member:** add an object to `MEMBERS`. **Project story:** edit the `origin` section in `index.html`.
- **Which album is active:** `CONFIG.focus` (center, range, hysteresis).
- **Marquee text size and speed:** `CONFIG.marquee`. **Cassette physics:** `CONFIG.cassettePhysics` (`drag: false` disables dragging).
- **Features on/off, timing, crossfades, Google Form:** `CONFIG.features`, `CONFIG.intro`, `CONFIG.audio`, `CONFIG.orderFormUrl`.
- The scroll percentage in the mini player is page scroll, not song time.

## Addendum features
- **Intro headphones icon:** `CONFIG.intro.iconSize` / `iconGap`; swap the `<svg>` in `index.html` for your own.
- **Cassette images and reels:** `CONFIG.images` (hero, mini player) and each product's `animation`, `artRatio`, `reels`. Set `reels.src` to a transparent single-reel PNG to turn the reel overlay on; leave `''` to keep it off. `CONFIG.reels.degreesPerPx` sets the speed.
- **Cassette shadow:** `CONFIG.cassetteShadow`. **Cassette physics and drag:** `CONFIG.cassettePhysics`, `CONFIG.features.cassettePhysics`.
- **Visualizer:** `CONFIG.visualizer`. It only runs when the site is served over `http://` (see "Run it"), because browsers mute Web Audio over `file://`.
- **Custom cursor:** `CONFIG.features.customCursor` (desktop mouse only). **Member dividers:** variables on `.members` in `styles.css`.
