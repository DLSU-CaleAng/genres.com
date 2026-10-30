/* Ah, Salaam and good evening to you, worthy friend. Please, please, come closer... Too close!
A little too close. There. Welcome to my code. 
City of mystery, of enchantment, and the finest merchandise this side of the internet, on sale today! Come on down */

// ######################## my beautiful config ###########################
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
    visualizer: false,       // audio-reactive bars (needs http://, see README)
    customCursor: true,      // cassette-style cursor (desktop mouse only)
    touchTrail: true
  },
  intro: {
    // Assets
    videoSrc: 'assets/download.mp4',         // intro animation ('' = skip the animation)
    musicSrc: 'assets/starting-music.mp3',   // intro music ('' = no intro music)
    videoFit: 'contain',                     // 'contain' = whole animation visible, 'cover' = fills the screen and crops
    // Headphones notice
    iconSize: 'clamp(64px, 12vw, 88px)',     // icon size (any CSS length)
    iconGap: '1rem',                         // space between icon and text
    // Timing (milliseconds)
    noticeMs: 2000,                          // how long "Headphones recommended" shows
    logoMs: 1800,                            // how long the logo shows
    maxDurationMs: 8000,                     // safety timeout: the animation step always ends by then
    fadeOutMs: 1800,                         // fade-out that reveals the site (0 = instant cut)
    // First-visit memory
    showEveryVisit: false,                   // true = ignore the "already seen" memory (handy while testing)
    storageKey: 'genres-intro-seen'          // localStorage key; delete it to see the intro again
  },
  audio: {
    scratchVolume: 0.4,
    releaseSrc: 'assets/cassette-release.mp3',
    releaseVolume: 1.6,
    homeSrc: 'assets/what-i-like.mp3',       // home + order page music
    volume: 0.7,
    crossfadeMs: 1500,                       // length of every music crossfade
    preloadAlbums: true,                     // start downloading album tracks when the product page first opens
    sfxVolume: 0.6,
    clickSrc: 'assets/click.mp3',            // ('' = no click sound)
    scratchSrc: 'assets/scratch.mp3',         // plays when the active album changes
    clickVolume: 1,
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
  // Cassette images [################]
  // reels.src = a transparent PNG of ONE reel.
  // leftX / rightX / y = reel centers and size = reel width, all as fractions (0 to 1) of the image.
  images: {
    hero:   { src: 'assets/cassette-draggable.png', ratio: '3 / 2', reels: { src: '', leftX: 0.3, rightX: 0.7, y: 0.42, size: 0.2 } },
    player: { src: 'assets/mini-cassette.png', ratio: '3 / 2', reels: { src: '', leftX: 0.3, rightX: 0.7, y: 0.42, size: 0.2 } }
  },
  reels: { degreesPerPx: 0.35 },                       // how far the reels turn per scrolled pixel
  cassetteShadow: { opacity: 0.35, blurCqw: 1.2, widthCqw: 30, heightCqw: 4.5, offsetCqw: 13.5, liftFade: 0.5 }, // cqw = 1% of hero width
  visualizer: { bars: 8, intensity: 1.4, updateHz: 30 }, //no need, glorified decoration
  // Debug helpers. Set enabled to false before launch, or visitors can replay the intro too.
  // replayIntroKey is compared as typed, so 'I' means Shift+I.
  debug: { enabled: true, replayIntroKey: 'I' },
  currency: '₱',
  keychainSize: { widthCm: 3.4, heightCm: 5.2 },
  orderFormUrl: 'https://forms.gle/fo1NWeFeumJz2D8x5' // EDIT HERE / PLACEHOLDAH
};

// ############################# PRODUCTS ######################################################3
// Theme keys (all optional, missing ones fall back to the default theme in styles.css):
// bg, text, accent, accent2 = page colors while this album is active; surface, surfaceText = card colors
const PRODUCTS = [
  {
    id: 'album-one',
    title: 'Bewitched',
    artist: 'Laufey',
    description: 'Laufey’s Bewitched is a gorgeous blend of jazz and bedroom pop that captures exactly what it feels like to fall in love. She made the album to prove that orchestral music isnt just for history books, but is the perfect backdrop for the messy feelings of navigating your twenties. Between the sweeping strings and her warm vocals, it feels like an intimate late-night conversation, breathing fresh life into an old-school sound for a whole new generation.',
    image: 'assets/albums/bewitched.webp',                // artwork for the fixed background
    animation: 'assets/albums/bewitched.png',    // cassette image or animation
    squareBackground: '#8b4e22',                          // color/gradient behind the cassette
    font: "'Playfair Display', Georgia, serif",         // product font + fallbacks
    theme: { bg: '#f7e7d6', text: '#3b2a20', accent: '#b5533c', accent2: '#7d8f69', surface: '#fffaf3', surfaceText: '#3b2a20' },
    artOpacity: 0.25, artTint: '#f7e7d6',
    songs: ['Dreamer', 'Second Best', 'Haunted', 'Must Be Love', 'While You Were Sleeping', 'Lovesick', 'California and Me', 'Nocturne (Interlude)', 'Promise', 'From The Start', 'Misty', 'Serendipity', 'Letter To My 13 Year Old Self', 'Bewitched'],             // add or remove titles freely
    featuredAudio: 'assets/audio/thestart.mp3',           // '' = silence for this album
    foregroundGif: 'assets/fg/bewitched.png'              // optional but looks nice hehe; '' = no overlay
  },
  {
    id: 'album-two',
    title: 'This Is How Tomorrow Moves',
    artist: 'beabadoobee',
    description: '90’s and 2000s indie music, folk ballads, jazzy undertones, and dream pop, building on Beabadoobee’s earlier lo-fi bedroom pop roots. This album serves as an intimate journal on self-acceptance, growth, and navigating through early adulthood—a shift that earned Beabadoobee her very first number-one debut on the UK Albums Chart.',
    image: 'assets/albums/tomorrow.webp',
    animation: 'assets/albums/tomorrow.png',
    squareBackground: '#f1d8e3',
    font: "'Syne Mono', Impact, sans-serif",
    theme: { bg: '#f6e4c2', text: '#ca8e55', accent: '#f4d9bb', accent2: '#7d8f69', surface: '#3e3858', surfaceText: '#e2cfc4' },
    artOpacity: 0.25, artTint: '#d99cdf',
    songs: ["Take a Bite", "California", "One Time", "Real Man", "Tie My Shoes", "Girl Song", "Coming Home", "Ever Seen", "A Cruel Affair", "Post", "Beaches", "Everything I Want", "The Man Who Left Too Soon", "This Is How It Went"],
    featuredAudio: 'assets/audio/abite.mp3',
    foregroundGif: ''
  },
  {
    id: 'album-three',
    title: 'Who Cares?',
    artist: 'Rex Orange County',
    description: 'Indie pop, bedroom pop, alternative pop, and orchestral influences, blending upbeat melodies, playful production, and introspective songwriting. The album explores love, heartbreak, loneliness, and emotional uncertainty, balancing cheerful instrumentals with vulnerable reflections on relationships and self-worth. Through its contrast between bright, energetic arrangements and bittersweet lyrics, it captures the experience of navigating young adulthood and learning to move forward despite emotional setbacks.',
    image: 'assets/albums/album-three.jpg',
    animation: 'assets/albums/whocares.png',
    squareBackground: '#f2eded',
    font: "'Fraunces', Georgia, serif",
    theme: { bg: '#d3c6a2', text: '#193723', accent: '#e8d3e0', accent2: '#697b8f', surface: '#aeb7a6', surfaceText: '#193723' },
    artOpacity: 0.30, artTint: '#d3c6a2',
    songs: ["10/10", "Always", "Laser Lights", "Face to Face", "Stressed Out", "Never Had the Balls", "Pluto Projector", "Every Way", "It Gets Better", "It's Not the Same Anymore"],
    featuredAudio: 'assets/audio/shade.mp3',
    foregroundGif: ''
  },
    {
    id: 'album-four',
    title: 'NEVER ENOUGH',
    artist: 'Daniel Ceasar',
    description: 'Alternative R&B, neo-soul, gospel, and soul influences, blending lush harmonies, atmospheric production, and intimate vocals. The album explores love, longing, self-doubt, and emotional vulnerability, creating a reflective journey through complicated relationships and the desire for deeper connection, while balancing stripped-back ballads with rich, layered arrangements.',
    image: 'assets/albums/neverenough.jpg',
    animation: 'assets/albums/neverenough.png',
    squareBackground: '#200962',
    font: "'DM Serif Display', Georgia, serif",
    theme: { bg: '#040817', text: '#d2dff4', accent: '#164cf4', accent2: '#72bef8', surface: '#0c1a3a', surfaceText: '#a4bfe8' },
    artOpacity: 0.25, artTint: '#283256',
    songs: ["Ocho Rios", "Valentina", "Toronto 2014", "Let Me Go", "Do You Like Me?", "Always", "Cool", "Disillusioned", "Buyer's Remorse", "Shot My Baby", "Pain Is Inevitable", "Homiesexual", "Vince Van Gogh", "Superpowers", "Unstoppable"],
    featuredAudio: 'assets/audio/superpower.mp3',
    foregroundGif: 'assets/fg/superpowers.png'
  },
  {
    id: 'album-five',
    title: 'Customize your own!',
    artist: 'And most importantly..',
    description: 'Pick your favorite album and get it customized if you bought at least one of our keychain variants.',
    image: 'assets/albums/album-one.jpg',                // artwork for the fixed background
    animation: 'assets/albums/mystery.png',    // cassette image or animation
    squareBackground: '#000000',                          // color/gradient behind the cassette
    font: "'Archivo Black', Georgia, serif",         // product font + fallbacks
    theme: { bg: '#f4efe6', text: '#1b3a5c', accent: '#d94f30', accent2: '#1b3a5c', surface: '#f4efe6', surfaceText: '#303036' },
    artOpacity: 0.25, artTint: '#f4efe6',
    songs: ['you seem pretty sad for a girl so in love', 'The Life Of A Showgirl', 'I’m The Problem', 'Dandelion', 'The Great Divide', 'HABIBTI', 'The Art Of Loving', 'Stick Season', 'Palace For The People', 'ICEMAN'],             // add or remove titles freely
    featuredAudio: 'assets/what-i-like.mp3',           // '' = silence for this album
    foregroundGif: ''              // optional but looks nice hehe; '' = no overlay
  },
]; //femboy

// Products inherit these defaults for anything they do not define. theme {} = use the default theme.
const PRODUCT_DEFAULTS = {
  artScale: 1,
  price: 35,
  font: "'Inter', system-ui, sans-serif", squareBackground: '#ddd', theme: {}, image: '', animation: '',
  artRatio: '3 / 2', reels: { src: '', leftX: 0.3, rightX: 0.7, y: 0.42, size: 0.2 }, // see CONFIG.images
  artOpacity: 0.3, artTint: 'transparent', songs: [], featuredAudio: '', foregroundGif: ''
};
PRODUCTS.forEach((p, i) => { PRODUCTS[i] = { ...PRODUCT_DEFAULTS, ...p, theme: { ...PRODUCT_DEFAULTS.theme, ...p.theme } }; });

// Home page members. Cards alternate left/right automatically/dynamically. So very kakoi.
const MEMBERS = [
  { name: 'Cale Ang', role: 'Project Leader / Social Science Head / Software Developer / Co-Math Head / Animator / Web Designer', description: 'Good day everybody, welcome to this wonderful website where we sell keychains from your favorite album. Hope you enjoy the website and use it as inspiration to create websites even cooler than this! Take it away team.', portrait: 'assets/members/disc.jpg' },
  { name: 'Gabrielle Tuazon', role: 'Excecutive / Logistics Coordinator / Financer / Documentor', description: 'Hi everyone! Welcome to our website! I’m Brielle Tuazon. Thank you so much for choosing us to order keychains from! Don’t hesitate to reach out if you have a question. We all hope you like the products and we appreciate the support!', portrait: 'assets/members/guitar.jpg' },
  { name: 'Sebastian Valencia', role: 'Mathematics Head / Co-Financer / Product Overseerer / Coordinator', description: 'What is of the up 🤩I helped with the google forms 😎 Come buy some of our keychains!! ❤️❤️', portrait: 'assets/members/drums.jpg' },
  { name: 'Jia Mapanoo', role: 'Material Handler / Quality Overseerer / Product Description Writer', description: 'Hello everybody and welcome! I am the 4th member of the genres Jia Mapanoo, we are officially open and I am so eager to share what our shop has to offer. I hope you guys find something you love from our shop and make sure you stop by to say hello to us in our stand!', portrait: 'assets/members/violin.jpg' },
  { name: 'Leida Vidal', role: 'Purchasing Agent / Materials Planner / Product Sourcer', description: 'Greetings everyone! and welcome to our website. My name is Leida Vidal, a fellow member of the genres and i am ready and eager to serve you. I hope you will enjoy our site where you could view the different variations of our product and im very excited to sell you our products at our stand. See you there!', portrait: 'assets/members/microphone.jpg' }
];

// ############################# HELPERS! ######################################################3
const $ = (selector) => document.querySelector(selector);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function storageGet(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
function storageSet(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* storage blocked: ignore */ } }

// Smoothly move an audio element's volume to a target. A new fade cancels the old one on the same element.
function fadeTo(audio, target, ms, onDone) {
  const from = audio.volume, startTime = performance.now(), token = {};
  audio._fade = token;
  function step() {
    if (audio._fade !== token) return;
    const t = ms > 0 ? Math.min(1, (performance.now() - startTime) / ms) : 1;
    audio.volume = from + (target - from) * t;
    if (t < 1) setTimeout(step, 30); else if (onDone) onDone();
  }
  step();
}

// Builds the cassette picture used by products, the hero and the mini player. Our mascot :heart-emoji:
// The CSS placeholder is removed automatically once the real image loads, in a way acts as a substitute if file ceases to load or a background error.
function artFrameHtml(src, alt, ratio, reels) {
  const reelHtml = CONFIG.features.reels && reels && reels.src
    ? [reels.leftX, reels.rightX].map((x) => `<span class="reel" style="left:${x * 100}%;top:${reels.y * 100}%;width:${reels.size * 100}%;background-image:url('${reels.src}')"></span>`).join('')
    : '';
  const image = src ? `<img src="${src}" alt="${alt}" loading="lazy" draggable="false" onload="this.previousElementSibling.remove()" onerror="this.remove()">` : '';
  const [aw, ah] = String(ratio || '3 / 2').split('/').map(Number);
  return `<div class="art-frame" style="--art-ratio:${ratio || '3 / 2'}"><div class="cassette"><span class="placeholder-label">PLACEHOLDER</span></div>${image}${reelHtml}</div>`;
}

// ############################# SOUND DESIGN ######################################################3
// Music is the ONLY thing that plays background tracks. Everything else just calls Music.request(src).
const Music = {
  tracks: {},        // one <audio> per file, created once and reused (building a fresh one on every album change was slow)
  current: null,     // the track that should be audible now
  all: [],           // every track still fading in or out, so we can never leave strays playing
  wantedSrc: '',     // what SHOULD be playing; remembered even while the user has paused
  userPaused: false, // true after the visitor presses pause
  blocked: false,    // true if the browser refused autoplay (waiting for a click)
  preloaded: false,

  getTrack(src) {
    if (!this.tracks[src]) {
      const audio = new Audio();
      audio.loop = src !== CONFIG.intro.musicSrc;
      audio.loop = true; audio.preload = 'auto'; audio.dataset.src = src; audio.src = src;
      this.tracks[src] = audio;
    }
    return this.tracks[src];
  },
  preloadAlbums() {                    // called the first time the product page opens
    if (this.preloaded || !CONFIG.features.music || !CONFIG.audio.preloadAlbums) return;
    this.preloaded = true;
    PRODUCTS.forEach((p) => { if (p.featuredAudio) this.getTrack(p.featuredAudio); });
  },
  request(src) {                       // call this whenever the "right" track changes
    this.wantedSrc = src || '';
    if (!this.userPaused) this.crossfadeTo(this.wantedSrc);
  },
  crossfadeTo(src) {
    if (!CONFIG.features.music) return;
    if (this.current && this.current.dataset.src === src) return;   // already on this track
    const next = src ? this.getTrack(src) : null;
    this.all.filter((a) => a !== next).forEach((a) => this.fadeOutAndStop(a)); // fade out everything else, js to make sure
    this.current = null;
    if (!next) { this.report(); return; }
    if (next.paused) next.volume = 0;                               // a track still fading out keeps its volume, no jump
    this.current = next;
    if (!this.all.includes(next)) this.all.push(next);
    //console.log("test5")
    next.play()
      .then(() => {
        // Big files migggghttt take a while to start. If the visitor scrolled on meanwhile, a newer crossfade is already
        // fading this track out; fading it back in would leave it playing over the next album. Zombies are for movies.
        if (this.current !== next) return;
        fadeTo(next, CONFIG.audio.volume, CONFIG.audio.crossfadeMs);
        this.report();
        //Visualizer.attach(next);
      })
      .catch((err) => {                // missing file or autoplay blocked: never throw, wouldn't want missingno to happen now would we (my catchphrase)
        this.drop(next);
        if (err && err.name === 'NotAllowedError') this.blocked = true;
        this.report();
      });
  },
  fadeOutAndStop(audio) {
    fadeTo(audio, 0, CONFIG.audio.crossfadeMs, () => this.drop(audio, true));
  },
  drop(audio, pause) {
    if (pause) audio.pause();          // paused, not deleted: the same element is reused next time
    this.all = this.all.filter((a) => a !== audio);
    if (this.current === audio) this.current = null;
  },
  pause() {                            // global pause: stops ALL music
    this.userPaused = true;
    Sfx.play(CONFIG.audio.scratchSrc, CONFIG.audio.scratchVolume);
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

const Sfx = {
  elements: {},      // file path -> its <audio> element
  unlocked: false,

  getElement(src) {
    if (!this.elements[src]) {
      const audio = new Audio(src);
      audio.preload = 'auto';
      this.elements[src] = audio;
    }
    return this.elements[src];
  },
  play(src, volume = 1) {
    if (!CONFIG.features.sfx || !src) return;
    const audio = this.getElement(src);
    audio.volume = Math.min(1, Math.max(0, CONFIG.audio.sfxVolume * volume));
    audio.preservesPitch = false;
    audio.webkitPreservesPitch = false;
    audio.playbackRate = 0.8 + Math.random() * 0.6;
    audio.currentTime = 0;                          // restart rather than overlap or ignore
    audio.play().catch((err) => {
      // AbortError only means a newer trigger interrupted this one. Anything else is worth knowing about.
      if (err.name !== 'AbortError') console.warn('SFX did not play:', src, err.name);
    });
  },
  // The scratch is triggered by scrolling, rather than clicking *click *click
  unlock() {
    if (this.unlocked || !CONFIG.features.sfx || !CONFIG.audio.scratchSrc) return;
    this.unlocked = true;
    const audio = this.getElement(CONFIG.audio.scratchSrc);
    audio.muted = true;
    audio.play()
      .then(() => { audio.pause(); audio.currentTime = 0; audio.muted = false; })
      .catch(() => { audio.muted = false; });
  }
};
['pointerdown', 'keydown'].forEach((type) => window.addEventListener(type, () => Sfx.unlock(), { once: true, passive: true })); //listener for events

// ############################# FOREGROUND GIF ######################################################3
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

const BRUSH = {
  left:  { vertical: false, flip: false, size: '300% 100%', hidden: '100% 0%', shown: '0% 0%' },
  right: { vertical: false, flip: true,  size: '300% 100%', hidden: '0% 0%',   shown: '100% 0%' },
  down:  { vertical: true,  flip: false, size: '100% 300%', hidden: '0% 100%', shown: '0% 0%' }
};

// Draws a new ragged bristle edge every time, so no two reveals look the same.
function brushMaskUrl(dir) {
  const bands = 120, step = 100 / bands;
  let wobble = 0, bars = '';
  for (let i = 0; i < bands; i++) {
    wobble = Math.max(-25, Math.min(25, wobble * 0.6 + (Math.random() - 0.5) * 30));
    let edge = 150 + wobble;
    if (Math.random() < 0.12) edge = Math.min(195, edge + Math.random() * 20);
    const start = dir.flip ? 300 - edge : 0, at = i * step, thick = step + 0.6;
    bars += dir.vertical
      ? `<rect x="${at}" y="${start}" width="${thick}" height="${edge}"/>`
      : `<rect x="${start}" y="${at}" width="${edge}" height="${thick}"/>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${dir.vertical ? '0 0 100 300' : '0 0 300 100'}" preserveAspectRatio="none">${bars}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function setMask(el, props) {
  Object.entries(props).forEach(([name, value]) => {
    el.style.setProperty('mask-' + name, value);
    el.style.setProperty('-webkit-mask-' + name, value);
  });
}

function showForeground(src) {
  const el = $('#foreground-gif');
  const dir = BRUSH[CONFIG.gifWipe.direction] || BRUSH.left;
  const ms = reduceMotion ? 0 : CONFIG.gifWipe.durationMs;
  const slide = `mask-position ${ms}ms ease-in-out, -webkit-mask-position ${ms}ms ease-in-out`;
  el.style.clipPath = 'none';
  if (!src) {
    el.style.transition = slide;
    setMask(el, { position: dir.hidden });
    return;
  }
  el.style.transition = 'none';
  setMask(el, { image: brushMaskUrl(dir), size: dir.size, repeat: 'no-repeat', position: dir.hidden });
  el.style.backgroundImage = `url("${src}")`;
  void el.offsetWidth;
  el.style.transition = slide;
  setMask(el, { position: dir.shown });
}

// The one place that reacts to "a different album is now active". [#######################3]
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
    console.log("works")
    if (!Music.userPaused) Sfx.play(CONFIG.audio.scratchSrc, CONFIG.audio.scratchVolume);
  }
}

// ############################# MARQUEES ######################################################3
function renderProducts() {
  const list = $('#product-list');
  PRODUCTS.forEach((p, index) => {
    const songs = p.songs.length ? p.songs : [p.title];            // never an empty marquee
    const article = document.createElement('article');
    article.className = 'product' + (index % 2 ? ' reverse' : ''); // odd cards flip sides
    article.dataset.id = p.id;
    article.style.setProperty('--product-font', p.font);
    article.style.setProperty('--square-bg', p.squareBackground);
    article.style.setProperty('--art-scale', p.artScale);
    if (p.artBreak) article.style.setProperty('--frame-break', p.artBreak);
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
    const visual = article.querySelector('.product-visual');
    visual.addEventListener('pointerenter', (e) => { if (e.pointerType !== 'touch') visual.classList.add('is-hovered'); });
    ['pointerleave', 'pointercancel'].forEach((type) => visual.addEventListener(type, () => visual.classList.remove('is-hovered')));
    Marquee.setup(article.querySelector('.marquee'), songs);
  });
}

// Marquee: sized from ITS OWN width (not the screen (dependant boy)). A ResizeObserver re-runs layout() whenever that width changes.
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

// The ONLY place that decides which album is currently or rather presently active. It calls setActiveProduct(), which drives every effect soon after.
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
    // Nobody in range so above the first card = default theme then between cards or below the last = keep the current album.
    const first = document.querySelector('.product');
    if (first && first.getBoundingClientRect().top > centerY + reach) setActiveProduct(null);
  }
};

function renderPrices() {
  $('#price-list').innerHTML = PRODUCTS.map((p) => `
    <li class="price-tag">
      <span class="price-title">${p.title}</span>
      <span class="price-artist">${p.artist}</span>
      <span class="price-amount"><small>${CONFIG.currency}</small>${p.price}</span>
    </li>`).join('');
}

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

// ############################# CASCETTE AND REELS ######################################################3
// Home cassette: gentle float, pointer tilt, drag, and an elliptical shadow. Imaginary technique: spring physics.
// Believe it or not this was kind of simple to make, math and physics are my strong suit trusttt
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
      if (this.dragging || (e.pointerType === 'mouse' && e.button !== 0)) return; // left button / one finger only, wouldn't want you fingering the cassette now would we
      this.dragging = true; this.el.setPointerCapture(e.pointerId);
      grab = { x: e.clientX - this.pos.x, y: e.clientY - this.pos.y };
    });
    this.el.addEventListener('pointermove', (e) => {
      if (!this.dragging) return;
      const x = this.clamp(e.clientX - grab.x, this.limit.x), y = this.clamp(e.clientY - grab.y, this.limit.y);
      this.vel = { x: x - this.pos.x, y: y - this.pos.y };                     // remember speed for momentum
      this.pos = { x, y };
    });
    const release = () => {
      if (!this.dragging) return;
      this.dragging = false;
      Sfx.play(CONFIG.audio.releaseSrc, CONFIG.audio.releaseVolume);
    }; // boing
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
      this.vel.x = (this.vel.x + (targetX - this.pos.x) * c.stiffness) * c.damping;   // x damping
      this.vel.y = (this.vel.y + (targetY - this.pos.y) * c.stiffness) * c.damping;   // y damping - changable in settings/config tho
      this.pos.x = this.clamp(this.pos.x + this.vel.x, this.limit.x);
      this.pos.y = this.clamp(this.pos.y + this.vel.y, this.limit.y);
    }
    const tilt = this.clamp(this.vel.x * 1.5 + this.pos.x * 0.02, 12);
    this.el.style.transform = `translate3d(${this.pos.x}px, ${this.pos.y}px, 0) rotate(${tilt}deg)`;
    this.title.style.transform = `translate3d(${-this.pos.x * 0.15}px, 0, 0)`;  // wordmark drifts the other way = depth
    // [#######] shadow system: when the cassette is lifted (up or being dragged) it gets lighter and slightly wider; when settled less blur
    const lift = this.dragging ? 0.6 : Math.max(0, -this.pos.y / (this.limit.y || 1)); //altitude basically, clamp required
    this.shadow.style.opacity = s.opacity * (1 - s.liftFade * lift); // opac/blur
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

// ############################# AUDIO VISUALIZER ######################################################3
// audio visualizer: reads the REAL music through a Web Audio analyser. Inactive when nothing is playing. Not sure if this still works though.
/*const Visualizer = {
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
      if (audio._vizSource) { this.loop(); return; }   // already routed through the analyser (and must stay that way)
      if (this.ctx.state !== 'running' || audio.paused || Music.current !== audio) return; // otherwise leave normal playback alone
      audio._vizSource = this.ctx.createMediaElementSource(audio); // allowed once per element, never again
      audio._vizSource.connect(this.analyser);
      this.loop();
    } catch (err) { /* the visualizer is optional: ignore any failure */ /* }
  },
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
*/
// custom cursor
// Custom cursor: a small play icon that follows the mouse. If anything fails, the native cursor stays.
const CustomCursor = {
  start() {
    if (!CONFIG.features.customCursor || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return; // touch keeps the native cursor
    try {
      const el = document.createElement('div'); //default elem
      el.id = 'custom-cursor'; el.setAttribute('aria-hidden', 'true');
      el.innerHTML = '<svg viewBox="0 0 24 24"><path class="c-play" d="M5 3l15 9-15 9z"/><g class="c-pause"><rect x="5" y="4" width="5" height="16"/><rect x="14" y="4" width="5" height="16"/></g><circle class="c-link" cx="12" cy="12" r="7"/></svg>';
      document.body.appendChild(el);
      let x = 0, y = 0, queued = false;
      window.addEventListener('pointermove', (e) => {
        if (e.pointerType === 'touch') return;
        x = e.clientX; y = e.clientY; //mousex & mouseY
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

// page handler [#########]
const PAGES = ['home', 'products', 'order'];
let siteReady = false; // becomes true once the intro is finished or skipped

function showPage(name) {
  if (!PAGES.includes(name)) name = 'home';
  PAGES.forEach((p) => { $('#page-' + p).hidden = p !== name; });
  document.querySelectorAll('[data-page]').forEach((link) => {
    if (link.dataset.page === name) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
  });
  document.body.dataset.page = name;
  if (name === 'products') Music.preloadAlbums();
  window.scrollTo(0, 0);
  if (name !== 'products') {
    setActiveProduct(null);                                   // restores the default theme
    if (siteReady) Music.request(CONFIG.audio.homeSrc);
  }
  updateScroll();
}
window.addEventListener('hashchange', () => showPage(location.hash.slice(1)));

// depth-addition algo
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

// moving notes, my fav, was pretty fun to make (no it was not)
let notes = [], staff = null;
function setupNotes() {
  if (!CONFIG.features.musicalNotes) return;   // kill switch: nothing is created
  const layer = document.createElement('div');
  layer.className = 'notes-layer'; layer.setAttribute('aria-hidden', 'true');
  staff = document.createElement('div'); staff.className = 'staff';
  layer.appendChild(staff);
  ['♪', '♫', '♩', '♬'].forEach((symbol, group) => { //just use non-standard ASCII, cause i'm tuff like that
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

// ################################# Intro sequence #####################################333
function setScrollLock(locked) {
  document.documentElement.classList.toggle('is-scroll-locked', locked);
}

let introRunning = false;
function runIntro(onFinish, { ignoreSeen = false } = {}) {
  Music.request('');
  const cfg = CONFIG.intro;
  const alreadySeen = !ignoreSeen && !cfg.showEveryVisit && storageGet(cfg.storageKey);
  if (!CONFIG.features.intro || alreadySeen) { onFinish(); return; }
  const intro = $('#intro'), video = $('#intro-video');
  introRunning = true;
  setScrollLock(true);
  // A replay starts on a dirty screen: the last run may have been skipped mid-fade.
  intro.querySelectorAll('.is-visible').forEach((el) => el.classList.remove('is-visible'));
  intro.classList.remove('is-leaving');
  const timers = []; let finished = false;
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const show = (sel) => $(sel).classList.add('is-visible');
  const hide = (sel) => $(sel).classList.remove('is-visible');

  function finish() {                          // safe to call many times, cause i'm tuff like that
    if (finished) return;
    finished = true;
    timers.forEach(clearTimeout);
    video.pause();
    storageSet(cfg.storageKey, '1');
    intro.classList.add('is-leaving');         // the fade only works on a visible element, so hide it after, not before
    onFinish();                                // start the site now: it is already there when the black lifts, couruntined
    // Scroll stays locked and replays stay blocked until the fade is done.
    setTimeout(() => { intro.hidden = true; introRunning = false; setScrollLock(false); }, reduceMotion ? 0 : cfg.fadeOutMs);
  }
  function startAnimation() {
    if (!cfg.videoSrc) { finish(); return; }
    if (cfg.musicSrc) Music.getTrack(cfg.musicSrc).currentTime = 0;
    Music.request(cfg.musicSrc);
    video.onended = finish;                    // assigned, not added, so a replay does not stack old handlers
    video.onerror = finish;                    // missing video: skip ahead
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
  $('#intro-skip').onclick = finish;
}

// Debug: replay the first-visit intro, like groundhog day, without clearing localStorage by hand, cause I'm just pro like that.
// Ctrl/Cmd/Alt combos are ignored on purpose; cause Ctrl+Shift+I already belongs to DevTools (I need that too)
function setupDebugKeys(afterIntro) {
  if (!CONFIG.debug.enabled) return;
  document.addEventListener('keydown', (e) => {
    if (e.key !== CONFIG.debug.replayIntroKey || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target.closest('input, textarea, select, [contenteditable]')) return;
    if (introRunning) return;                  // a second press mid-intro would start a second intro, so don't do that-
    window.scrollTo(0, 0);
    runIntro(afterIntro, { ignoreSeen: true });
  });
}

//Draggable Cassette

function setupPlayerDrag() {
  const player = $('#mini-player'), handle = $('#mini-art');
  const KEY = 'genres-player-corner';
  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
  const view = () => document.documentElement;
  const saved = storageGet(KEY);
  player.dataset.corner = ['tl', 'tr', 'bl', 'br'].includes(saved) ? saved : 'bl';
  handle.classList.add('is-draggable');
  let start = null;

  handle.addEventListener('pointerdown', (e) => {
    if (start || (e.pointerType === 'mouse' && e.button !== 0)) return;
    start = { x: e.clientX, y: e.clientY, box: player.getBoundingClientRect() };
    handle.setPointerCapture(e.pointerId);
    player.style.transition = 'none';
    player.classList.add('is-dragging');
  });

  handle.addEventListener('pointermove', (e) => {
    if (!start) return;
    const dx = clamp(e.clientX - start.x, -start.box.left, view().clientWidth - start.box.right);
    const dy = clamp(e.clientY - start.y, -start.box.top, view().clientHeight - start.box.bottom);
    player.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
  });

  const drop = () => {
    if (!start) return;
    start = null;
    player.classList.remove('is-dragging');
    const from = player.getBoundingClientRect();
    const corner = (from.top + from.height / 2 < view().clientHeight / 2 ? 't' : 'b')
                 + (from.left + from.width / 2 < view().clientWidth / 2 ? 'l' : 'r');
    player.style.transform = 'none';
    player.dataset.corner = corner;
    const to = player.getBoundingClientRect();
    player.style.transform = `translate3d(${from.left - to.left}px, ${from.top - to.top}px, 0)`;
    void player.offsetWidth;
    player.style.transition = 'transform 350ms cubic-bezier(.2, .9, .3, 1.15)';
    player.style.transform = 'translate3d(0, 0, 0)';
    storageSet(KEY, corner);
  };
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((type) => handle.addEventListener(type, drop));
}

const TouchTrail = {
  start() {
    if (!CONFIG.features.touchTrail || reduceMotion || !window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;
    const COUNT = 12, FOLLOW = 0.35, FADE_MS = 300;
    const dots = [];
    let target = { x: 0, y: 0 }, touching = false, alpha = 0, running = false, last = 0;
    for (let i = 0; i < COUNT; i++) {
      const el = document.createElement('div');
      el.className = 'trail-dot';
      document.body.appendChild(el);
      dots.push({ el, x: 0, y: 0 });
    }
    const frame = (now) => {
      const dt = Math.min(now - last, 50);
      last = now;
      const ease = 1 - Math.pow(1 - FOLLOW, dt / 16.7);
      alpha = touching ? 1 : Math.max(0, alpha - dt / FADE_MS);
      dots.forEach((dot, i) => {
        const lead = i === 0 ? target : dots[i - 1];
        dot.x += (lead.x - dot.x) * ease;
        dot.y += (lead.y - dot.y) * ease;
        const size = 1 - i / COUNT;
        dot.el.style.opacity = alpha * size;
        dot.el.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0) translate(-50%, -50%) scale(${size})`;
      });
      if (touching || alpha > 0) requestAnimationFrame(frame); else running = false;
    };
    const wake = () => { if (!running) { running = true; last = performance.now(); requestAnimationFrame(frame); } };
    window.addEventListener('touchstart', (e) => {
      const t = e.touches[0];
      target = { x: t.clientX, y: t.clientY };
      dots.forEach((d) => { d.x = target.x; d.y = target.y; });
      touching = true;
      wake();
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
      const t = e.touches[0];
      if (t) target = { x: t.clientX, y: t.clientY };
    }, { passive: true });
    ['touchend', 'touchcancel'].forEach((type) => window.addEventListener(type, (e) => {
      if (!e.touches.length) touching = false;
    }, { passive: true }));
  }
};

function setupPromo() {
  const size = CONFIG.keychainSize;
  const chip = $('#size-toggle'), demo = $('.keychain-demo'), w = $('.dim-w'), h = $('.dim-h');
  let inches = false;
  const fmt = (cm) => (inches ? (cm / 2.54).toFixed(2) : cm);
  const paint = () => {
    const unit = inches ? 'in' : 'cm';
    chip.textContent = `${fmt(size.widthCm)} × ${fmt(size.heightCm)} ${unit}`;
    w.textContent = `${fmt(size.widthCm)} ${unit}`;
    h.textContent = `${fmt(size.heightCm)} ${unit}`;
  };
  demo.style.setProperty('--kc-ratio', size.widthCm / size.heightCm);
  chip.addEventListener('click', () => { inches = !inches; paint(); });
  paint();
}

// actual compilation, genuiene hell HAHHAHAHAHAHHA
function start() {
  // features switches that are pure CSS hooks - IGNOREEEEEE
  if (CONFIG.features.productHover) document.body.classList.add('hover-on');
  if (!CONFIG.features.music) $('.mini-controls').hidden = true;

  document.title = CONFIG.brand.name;                                       // brand name lives in CONFIG.brand
  document.querySelectorAll('[data-brand]').forEach((el) => { el.textContent = CONFIG.brand.name; });
  $('#brand-icon').src = CONFIG.brand.iconSrc;
  $('#order-form').src = CONFIG.orderFormUrl;
  $('#order-form-link').href = CONFIG.orderFormUrl.replace('?embedded=true', '');

  renderProducts();
  renderPrices();
  setupPromo();
  const root = document.documentElement.style;            // intro icon settings
  root.setProperty('--intro-icon-size', CONFIG.intro.iconSize);
  root.setProperty('--intro-gap', CONFIG.intro.iconGap);
  root.setProperty('--intro-video-fit', CONFIG.intro.videoFit);
  root.setProperty('--intro-fade-ms', CONFIG.intro.fadeOutMs + 'ms');
  const hero = CONFIG.images.hero, player = CONFIG.images.player;
  $('.cassette-wrap').innerHTML = artFrameHtml(hero.src, 'Animated cassette player', hero.ratio, hero.reels);
  $('#mini-art').innerHTML = artFrameHtml(player.src, '', player.ratio, player.reels);
  FocusTracker.start();
  renderMembers();
  CassettePhysics.start();
  //Visualizer.start(); highkey decoration HAHHAHAH, too lazy to https it, ik I could get a github repository but no that takes too much work, imma just leave code as a theory
  CustomCursor.start();
  TouchTrail.start();
  setupPlayerDrag();
  setupNotes();

  $('#btn-play').addEventListener('click', () => Music.resume());
  $('#btn-pause').addEventListener('click', () => Music.pause());
  document.addEventListener('mousedown', () => {
      Sfx.play(CONFIG.audio.clickSrc, CONFIG.audio.clickVolume);
  });

  // If the browser blocked autoplay, the first click/keypress retries the wanted track.
  ['pointerdown', 'keydown'].forEach((type) => window.addEventListener(type, () => {
    if (Music.blocked && !Music.userPaused && !introRunning) { Music.blocked = false; Music.crossfadeTo(Music.wantedSrc); }
  }, { passive: true }));

  const afterIntro = () => { siteReady = true; showPage(location.hash.slice(1)); };
  runIntro(afterIntro);
  setupDebugKeys(afterIntro);
}
start();