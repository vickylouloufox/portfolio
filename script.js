/* ============================================
   VF Portfolio — script.js (vanilla)
   ============================================ */

(function () {
  'use strict';

  // ---------- Work key filter ----------
  const workKey = document.querySelector('.work-key');
  if (workKey) {
    const workItems = document.querySelectorAll('.work-item');
    let active = null;

    workKey.querySelectorAll('.wtag[data-filter]').forEach(pill => {
      pill.addEventListener('click', () => {
        const filter = pill.dataset.filter;
        if (active === filter) {
          active = null;
          workKey.classList.remove('has-active');
          workKey.querySelectorAll('.wtag').forEach(p => p.classList.remove('is-active'));
          workItems.forEach(item => item.classList.remove('is-filtered'));
        } else {
          active = filter;
          workKey.classList.add('has-active');
          workKey.querySelectorAll('.wtag').forEach(p => p.classList.remove('is-active'));
          pill.classList.add('is-active');
          workItems.forEach(item => {
            const tags = (item.dataset.tags || '').split(' ');
            item.classList.toggle('is-filtered', !tags.includes(filter));
          });
        }
      });
    });
  }

  // ---------- GIF hover-to-play ----------
  document.querySelectorAll('.case-card__img[data-gif]').forEach(img => {
    const still = img.src;
    const gif   = img.dataset.gif;
    const media = img.closest('.case-card__media, .cs-cover__img');
    if (!media) return;
    media.addEventListener('mouseenter', () => { img.src = gif; });
    media.addEventListener('mouseleave', () => { img.src = still; });
  });

  // ---------- Reveal on scroll ----------
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // ---------- Nav scroll state ----------
  const nav = document.getElementById('nav');
  const updateNav = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });

  // ---------- Nav contextual links ----------
  const heroLinks = document.querySelector('.hero__quick-links');
  if (heroLinks) {
    new IntersectionObserver(([entry]) => {
      nav.classList.toggle('links-visible', !entry.isIntersecting);
    }, { threshold: 0 }).observe(heroLinks);
  }



  // ---------- Reading list (Raindrop.io) ----------
  const RAINDROP_TOKEN      = '5ae6615a-17f3-46ce-b0d1-4e2c4f6f8940';
  const RAINDROP_COLLECTION = '70085968';

  async function loadReading() {
    const list = document.querySelector('.reading-bar__list');
    if (!list || RAINDROP_TOKEN === 'YOUR_TEST_TOKEN') return;

    try {
      const res = await fetch(
        `https://api.raindrop.io/rest/v1/raindrops/${RAINDROP_COLLECTION}?perpage=5&sort=-created`,
        { headers: { Authorization: `Bearer ${RAINDROP_TOKEN}` } }
      );
      const { items } = await res.json();
      if (!items?.length) return;

      list.innerHTML = items.map(item => {
        const domain = (() => { try { return new URL(item.link).hostname.replace('www.', ''); } catch { return ''; } })();
        const date   = new Date(item.created).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
        return `<a href="${item.link}" target="_blank" rel="noopener" class="reading-link">
          <span class="reading-link__date">${date}</span>
          <span class="reading-link__title">${item.title}</span>
          <span class="reading-link__meta">${domain}</span>
          <span class="reading-link__arrow" aria-hidden="true">↗</span>
        </a>`;
      }).join('');
    } catch {
      // keep static fallback
    }
  }

  loadReading();

  // ---------- Chat (Ask VF) ----------
  const chatForm     = document.getElementById('chat-form');
  const chatInput    = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');
  const chatChips    = document.getElementById('chat-suggestions');

  const PERSONA = [
    'You are a helpful assistant answering questions about Victoria Fox\'s portfolio.',
    'Victoria is a Product Design Lead with 11+ years of experience, based in the UK, currently pivoting into AI.',
    'She has worked at Bloom & Wild (Design Team Lead, 2016–2018; won App of the Year 2017),',
    'Attest (Lead Product Designer, 2018–2019), On Deck (Lead Designer & Manager, 2021–2023),',
    'and Translucent (Founding Designer, 2023–2024 — shipped a design system + 2 apps in 14 months).',
    'Her manifesto: AI extends thinking rather than replacing it; discernment (knowing what not to build)',
    'matters more than production; designers should design the system, not just the screen.',
    'Answer briefly (2–3 sentences), in a warm, confident, first-person voice as if Victoria were speaking.',
    'If you don\'t know, say so and suggest emailing vickyloufox@gmail.com.'
  ].join(' ');

  function addMsg(text, who) {
    const el = document.createElement('div');
    el.className = 'chat__msg chat__msg--' + who;
    el.textContent = text;
    chatMessages.appendChild(el);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return el;
  }

  async function askVF(q) {
    addMsg(q, 'user');
    const thinking = addMsg('Thinking…', 'bot');
    thinking.classList.add('is-typing');
    if (chatChips) chatChips.style.display = 'none';

    try {
      let reply = '';
      if (window.claude && typeof window.claude.complete === 'function') {
        reply = await window.claude.complete({
          messages: [{ role: 'user', content: PERSONA + '\n\nQuestion: ' + q }]
        });
      } else {
        reply = "I'd love to answer this — but the AI assistant isn't wired up yet. Reach Victoria directly at vickyloufox@gmail.com and she'll come back to you.";
      }
      thinking.classList.remove('is-typing');
      thinking.textContent = (typeof reply === 'string' ? reply : reply?.content ?? '').trim() ||
        "Hmm, something went wrong. Try emailing vickyloufox@gmail.com.";
    } catch {
      thinking.classList.remove('is-typing');
      thinking.textContent = "Something went wrong on my end. Email vickyloufox@gmail.com and I'll come back to you.";
    }
  }

  if (chatForm) {
    chatForm.addEventListener('submit', e => {
      e.preventDefault();
      const q = chatInput.value.trim();
      if (!q) return;
      chatInput.value = '';
      askVF(q);
    });
  }
  if (chatChips) {
    chatChips.addEventListener('click', e => {
      const btn = e.target.closest('.chat__chip');
      if (btn) askVF(btn.dataset.q);
    });
  }

  // ---------- Lightbox ----------
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';

  const lightboxImg = document.createElement('img');
  lightboxImg.className = 'lightbox__img';

  const lightboxNav = document.createElement('div');
  lightboxNav.className = 'lightbox__nav';
  const lightboxPrev = document.createElement('button');
  lightboxPrev.className = 'lightbox__btn lightbox__btn--prev';
  lightboxPrev.setAttribute('aria-label', 'Previous image');
  lightboxPrev.textContent = '←';
  const lightboxNext = document.createElement('button');
  lightboxNext.className = 'lightbox__btn lightbox__btn--next';
  lightboxNext.setAttribute('aria-label', 'Next image');
  lightboxNext.textContent = '→';
  lightboxNav.appendChild(lightboxPrev);
  lightboxNav.appendChild(lightboxNext);

  lightbox.appendChild(lightboxImg);
  lightbox.appendChild(lightboxNav);
  document.body.appendChild(lightbox);

  let lbImages = [];
  let lbCur = 0;

  function lbGo(n) {
    lbCur = (n + lbImages.length) % lbImages.length;
    lightboxImg.src = lbImages[lbCur].src;
    lightboxImg.alt = lbImages[lbCur].alt;
    lightboxPrev.disabled = lbCur === 0;
    lightboxNext.disabled = lbCur === lbImages.length - 1;
    lightboxNav.style.display = lbImages.length > 1 ? 'flex' : 'none';
  }

  function openLightbox(src, alt) {
    lbImages = [{ src, alt: alt || '' }];
    lbGo(0);
    lightbox.scrollTop = 0;
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function openLightboxSlideshow(images) {
    lbImages = images;
    lbGo(0);
    lightbox.scrollTop = 0;
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  lightbox.addEventListener('click', closeLightbox);
  lightboxImg.addEventListener('click', e => e.stopPropagation());
  lightboxNav.addEventListener('click', e => e.stopPropagation());
  lightboxPrev.addEventListener('click', () => lbGo(lbCur - 1));
  lightboxNext.addEventListener('click', () => lbGo(lbCur + 1));
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lbGo(lbCur - 1);
    if (e.key === 'ArrowRight') lbGo(lbCur + 1);
  });

  document.querySelectorAll('.cs-figure img, .cs-cover__img img').forEach(img => {
    if (img.style.display === 'none') return;
    img.addEventListener('click', () => {
      const figure = img.closest('[data-slideshow]');
      if (figure) {
        const imgs = Array.from(figure.querySelectorAll('img')).map(i => ({ src: i.src, alt: i.alt }));
        openLightboxSlideshow(imgs);
      } else {
        openLightbox(img.src, img.alt);
      }
    });
  });

  // ---------- Case study slideshow ----------
  document.querySelectorAll('.cs-figure--slideshow').forEach(fig => {
    const slides = Array.from(fig.querySelectorAll('.cs-slideshow__slide'));
    const prev   = fig.querySelector('.cs-slideshow__btn--prev');
    const next   = fig.querySelector('.cs-slideshow__btn--next');
    let cur = 0;

    function go(n) {
      slides[cur].classList.remove('cs-slideshow__slide--active');
      cur = (n + slides.length) % slides.length;
      slides[cur].classList.add('cs-slideshow__slide--active');
      if (prev) prev.disabled = cur === 0;
      if (next) next.disabled = cur === slides.length - 1;
    }

    if (prev) prev.disabled = true;
    prev?.addEventListener('click', () => go(cur - 1));
    next?.addEventListener('click', () => go(cur + 1));
  });

  // ── Copy email to clipboard + toast ─────────────────────────
  const toast = document.getElementById('toast');
  let toastTimer;

  document.querySelectorAll('[data-copy-email]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      navigator.clipboard.writeText('vickyloufox@gmail.com').then(() => {
        // Position near the click, nudged up so it sits above the cursor
        const x = e.clientX;
        const y = e.clientY;
        toast.style.left = x + 'px';
        toast.style.top  = (y - 44) + 'px';
        requestAnimationFrame(() => {
          const rect = toast.getBoundingClientRect();
          if (rect.right > window.innerWidth - 12)
            toast.style.left = (window.innerWidth - rect.width - 12) + 'px';
          if (rect.left < 12) toast.style.left = '12px';
          if (rect.top < 12) toast.style.top = (y + 16) + 'px';
        });
        toast.classList.add('is-visible');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2500);
      });
    });
  });

  // ── Work list hover ───────────────────────────────────────────
  const workItems = document.querySelectorAll('.work-item');

  workItems.forEach((item, i) => {
    item.addEventListener('mouseenter', () => {
      workItems.forEach((it, j) => it.classList.toggle('is-active', j === i));
    });
    item.addEventListener('mouseleave', () => {
      item.classList.remove('is-active');
    });
  });

})();
