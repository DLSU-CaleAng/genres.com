/* Genres — script.js
   Sections: 1 CONFIG · 2 PRODUCTS · 3 Helpers · 4 Music + SFX · 5 Theme + foreground
             6 Product rendering · 7 Pages · 8 Scroll · 9 Intro · 10 Start */

// ===== 1. CONFIG (EDIT HERE) =====
const CONFIG = {
  // Feature flags: set false to switch a system fully off (its code never runs).
  features: {
    intro: true,            // first-visit intro sequence
    music: true,            // intro/home/album music + crossfades
    sfx: true,              // click + disc-scratch sounds
    productHover: true,     // cassette grows on hover
    albumThemes: true,      // album colors + artwork background
    foregroundGifs: true,   // full-screen GIF overlays
    backgroundMotion: true, // layered parallax on the home hero
    musicalNotes: true,     // scroll-reactive notes + staff lines
    cassettePhysics: true,  // floating + draggable home cassette
    reels: true,            // reels turn with scroll
    visualizer: true,       // audio-reactive bars (needs http://, see README)
    customCursor: true      // cassette-style cursor (desktop mouse only)
  },
  intro: {
    videoSrc: 'assets/intro.mp4',      // REPLACE ASSET (.mp4; leave '' to skip the animation)
    musicSrc: 'assets/intro-music.mp3',// REPLACE ASSET ('' = no intro music)
    iconSize: 'clamp(64px, 12vw, 88px)', // headphones icon size (any CSS length)
    iconGap: '1rem',                     // space between icon and text
    noticeMs: 2000,                    // how long "Headphones recommended" shows
    logoMs: 1800,                      // how long the logo shows
    maxDurationMs: 8000,               // safety timeout: intro always ends by then
    showEveryVisit: false,             // true = ignore the "already seen" memory (handy while testing)
    storageKey: 'genres-intro-seen'   // localStorage key; delete it to see the intro again
  },
  audio: {
    homeSrc: 'assets/home.mp3',        // REPLACE ASSET: home + order page music
    volume: 0.7,
    crossfadeMs: 1500,                 // length of every music crossfade
    sfxVolume: 0.6,
    clickSrc: 'assets/click.mp3',      // REPLACE ASSET ('' = no click sound)
    scratchSrc: 'assets/scratch.mp3'   // REPLACE ASSET: plays when the active album changes
  },
  gifWipe: { direction: 'left', durationMs: 900 }, // 'left' | 'right' | 'down'
  brand: { name: 'Genres', iconSrc: 'assets/brand-icon.png' }, // REPLACE ASSET: small icon beside the header wordmark
  // ONE rule for "which album is active". Theme, artwork, GIF and music all follow it.
  focus: {
    centerRatio: 0.5,           // 0.5 = middle of the screen
    activationRangeRatio: 0.35, // a card can become active when its edge is within this share of the screen height from the center line
    hysteresisPx: 80            // the current album stays unless a rival is at least this much closer
  },
  marquee: { minFontPx: 14, maxFontPx: 22, fontToWidth: 0.045, pixelsPerSecond: 60 }, // text size follows marquee width, speed is constant
  cassettePhysics: { drag: true, followCursor: true, floatPx: 6, followPx: 14, stiffness: 0.08, damping: 0.86, limitRatio: 0.25 },
  // Cassette images (REPLACE ASSET). ratio = image width / height, so reels line up exactly.
  // reels.src = a transparent PNG of ONE reel. Leave '' if the image has no separate reel layer: the overlay then stays OFF.
  // leftX / rightX / y = reel centers and size = reel width, all as fractions (0 to 1) of the image.
  images: {
    hero:   { src: 'assets/hero-cassette.gif', ratio: '3 / 2', reels: { src: '', leftX: 0.3, rightX: 0.7, y: 0.42, size: 0.2 } },
    player: { src: 'assets/mini-cassette.png', ratio: '3 / 2', reels: { src: '', leftX: 0.3, rightX: 0.7, y: 0.42, size: 0.2 } }
  },
  reels: { degreesPerPx: 0.35 },                       // how far the reels turn per scrolled pixel
  cassetteShadow: { opacity: 0.35, blurCqw: 1.2, widthCqw: 30, heightCqw: 4.5, offsetCqw: 13.5, liftFade: 0.5 }, // cqw = 1% of hero width
  visualizer: { bars: 8, intensity: 1.4, updateHz: 30 },
  orderFormUrl: 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform?embedded=true' // EDIT HERE
};

// ===== 2. PRODUCTS (EDIT HERE: one object = one album card) =====
// Theme keys (all optional, missing ones fall back to the default theme in styles.css):
// bg, text, accent, accent2 = page colors while this album is active; surface, surfaceText = card colors
const PRODUCTS = [
  {
    id: 'album-one',
    title: 'ALBUM ONE',                              // placeholder
    artist: 'Artist Name',
    description: 'Lorem ipsum dolor sit amet, placeholder description.',
    image: 'assets/albums/album-one.jpg',            // REPLACE ASSET: artwork for the background
    animation: 'assets/albums/album-one-cassette.gif', // REPLACE ASSET: cassette animation
    squareBackground: '#2a2a3a',                     // color/gradient behind the animation
    font: "'Rubik Mono One', Impact, sans-serif",    // product font + fallbacks
    theme: { bg: '#14141c', text: '#f2efe9', accent: '#c9a24a', accent2: '#6b7a99', surface: '#f2efe9', surfaceText: '#14141c' },
    artOpacity: 0.35, artTint: '#14141c',
    songs: ['Blank 1', 'Blank 2', 'Blank 3'],        // add or remove titles freely
    featuredAudio: 'assets/audio/album-one.mp3',     // REPLACE ASSET ('' = silence for this album)
    foregroundGif: 'assets/fg/album-one.gif'         // optional; '' = no overlay
  },
  {
    id: 'album-two',
    title: 'Album Two',
    artist: 'Artist Name',
    description: 'Lorem ipsum dolor sit amet, placeholder description.',
    image: 'assets/albums/album-two.jpg',
    animation: 'assets/albums/album-two-cassette.gif',
    squareBackground: '#f3d9c4',
    font: "'Playfair Display', Georgia, serif",
    theme: { bg: '#f7e7d6', text: '#3b2a20', accent: '#b5533c', accent2: '#7d8f69', surface: '#fffaf3', surfaceText: '#3b2a20' },
    artOpacity: 0.25, artTint: '#f7e7d6',
    songs: ['Blank 1', 'Blank 2', 'Blank 3'],
    featuredAudio: 'assets/audio/album-two.mp3',
    foregroundGif: ''
  }
];

// Products inherit these defaults for anything they do not define. theme {} = use the default theme.
const PRODUCT_DEFAULTS = {
  font: "'Inter', system-ui, sans-serif", squareBackground: '#ddd', theme: {}, image: '', animation: '',
  artRatio: '3 / 2', reels: { src: '', leftX: 0.3, rightX: 0.7, y: 0.42, size: 0.2 }, // see CONFIG.images
  artOpacity: 0.3, artTint: 'transparent', songs: [], featuredAudio: '', foregroundGif: ''
};
PRODUCTS.forEach((p, i) => { PRODUCTS[i] = { ...PRODUCT_DEFAULTS, ...p, theme: { ...PRODUCT_DEFAULTS.theme, ...p.theme } }; });

// Home page members (EDIT HERE). Cards alternate left/right automatically.
const MEMBERS = [
  { name: 'Member One', role: 'Role', description: 'Lorem ipsum, short placeholder description.', portrait: 'assets/members/member-one.jpg' },
  { name: 'Member Two', role: 'Role', description: '', portrait: 'assets/members/member-two.jpg' },
  { name: 'Member Three', role: 'Role', description: 'Lorem ipsum, short placeholder description.', portrait: 'assets/members/member-three.jpg' }
];

// ===== 3. HELPERS =====
const $ = (selector) => document.querySelector(selector);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function storageGet(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
function storageSet(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* storage blocked: ignore */ } }

// Smoothly move an audio element's volume to a target. A new fade cancels the old one on the same element.
function fadeTo(audio, target, ms, onDone) {
  const from = audio.volume, startTime = performance.now(), token = {};
  audio._fade = token;
  function step(now) {
    if (audio._fade !== token) return;
    const t = ms > 0 ? Math.min(1, (now - startTime) / ms) : 1;
    audio.volume = from + (target - from) * t;
    if (t < 1) requestAnimationFrame(step); else if (onDone) onDone();
  }
  step(startTime);
}

// Builds the cassette picture used by products, the hero and the mini player.
// The CSS placeholder is removed automatically once the real image loads.
function artFrameHtml(src, alt, ratio, reels) {
  const reelHtml = CONFIG.features.reels && reels && reels.src
    ? [reels.leftX, reels.rightX].map((x) => `<span class="reel" style="left:${x * 100}%;top:${reels.y * 100}%;width:${reels.size * 100}%;background-image:url('${reels.src}')"></span>`).join('')
    : '';
  const image = src ? `<img src="${src}" alt="${alt}" loading="lazy" draggable="false" onload="this.previousElementSibling.remove()" onerror="this.remove()">` : '';
  return `<div class="art-frame" style="--art-ratio:${ratio || '3 / 2'}"><div class="cassette"><span class="placeholder-label">PLACEHOLDER</span></div>${image}${reelHtml}</div>`;
}

// ===== 4. MUSIC + SOUND EFFECTS =====
// Music is the ONLY thing that plays background tracks. Everything else just calls Music.request(src).
const Music = {
  current: null,     // the track that should be audible now
  all: [],           // every track still fading out/in (so we can never leave strays playing)
  wantedSrc: '',     // what SHOULD be playing; remembered even while the user has paused
  userPaused: false, // true after the visitor presses pause
  blocked: false,    // true if the browser refused autoplay (waiting for a click)

  request(src) {                       // call this whenever the "right" track changes
    this.wantedSrc = src || '';
    if (!this.userPaused) this.crossfadeTo(this.wantedSrc);
  },
  crossfadeTo(src) {
    if (!CONFIG.features.music) return;
    if (this.current && this.current.dataset.src === src) return; // already on this track
    this.all.slice().forEach((a) => this.fadeOutAndStop(a));       // fade out everything old
    this.current = null;
    if (!src) { this.report(); return; }
    const next = new Audio(src);
    next.loop = true; next.volume = 0; next.dataset.src = src;
    this.current = next; this.all.push(next);
    next.play()
      .then(() => { fadeTo(next, CONFIG.audio.volume, CONFIG.audio.crossfadeMs); this.report(); Visualizer.attach(next); })
      .catch((err) => {                // missing file or autoplay blocked: never throw
        this.drop(next);
        if (err && err.name === 'NotAllowedError') this.blocked = true;
        this.report();
      });
  },
  fadeOutAndStop(audio) {
    fadeTo(audio, 0, CONFIG.audio.crossfadeMs, () => this.drop(audio, true));
  },
  drop(audio, pause) {
    Visualizer.detach(audio);
    if (pause) audio.pause();
    this.all = this.all.filter((a) => a !== audio);
    if (this.current === audio) this.current = null;
  },
  pause() {                            // global pause: stops ALL music
    this.userPaused = true;
    this.all.slice().forEach((a) => this.fadeOutAndStop(a));
    this.current = null;
    this.report();
  },
  resume() {                           // resumes whatever track is wanted RIGHT NOW
    this.userPaused = false;
    this.crossfadeTo(this.wantedSrc);
  },
  report() {                           // update the mini-player buttons
    const playing = !!this.current && !this.current.paused;
    document.body.classList.toggle('is-playing', playing);
    $('#btn-play').setAttribute('aria-pressed', String(playing));
    $('#btn-pause').setAttribute('aria-pressed', String(!playing));
  }
};

// Sound effects use one shared element, so two effects can never overlap.
const Sfx = {
  element: null,
  play(src) {
    if (!CONFIG.features.sfx || !src) return;
    if (!this.element) this.element = new Audio();
    if (!this.element.paused) return;
    this.element.src = src;
    this.element.volume = CONFIG.audio.sfxVolume;
    this.element.play().catch(() => { /* missing file or blocked: ignore */ });
  }
};

// ===== 5. THEME + FOREGROUND GIF =====
const THEME_VARS = { bg: '--bg', text: '--text', accent: '--accent', accent2: '--accent-2' };

// Sets album colors, or removes them (theme = null) so the default theme returns.
function applyTheme(theme) {
  Object.entries(THEME_VARS).forEach(([key, cssVar]) => {
    if (theme && theme[key]) document.body.style.setProperty(cssVar, theme[key]);
    else document.body.style.removeProperty(cssVar);
  });
}

function setBackgroundArt(product) {
  const art = $('#bg-art');
  if (product && product.image) {
    art.style.backgroundImage = `url("${product.image}")`;
    art.style.backgroundColor = product.artTint || 'transparent';
    art.style.opacity = product.artOpacity ?? 0.3;
  } else {
    art.style.opacity = 0;
  }
}

// Wipe reveal (not a fade). Each entry is the fully hidden clip-path for that direction.
const WIPE_HIDDEN = { left: 'inset(0 100% 0 0)', right: 'inset(0 0 0 100%)', down: 'inset(0 0 100% 0)' };
function showForeground(src) {
  const el = $('#foreground-gif');
  const hidden = WIPE_HIDDEN[CONFIG.gifWipe.direction] || WIPE_HIDDEN.left;
  const ms = reduceMotion ? 0 : CONFIG.gifWipe.durationMs;
  if (!src) {                                   // no GIF: wipe the old one away
    el.style.transition = `clip-path ${ms}ms ease`;
    el.style.clipPath = hidden;
    return;
  }
  el.style.transition = 'none';                 // cut the old one instantly, then wipe the new one in
  el.style.clipPath = hidden;
  el.style.backgroundImage = `url("${src}")`;
  void el.offsetWidth;                          // forces the browser to apply the reset above
  el.style.transition = `clip-path ${ms}ms ease`;
  el.style.clipPath = 'inset(0)';
}

// The one place that reacts to "a different album is now active".
let activeId = null;
function setActiveProduct(product) {
  const id = product ? product.id : null;
  if (id === activeId) return;                  // same album: do nothing (no restarts)
  activeId = id;
  document.querySelectorAll('.product').forEach((el) => el.classList.toggle('is-active', el.dataset.id === id));
  if (CONFIG.features.albumThemes) { applyTheme(product && product.theme); setBackgroundArt(product); }
  if (CONFIG.features.foregroundGifs) showForeground(product && product.foregroundGif);
  if (product) {
    Music.request(product.featuredAudio);
    Sfx.play(CONFIG.audio.scratchSrc);
  }
}

// ===== 6. PRODUCTS, MARQUEES, ACTIVE-ALBUM SELECTION, MEMBERS =====
function renderProducts() {
  const list = $('#product-list');
  PRODUCTS.forEach((p, index) => {
    const songs = p.songs.length ? p.songs : [p.title];            // never an empty marquee
    const article = document.createElement('article');
    article.className = 'product' + (index % 2 ? ' reverse' : ''); // odd cards flip sides
    article.dataset.id = p.id;
    article.style.setProperty('--product-font', p.font);
    article.style.setProperty('--square-bg', p.squareBackground);
    if (p.theme.surface) article.style.setProperty('--surface', p.theme.surface);
    if (p.theme.surfaceText) article.style.setProperty('--surface-text', p.theme.surfaceText);
    article.innerHTML = `
      <div class="product-visual">
        <div class="product-art">${artFrameHtml(p.animation, p.title + ' cassette', p.artRatio, p.reels)}</div>
      </div>
      <div class="product-info">
        <p class="product-artist">${p.artist}</p>
        <h2 class="product-title">${p.title}</h2>
        <p>${p.description}</p>
        <div class="marquee" role="group" tabindex="0" aria-label="Songs: ${songs.join(', ')}"><ul class="marquee-track"></ul></div>
      </div>`;
    list.appendChild(article);
    Marquee.setup(article.querySelector('.marquee'), songs);
  });
}

// Marquee: sized from ITS OWN width (not the screen). A ResizeObserver re-runs layout() whenever that width changes.
const Marquee = {
  setup(marqueeEl, songs) {
    marqueeEl._songs = songs;
    new ResizeObserver(() => this.layout(marqueeEl)).observe(marqueeEl);
  },
  layout(marqueeEl) {
    const cfg = CONFIG.marquee, width = marqueeEl.clientWidth;
    if (!width || marqueeEl._lastWidth === width) return;       // hidden page, or nothing changed
    marqueeEl._lastWidth = width;
    const track = marqueeEl.querySelector('.marquee-track');
    const items = (hidden) => marqueeEl._songs.map((s) => `<li${hidden ? ' aria-hidden="true"' : ''}>${s}</li>`).join('');
    marqueeEl.style.fontSize = Math.min(cfg.maxFontPx, Math.max(cfg.minFontPx, width * cfg.fontToWidth)) + 'px';
    track.innerHTML = items(false);                             // 1) measure one copy of the titles
    const oneCopy = track.offsetWidth || 1;
    const copies = Math.max(1, Math.ceil(width / oneCopy));     // 2) repeat until one half fills the viewport
    const half = oneCopy * copies;
    track.innerHTML = items(false).repeat(copies) + items(true).repeat(copies); // 3) two equal halves = seamless loop
    track.style.setProperty('--marquee-seconds', (half / cfg.pixelsPerSecond).toFixed(1) + 's'); // constant speed
  }
};

// The ONLY place that decides which album is active. It calls setActiveProduct(), which drives every effect.
const FocusTracker = {
  visible: new Set(),                                           // cards currently on screen
  start() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? this.visible.add(e.target) : this.visible.delete(e.target)));
      this.select();
    });
    document.querySelectorAll('.product').forEach((card) => observer.observe(card));
    const recheck = () => this.select();
    new ResizeObserver(recheck).observe($('#product-list'));    // card heights changed (wrapping, images, fonts)
    window.addEventListener('resize', recheck);
    window.addEventListener('orientationchange', recheck);
    if (document.fonts) document.fonts.ready.then(recheck);
  },
  distanceToCenter(card, centerY) {                             // 0 if the card covers the center line
    const box = card.getBoundingClientRect();
    if (box.top <= centerY && box.bottom >= centerY) return 0;
    return box.top > centerY ? box.top - centerY : centerY - box.bottom;
  },
  select() {
    if (document.body.dataset.page !== 'products') return;
    const f = CONFIG.focus, centerY = window.innerHeight * f.centerRatio, reach = window.innerHeight * f.activationRangeRatio;
    let best = null, bestDistance = Infinity, currentDistance = Infinity;
    this.visible.forEach((card) => {
      const d = this.distanceToCenter(card, centerY);
      if (card.dataset.id === activeId) currentDistance = d;
      if (d <= reach && d < bestDistance) { best = card; bestDistance = d; }
    });
    if (best) {
      // Hysteresis: keep the current album unless the rival is clearly closer.
      const keepCurrent = currentDistance <= reach && bestDistance + f.hysteresisPx >= currentDistance;
      if (!keepCurrent) setActiveProduct(PRODUCTS.find((p) => p.id === best.dataset.id));
      return;
    }
    // Nobody in range. Above the first card = default theme. Between cards or below the last = keep the current album.
    const first = document.querySelector('.product');
    if (first && first.getBoundingClientRect().top > centerY + reach) setActiveProduct(null);
  }
};

function renderMembers() {
  MEMBERS.forEach((m, i) => {
    const card = document.createElement('article');
    card.className = 'member' + (i % 2 ? ' reverse' : '');
    card.innerHTML = `
      <div class="member-bubble"><span aria-hidden="true">${m.name.charAt(0)}</span>
        <img src="${m.portrait}" alt="Portrait of ${m.name}" loading="lazy" onerror="this.remove()"></div>
      <div class="member-text"><h3>${m.name}</h3><p class="member-role">${m.role}</p>${m.description ? `<p>${m.description}</p>` : ''}</div>`;
    $('#member-list').appendChild(card);
  });
}

// Home cassette: gentle float, pointer tilt, drag, and an elliptical shadow. Springs always pull it back home.
const CassettePhysics = {
  start() {
    this.el = $('.cassette-wrap'); this.title = $('.hero-title'); this.stage = $('.hero-stage'); this.shadow = $('.cassette-shadow');
    if (!this.el) return;
    const s = CONFIG.cassetteShadow, set = (name, value) => this.stage.style.setProperty(name, value);
    set('--shadow-w', s.widthCqw + 'cqw'); set('--shadow-h', s.heightCqw + 'cqw'); set('--shadow-y', s.offsetCqw + 'cqw');
    set('--shadow-blur', s.blurCqw + 'cqw'); set('--shadow-opacity', s.opacity);
    if (!CONFIG.features.cassettePhysics || reduceMotion) return;               // disabled: cassette just sits still
    const cfg = CONFIG.cassettePhysics;
    this.pos = { x: 0, y: 0 }; this.vel = { x: 0, y: 0 }; this.cursor = { x: 0, y: 0 }; this.limit = { x: 0, y: 0 };
    this.dragging = false; this.visible = true; this.running = false;
    new ResizeObserver(() => {                                                  // limits follow the stage size
      this.limit = { x: this.stage.clientWidth * cfg.limitRatio, y: this.stage.clientHeight * cfg.limitRatio };
    }).observe(this.stage);
    new IntersectionObserver(([entry]) => { this.visible = entry.isIntersecting; this.wake(); }).observe(this.stage);
    document.addEventListener('visibilitychange', () => this.wake());
    if (cfg.followCursor && window.matchMedia('(pointer: fine)').matches) {
      window.addEventListener('pointermove', (e) => {
        this.cursor = { x: (e.clientX / window.innerWidth - 0.5) * 2 * cfg.followPx, y: (e.clientY / window.innerHeight - 0.5) * 2 * cfg.followPx };
      }, { passive: true });
    }
    if (cfg.drag) this.enableDrag(); else this.el.style.pointerEvents = 'none';
    this.wake();
  },
  enableDrag() {
    let grab = { x: 0, y: 0 };
    this.el.classList.add('is-draggable');
    this.el.addEventListener('dragstart', (e) => e.preventDefault());           // native image dragging would cancel our pointer events
    this.el.addEventListener('pointerdown', (e) => {
      if (this.dragging || (e.pointerType === 'mouse' && e.button !== 0)) return; // left button / one finger only
      this.dragging = true; this.el.setPointerCapture(e.pointerId);
      grab = { x: e.clientX - this.pos.x, y: e.clientY - this.pos.y };
    });
    this.el.addEventListener('pointermove', (e) => {
      if (!this.dragging) return;
      const x = this.clamp(e.clientX - grab.x, this.limit.x), y = this.clamp(e.clientY - grab.y, this.limit.y);
      this.vel = { x: x - this.pos.x, y: y - this.pos.y };                     // remember speed for momentum
      this.pos = { x, y };
    });
    const release = () => { this.dragging = false; };                           // the spring takes over
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((type) => this.el.addEventListener(type, release));
  },
  clamp(value, limit) { return Math.max(-limit, Math.min(limit, value)); },
  wake() {                                                                       // start the loop only when it is needed
    if (this.running || !this.visible || document.hidden) return;
    this.running = true; requestAnimationFrame((t) => this.tick(t));
  },
  tick(now) {
    if (!this.visible || document.hidden) { this.running = false; return; }     // pause off-screen
    const c = CONFIG.cassettePhysics, s = CONFIG.cassetteShadow;
    if (!this.dragging) {
      const targetX = this.cursor.x, targetY = this.cursor.y + Math.sin(now / 1200) * c.floatPx;
      this.vel.x = (this.vel.x + (targetX - this.pos.x) * c.stiffness) * c.damping;   // spring + damping
      this.vel.y = (this.vel.y + (targetY - this.pos.y) * c.stiffness) * c.damping;
      this.pos.x = this.clamp(this.pos.x + this.vel.x, this.limit.x);
      this.pos.y = this.clamp(this.pos.y + this.vel.y, this.limit.y);
    }
    const tilt = this.clamp(this.vel.x * 1.5 + this.pos.x * 0.02, 12);
    this.el.style.transform = `translate3d(${this.pos.x}px, ${this.pos.y}px, 0) rotate(${tilt}deg)`;
    this.title.style.transform = `translate3d(${-this.pos.x * 0.15}px, 0, 0)`;  // wordmark drifts the other way = depth
    // Shadow: when the cassette is lifted (up or being dragged) it gets lighter and slightly wider; settled = crisp.
    const lift = this.dragging ? 0.6 : Math.max(0, -this.pos.y / (this.limit.y || 1));
    this.shadow.style.opacity = s.opacity * (1 - s.liftFade * lift);
    this.shadow.style.transform = `translate3d(${this.pos.x * 0.8}px, var(--shadow-y), 0) scale(${1 + 0.25 * lift})`;
    requestAnimationFrame((t) => this.tick(t));
  }
};

// Reels turn with SCROLL, not with the music: down = forward, up = backward, always continuous.
let lastScrollY = 0, reelAngle = 0, reelEls = null;
function spinReels(y) {
  const delta = y - lastScrollY; lastScrollY = y;
  if (!CONFIG.features.reels || reduceMotion || delta === 0) return;
  reelEls = reelEls || document.querySelectorAll('.cassette, .reel');          // looked up once, then reused
  reelAngle += delta * CONFIG.reels.degreesPerPx;
  reelEls.forEach((el) => el.style.setProperty('--reel-angle', reelAngle + 'deg'));
}

// Audio visualizer: reads the REAL music through a Web Audio analyser. Inactive when nothing is playing.
const Visualizer = {
  enabled: false, ctx: null, analyser: null, data: null, bars: [], running: false, lastDraw: 0,
  start() {
    // Over file:// the browser would mute audio routed through Web Audio, so only run on http(s).
    if (!CONFIG.features.visualizer || reduceMotion || !/^https?:$/.test(location.protocol)) return;
    const box = $('#visualizer');
    for (let i = 0; i < CONFIG.visualizer.bars; i++) this.bars.push(box.appendChild(document.createElement('span')));
    this.enabled = true;
  },
  async attach(audio) {                         // called by Music once a track is really playing
    if (!this.enabled) return;
    try {
      if (new URL(audio.src, location.href).origin !== location.origin) return; // cross-origin audio would go silent
      if (!this.ctx) {
        this.ctx = new AudioContext();
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 64; this.analyser.smoothingTimeConstant = 0.8;
        this.analyser.connect(this.ctx.destination);
        this.data = new Uint8Array(this.analyser.frequencyBinCount);
      }
      await this.ctx.resume();
      if (this.ctx.state !== 'running' || audio.paused || Music.current !== audio) return; // otherwise leave normal playback alone
      audio._vizSource = this.ctx.createMediaElementSource(audio);
      audio._vizSource.connect(this.analyser);
      this.loop();
    } catch (err) { /* the visualizer is optional: ignore any failure */ }
  },
  detach(audio) { if (audio._vizSource) { audio._vizSource.disconnect(); audio._vizSource = null; } },
  loop() {
    if (this.running) return;
    this.running = true;
    const frameMs = 1000 / CONFIG.visualizer.updateHz, perBar = Math.floor(this.data.length / this.bars.length) || 1;
    const draw = (now) => {
      if (!Music.all.some((a) => a._vizSource)) {                       // nothing playing: flatten and stop
        this.running = false; this.bars.forEach((b) => { b.style.transform = 'scaleY(.08)'; }); return;
      }
      if (now - this.lastDraw >= frameMs) {
        this.lastDraw = now; this.analyser.getByteFrequencyData(this.data);
        this.bars.forEach((bar, i) => {
          let sum = 0; for (let k = 0; k < perBar; k++) sum += this.data[i * perBar + k];
          const level = Math.min(1, (sum / perBar / 255) * CONFIG.visualizer.intensity);
          bar.style.transform = `scaleY(${0.08 + level * 0.92})`;
        });
      }
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  }
};

// Custom cursor: a small play icon that follows the mouse. If anything fails, the native cursor stays.
const CustomCursor = {
  start() {
    if (!CONFIG.features.customCursor || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return; // touch keeps the native cursor
    try {
      const el = document.createElement('div');
      el.id = 'custom-cursor'; el.setAttribute('aria-hidden', 'true');
      el.innerHTML = '<svg viewBox="0 0 24 24"><path class="c-play" d="M5 3l15 9-15 9z"/><g class="c-pause"><rect x="5" y="4" width="5" height="16"/><rect x="14" y="4" width="5" height="16"/></g><circle class="c-link" cx="12" cy="12" r="7"/></svg>';
      document.body.appendChild(el);
      let x = 0, y = 0, queued = false;
      window.addEventListener('pointermove', (e) => {
        if (e.pointerType === 'touch') return;
        x = e.clientX; y = e.clientY;
        if (!el.classList.contains('is-visible')) {                      // first real mouse move: now hide the native cursor
          el.classList.add('is-visible'); document.documentElement.classList.add('custom-cursor-on');
        }
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => { el.style.transform = `translate3d(${x}px, ${y}px, 0)`; queued = false; });
      }, { passive: true });
      document.addEventListener('pointerover', (e) => {                  // pick the icon for what is under the pointer
        el.dataset.variant = e.target.closest('#btn-pause') ? 'pause'
          : e.target.closest('a, button, [tabindex="0"], .is-draggable') ? 'link' : 'play';
      });
      document.documentElement.addEventListener('pointerleave', () => el.classList.remove('is-visible'));
      document.documentElement.addEventListener('pointerenter', () => { if (document.documentElement.classList.contains('custom-cursor-on')) el.classList.add('is-visible'); });
    } catch (err) {
      document.documentElement.classList.remove('custom-cursor-on');     // fall back to the native cursor
    }
  }
};

// ===== 7. PAGES (Home / Product Lists / Order) =====
const PAGES = ['home', 'products', 'order'];
let siteReady = false; // becomes true once the intro is finished or skipped

function showPage(name) {
  if (!PAGES.includes(name)) name = 'home';
  PAGES.forEach((p) => { $('#page-' + p).hidden = p !== name; });
  document.querySelectorAll('[data-page]').forEach((link) => {
    if (link.dataset.page === name) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
  });
  document.body.dataset.page = name;
  lastScrollY = 0;                       // so the reels do not spin wildly on page change
  window.scrollTo(0, 0);
  if (name !== 'products') {
    setActiveProduct(null);                                   // restores the default theme
    if (siteReady) Music.request(CONFIG.audio.homeSrc);
  }
  updateScroll();
}
window.addEventListener('hashchange', () => showPage(location.hash.slice(1)));

// ===== 8. SCROLL (parallax, header, progress, notes) =====
let scrollQueued = false;
window.addEventListener('scroll', () => {
  if (scrollQueued) return;                    // at most one update per animation frame
  scrollQueued = true;
  requestAnimationFrame(() => { updateScroll(); scrollQueued = false; });
}, { passive: true });

function updateScroll() {
  const y = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const percent = maxScroll > 0 ? Math.round((y / maxScroll) * 100) : 0; // PAGE scroll, not song time
  $('#progress-fill').style.width = percent + '%';
  $('#progress-text').textContent = percent + '%';
  $('.mini-progress').setAttribute('aria-valuenow', percent);
  $('#site-header').classList.toggle('is-solid', y > 40);
  if (document.body.dataset.page === 'products') FocusTracker.select(); // same rAF-throttled handler, no extra listeners
  spinReels(y);
  if (CONFIG.features.backgroundMotion && !reduceMotion && document.body.dataset.page === 'home') {
    document.querySelectorAll('.layer').forEach((layer) => {
      layer.style.transform = `translate3d(0, ${y * layer.dataset.speed}px, 0)`; // each layer moves at its own speed
    });
  }
  if (notes.length && !reduceMotion && document.body.dataset.page === 'products') {
    notes.forEach((note, i) => {
      const depth = 0.6 + (i % 3) * 0.4;                    // far notes move slower and bounce less
      note.style.transform = `translateY(${Math.sin(y * 0.006 * depth + i * 1.7) * 30 * depth}px) rotate(${Math.sin(y * 0.004 * depth + i) * 15}deg)`;
    });
    staff.style.transform = `translateY(${-(y * 0.2) % 12}px)`;
  }
}

// OPTIONAL FEATURE: scroll-reactive notes. Built once; they only move when the page scrolls.
let notes = [], staff = null;
function setupNotes() {
  if (!CONFIG.features.musicalNotes) return;   // kill switch: nothing is created
  const layer = document.createElement('div');
  layer.className = 'notes-layer'; layer.setAttribute('aria-hidden', 'true');
  staff = document.createElement('div'); staff.className = 'staff';
  layer.appendChild(staff);
  ['♪', '♫', '♩', '♬'].forEach((symbol, group) => {
    for (let i = 0; i < 3; i++) {
      const note = document.createElement('span');
      note.className = 'note'; note.textContent = symbol;
      note.style.left = ((group * 3 + i) * 8.3 + 3) % 95 + '%';
      note.style.top = ((group * 37 + i * 29) % 85) + 5 + '%';
      layer.appendChild(note); notes.push(note);
    }
  });
  document.body.prepend(layer);
}

// ===== 9. INTRO SEQUENCE =====
function runIntro(onFinish) {
  const cfg = CONFIG.intro;
  if (!CONFIG.features.intro || (!cfg.showEveryVisit && storageGet(cfg.storageKey))) { onFinish(); return; }
  const intro = $('#intro'), video = $('#intro-video');
  const timers = []; let finished = false;
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const show = (sel) => $(sel).classList.add('is-visible');
  const hide = (sel) => $(sel).classList.remove('is-visible');

  function finish() {                          // safe to call many times
    if (finished) return;
    finished = true;
    timers.forEach(clearTimeout);
    video.pause();
    intro.hidden = true;
    storageSet(cfg.storageKey, '1');
    onFinish();
  }
  function startAnimation() {
    if (!cfg.videoSrc) { finish(); return; }
    Music.request(cfg.musicSrc);               // '' simply means no intro music
    video.addEventListener('ended', finish);
    video.addEventListener('error', finish);   // missing video: skip ahead
    video.src = cfg.videoSrc;
    video.classList.add('is-visible');
    video.play().catch(finish);
  }

  intro.hidden = false;
  const t1 = 400, t2 = t1 + cfg.noticeMs + 600, t3 = t2 + cfg.logoMs + 600;
  later(() => show('#intro-notice'), t1);  later(() => hide('#intro-notice'), t1 + cfg.noticeMs);
  later(() => show('#intro-logo'), t2);    later(() => hide('#intro-logo'), t2 + cfg.logoMs);
  later(startAnimation, t3);
  later(finish, t3 + cfg.maxDurationMs);       // safety net: never wait forever
  $('#intro-skip').addEventListener('click', finish);
}

// ===== 10. START =====
function start() {
  // Feature switches that are pure CSS hooks
  if (CONFIG.features.productHover) document.body.classList.add('hover-on');
  if (!CONFIG.features.music) $('.mini-controls').hidden = true;

  document.title = CONFIG.brand.name;                                       // brand name lives in CONFIG.brand
  document.querySelectorAll('[data-brand]').forEach((el) => { el.textContent = CONFIG.brand.name; });
  $('#brand-icon').src = CONFIG.brand.iconSrc;
  $('#order-form').src = CONFIG.orderFormUrl;
  $('#order-form-link').href = CONFIG.orderFormUrl.replace('?embedded=true', '');

  renderProducts();
  const root = document.documentElement.style;            // intro icon settings
  root.setProperty('--intro-icon-size', CONFIG.intro.iconSize);
  root.setProperty('--intro-gap', CONFIG.intro.iconGap);
  const hero = CONFIG.images.hero, player = CONFIG.images.player;
  $('.cassette-wrap').innerHTML = artFrameHtml(hero.src, 'Animated cassette player', hero.ratio, hero.reels);
  $('#mini-art').innerHTML = artFrameHtml(player.src, '', player.ratio, player.reels);
  FocusTracker.start();
  renderMembers();
  CassettePhysics.start();
  Visualizer.start();
  CustomCursor.start();
  setupNotes();

  $('#btn-play').addEventListener('click', () => Music.resume());
  $('#btn-pause').addEventListener('click', () => Music.pause());
  document.addEventListener('click', (e) => { if (e.target.closest('a, button')) Sfx.play(CONFIG.audio.clickSrc); });

  // If the browser blocked autoplay, the first click/keypress retries the wanted track.
  ['pointerdown', 'keydown'].forEach((type) => window.addEventListener(type, () => {
    if (Music.blocked && !Music.userPaused) { Music.blocked = false; Music.crossfadeTo(Music.wantedSrc); }
  }, { passive: true }));

  runIntro(() => { siteReady = true; showPage(location.hash.slice(1)); });
}
start();
