(function () {
  const SCROLL_RANGE = 1400;

  const _css = getComputedStyle(document.documentElement);
  const _tok = n => _css.getPropertyValue(`--hero-${n}-bg`).trim();
  const _txt = n => _css.getPropertyValue(`--hero-${n}-text`).trim();
  const PALETTES = [1, 2, 3].map(n => ({ bg: _tok(n), text: _txt(n) }));
  const PALETTE = PALETTES[Math.floor(Math.random() * PALETTES.length)];

  function rand(a, b)    { return a + Math.random() * (b - a); }
  function randInt(a, b) { return Math.round(rand(a, b)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function easeOut(v)    { return 1 - Math.pow(1 - v, 2.5); }

  const heroSection = document.getElementById('hero-section');
  const stage       = document.getElementById('hero-stage');
  const nav         = document.querySelector('.nav');
  const GAP         = 24;

  function sizeStage() {
    const navH = nav ? nav.offsetHeight : 0;
    const vh   = window.innerHeight;
    stage.style.top    = (navH + GAP) + 'px';
    stage.style.height = (vh - navH - GAP * 2) + 'px';
    heroSection.style.height = (vh - navH + 1400) + 'px';
  }
  sizeStage();
  window.addEventListener('resize', sizeStage);

  stage.style.background = PALETTE.bg;

  // Defer to next frame so layout is fully computed before we measure
  requestAnimationFrame(function () {

    const isMobile = stage.clientWidth < 600;
    const TEXT     = isMobile ? 'Victoria\nFox' : 'Victoria Fox';

    // ── Static text is the source of truth for position + size ───
    // We render it invisibly first, measure it, then use those
    // positions as the home targets for the animated letter spans.
    const staticText = document.createElement('p');
    Object.assign(staticText.style, {
      position:             'absolute',
      left:                 '50%',
      top:                  '50%',
      transform:            'translate(-50%, -50%)',
      fontFamily:           "'Roslindale Display', serif",
      fontSize:             Math.min((isMobile ? 0.16 : 0.11) * stage.clientWidth, 150) + 'px',
      fontVariationSettings:"'wght' 700, 'wdth' 75",
      color:                PALETTE.text,
      whiteSpace:           isMobile ? 'pre' : 'nowrap',
      letterSpacing:        '0.01em',
      lineHeight:           '1.05',
      textAlign:            'center',
      opacity:              '0',
      pointerEvents:        'none',
    });
    staticText.textContent = TEXT;
    stage.appendChild(staticText);
    document.body.offsetHeight; // force layout before measuring

    // Derive BASE_PX from the actual rendered font size
    const BASE_PX   = parseFloat(getComputedStyle(staticText).fontSize);
    const stageRect = stage.getBoundingClientRect();

    // Measure each character's exact position inside the static text
    const textNode = staticText.childNodes[0];
    const range    = document.createRange();
    const homeRects = TEXT.split('').map((char, i) => {
      range.setStart(textNode, i);
      range.setEnd(textNode, i + 1);
      const rects = range.getClientRects();
      // Spaces sometimes return a zero-width rect — use it anyway for position
      const r = rects.length > 0 ? rects[0]
              : { left: stageRect.left, top: stageRect.top, width: BASE_PX * 0.3, height: BASE_PX };
      return {
        left:   r.left   - stageRect.left,
        top:    r.top    - stageRect.top,
        width:  r.width,
        height: r.height,
      };
    });

    // ── Build one span per character, pinned at home positions ────
    const letters = TEXT.split('').map((char, i) => {
      const h = homeRects[i];
      const s = document.createElement('span');
      s.classList.add('hero__letter');
      Object.assign(s.style, {
        position:             'absolute',
        left:                 h.left + 'px',
        top:                  h.top  + 'px',
        fontSize:             BASE_PX + 'px',
        fontVariationSettings:"'wght' 700, 'wdth' 75",
        color:                PALETTE.text,
        lineHeight:           '1',
      });
      s.textContent = char === ' ' ? ' ' : char;
      if (char === '\n') s.style.opacity = '0';
      stage.appendChild(s);
      return s;
    });

    // ── Scatter target generator (collision-free) ─────────────────
    function makeTargets() {
      const placed = [];
      const CGAP = 20;
      const sw = stage.clientWidth, sh = stage.clientHeight;
      const minX = 0.04 * sw, maxX = 0.88 * sw;
      const minY = 0.04 * sh, maxY = 0.88 * sh;

      return letters.map(l => {
        const isSpace = l.textContent === ' ';
        const size    = rand(6, 18) * sw / 100;
        const r       = size * 0.6;
        let left = rand(minX, maxX), top = rand(minY, maxY);

        if (!isSpace) {
          let cx, cy, ok;
          for (let attempt = 0; attempt < 500; attempt++) {
            left = rand(minX, maxX);
            top  = rand(minY, maxY);
            cx   = left + size * 0.35;
            cy   = top  + size * 0.50;
            ok   = placed.every(p => Math.hypot(cx - p.cx, cy - p.cy) >= r + p.r + CGAP);
            if (ok) break;
          }
          placed.push({ cx: left + size * 0.35, cy: top + size * 0.50, r });
        }
        return { left, top, size, rot: rand(-180, 180) };
      });
    }

    let scatterTargets = makeTargets();

    // Place letters at scattered positions, hidden
    letters.forEach((l, i) => {
      const s = scatterTargets[i];
      l.style.left      = s.left + 'px';
      l.style.top       = s.top  + 'px';
      l.style.fontSize  = s.size + 'px';
      l.style.transform = `rotate(${s.rot}deg)`;
      l.style.opacity   = '0';
    });

    // Per-letter spring scale for the pop-in bounce
    // scale starts at 0, springs to 1 with overshoot when letter pops in
    const spring = letters.map(() => ({ scale: 1, vel: 0, active: false }));

    const popped = new Array(letters.length).fill(false);
    letters.forEach((l, i) => {
      setTimeout(() => {
        popped[i]          = true;
        spring[i].active   = true;
        spring[i].scale    = 0;
        spring[i].vel      = 0;
        l.style.opacity    = TEXT[i] === '\n' ? '0' : '1';
      }, rand(0, 900));
    });

    // ── Per-letter wibble ─────────────────────────────────────────
    const wibble = letters.map(() => ({
      fRot: rand(0.3, 0.7),  phRot: rand(0, Math.PI * 2),  aRot: rand(12, 28),
      fX:   rand(0.2, 0.5),  phX:   rand(0, Math.PI * 2),  aX:   rand(5, 12),
      fY:   rand(0.25, 0.55),phY:   rand(0, Math.PI * 2),  aY:   rand(5, 12),
    }));

    // ── RAF loop ──────────────────────────────────────────────────
    const SWAP_THRESHOLD = 0.96;
    let prevP = 0;

    function tick() {
      const scrolled = window.scrollY - heroSection.offsetTop;
      const p = easeOut(Math.max(0, Math.min(1, scrolled / SCROLL_RANGE)));
      const t = performance.now() / 1000;

      if (prevP > 0.02 && p < 0.02) scatterTargets = makeTargets();
      prevP = p;

      if (p >= SWAP_THRESHOLD) {
        letters.forEach(l => { l.style.opacity = '0'; });
        staticText.style.opacity = '1';
      } else {
        staticText.style.opacity = '0';
        const wibbleAmt = Math.max(0, 1 - p * 2.5);
        letters.forEach((l, i) => {
          const s = scatterTargets[i];
          const h = homeRects[i];
          const w = wibble[i];
          const sp = spring[i];

          // Advance spring toward scale 1
          if (sp.active && Math.abs(sp.scale - 1) > 0.001) {
            sp.vel   += (1 - sp.scale) * 0.35; // stiffness
            sp.vel   *= 0.60;                   // damping (lower = more bounce)
            sp.scale += sp.vel;
          } else if (sp.active) {
            sp.scale = 1;
          }

          const wobbleX   = Math.sin(t * w.fX   + w.phX)   * w.aX   * wibbleAmt;
          const wobbleY   = Math.sin(t * w.fY   + w.phY)   * w.aY   * wibbleAmt;
          const wobbleRot = Math.sin(t * w.fRot + w.phRot) * w.aRot * wibbleAmt;
          if (popped[i]) l.style.opacity = TEXT[i] === '\n' ? '0' : '1';
          l.style.left      = (lerp(s.left, h.left, p) + wobbleX) + 'px';
          l.style.top       = (lerp(s.top,  h.top,  p) + wobbleY) + 'px';
          l.style.fontSize  = lerp(s.size, BASE_PX, p) + 'px';
          l.style.transform = `rotate(${lerp(s.rot, 0, p) + wobbleRot}deg) scale(${sp.scale})`;
        });
      }

      requestAnimationFrame(tick);
    }

    tick();
  });
})();
