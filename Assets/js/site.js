/* Portfolio motion: Lenis smooth scroll, GSAP scroll effects, cursor, previews, demo player.
   Everything here is progressive: the page reads complete without this file. */
(() => {
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  /* ---------- Split the hero head into words for the entrance ---------- */
  const splitWords = (el) => {
    const text = el.textContent;
    el.setAttribute('aria-label', text.replace(/ /g, ' '));
    el.textContent = '';
    text.split(' ').forEach((word, i, arr) => {
      const outer = document.createElement('span');
      outer.className = 'w';
      outer.setAttribute('aria-hidden', 'true');
      const inner = document.createElement('span');
      inner.textContent = word;
      inner.style.setProperty('--i', i);
      outer.appendChild(inner);
      el.appendChild(outer);
      if (i < arr.length - 1) el.appendChild(document.createTextNode(' '));
    });
  };
  document.querySelectorAll('[data-split]').forEach(splitWords);
  requestAnimationFrame(() => root.classList.add('is-loaded'));

  /* ---------- Lazy videos: load and play only while on screen ---------- */
  const lazyVideos = document.querySelectorAll('[data-lazy-video]');
  const loadVideo = (v) => {
    if (v.dataset.loaded) return;
    v.querySelectorAll('source[data-src]').forEach((s) => { s.src = s.dataset.src; });
    v.load();
    v.dataset.loaded = '1';
  };
  if (!reduce && 'IntersectionObserver' in window) {
    const vio = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) { loadVideo(target); target.play().catch(() => {}); }
        else if (target.dataset.loaded) target.pause();
      });
    }, { threshold: 0.2 });
    // Wait for the page to settle so the film never competes with first paint.
    window.addEventListener('load', () => lazyVideos.forEach((v) => vio.observe(v)), { once: true });
  }

  /* ---------- Reveal once ---------- */
  const revealTargets = document.querySelectorAll('[data-reveal], [data-reveal-img]');
  if (!reduce && 'IntersectionObserver' in window) {
    const rio = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        target.classList.add('is-in');
        rio.unobserve(target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    revealTargets.forEach((el, i) => { el.style.setProperty('--i', i % 3); rio.observe(el); });
  } else {
    revealTargets.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- Nav hides on the way down, returns on the way up ---------- */
  const nav = document.querySelector('[data-nav]');
  let lastY = window.scrollY;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (nav) nav.classList.toggle('is-hidden', y > lastY && y > 240);
      lastY = y;
      ticking = false;
    });
  }, { passive: true });
  if (nav) nav.addEventListener('focusin', () => nav.classList.remove('is-hidden'));

  /* ---------- Demo player (videos behind a button) ---------- */
  const player = document.querySelector('[data-player]');
  let lenis = null;
  if (player) {
  const playerVideo = player.querySelector('[data-player-video]');
  const playerTitle = player.querySelector('[data-player-title]');
  document.querySelectorAll('[data-play]').forEach((btn) => {
    btn.addEventListener('click', () => {
      playerVideo.src = btn.dataset.play;
      playerVideo.poster = btn.dataset.poster || '';
      playerTitle.textContent = btn.dataset.title || 'Demo';
      player.showModal();
      if (lenis) lenis.stop();
      playerVideo.play().catch(() => {});
    });
  });
  const closePlayer = () => player.close();
  player.querySelector('[data-player-close]').addEventListener('click', closePlayer);
  player.addEventListener('click', (e) => { if (e.target === player) closePlayer(); });
  player.addEventListener('close', () => {
    playerVideo.pause();
    playerVideo.removeAttribute('src');
    playerVideo.load();
    if (lenis) lenis.start();
  });
  }


  /* ---------- Email menu: mailto alone fails without a desktop mail app ---------- */
  const mailLinks = document.querySelectorAll('a[href^="mailto:"]');
  if (mailLinks.length) {
    const menu = document.createElement('div');
    menu.className = 'mailmenu';
    menu.hidden = true;
    menu.setAttribute('role', 'menu');
    menu.innerHTML = `
      <p class="mailmenu__addr" data-mail-addr></p>
      <button type="button" role="menuitem" class="mailmenu__item" data-mail-copy>Copy address</button>
      <a role="menuitem" class="mailmenu__item" data-mail-gmail target="_blank" rel="noopener noreferrer">Open in Gmail</a>
      <a role="menuitem" class="mailmenu__item" data-mail-app>Open mail app</a>
      <p class="mailmenu__status" role="status" aria-live="polite" data-mail-status></p>`;
    document.body.appendChild(menu);
    const addrEl = menu.querySelector('[data-mail-addr]');
    const copyBtn = menu.querySelector('[data-mail-copy]');
    const gmail = menu.querySelector('[data-mail-gmail]');
    const app = menu.querySelector('[data-mail-app]');
    const status = menu.querySelector('[data-mail-status]');
    let opener = null;

    const close = (refocus) => {
      if (menu.hidden) return;
      menu.hidden = true;
      if (opener) opener.setAttribute('aria-expanded', 'false');
      if (refocus && opener) opener.focus();
      opener = null;
    };
    const open = (link) => {
      const address = decodeURIComponent(link.getAttribute('href').slice(7).split('?')[0]);
      addrEl.textContent = address;
      status.textContent = '';
      gmail.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(address)}`;
      app.href = `mailto:${address}`;
      menu.hidden = false;
      const r = link.getBoundingClientRect();
      const w = menu.offsetWidth;
      const left = Math.min(Math.max(16, r.left), window.innerWidth - w - 16);
      const below = r.bottom + 8 + menu.offsetHeight < window.innerHeight;
      menu.style.left = `${left}px`;
      menu.style.top = below ? `${r.bottom + 8}px` : `${Math.max(16, r.top - menu.offsetHeight - 8)}px`;
      opener = link;
      link.setAttribute('aria-expanded', 'true');
      copyBtn.focus({ preventScroll: true });
    };

    mailLinks.forEach((link) => {
      link.setAttribute('aria-haspopup', 'menu');
      link.setAttribute('aria-expanded', 'false');
      link.addEventListener('click', (e) => {
        e.preventDefault();
        if (opener === link) { close(false); return; }
        close(false);
        open(link);
      });
    });
    copyBtn.addEventListener('click', async () => {
      const text = addrEl.textContent;
      try {
        await navigator.clipboard.writeText(text);
        status.textContent = 'Copied to your clipboard.';
      } catch (err) {
        const range = document.createRange();
        range.selectNodeContents(addrEl);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        status.textContent = 'Press Ctrl+C to copy.';
      }
    });
    [gmail, app].forEach((a) => a.addEventListener('click', () => setTimeout(() => close(false), 0)));
    document.addEventListener('pointerdown', (e) => {
      if (!menu.hidden && !menu.contains(e.target) && e.target.closest('a[href^="mailto:"]') !== opener) close(false);
    });
    document.addEventListener('keydown', (e) => {
      if (menu.hidden) return;
      if (e.key === 'Escape') { close(true); return; }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const items = [...menu.querySelectorAll('[role="menuitem"]')];
        const i = items.indexOf(document.activeElement);
        items[(i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length].focus();
      }
    });
    menu.addEventListener('focusout', (e) => { if (!menu.contains(e.relatedTarget) && e.relatedTarget !== opener) close(false); });
    window.addEventListener('scroll', () => close(false), { passive: true });
    window.addEventListener('resize', () => close(false));
  }

  if (reduce) return;

  /* ---------- Smooth scroll ---------- */
  if (typeof window.Lenis !== 'undefined') {
    lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        const target = id === '#top' ? 0 : document.querySelector(id);
        if (target === null) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: id === '#top' ? 0 : -80 });
        if (id !== '#top') history.replaceState(null, '', id);
      });
    });
    if (hasGsap) {
      lenis.on('scroll', window.ScrollTrigger.update);
      window.gsap.ticker.add((t) => lenis.raf(t * 1000));
      window.gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  /* ---------- Scroll effects ---------- */
  if (hasGsap) {
    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    // 1. The hero film grows from its column to the full measure while the claim lifts away.
    mm.add('(min-width: 64.01rem) and (min-height: 600px)', () => {
      const hero = document.querySelector('[data-hero]');
      if (!hero) return;
      const frame = hero.querySelector('[data-hero-media] .frame');
      const container = hero.querySelector('.hero__grid');
      const fades = hero.querySelectorAll('.hero__head, .hero__aside, .hero__caption');
      const nav = document.querySelector('[data-nav]');

      // Layout positions (offsets ignore transforms), measured as if the hero sits at the top of the screen.
      const offsetIn = (el, stop) => { let x = 0, y = 0; while (el && el !== stop) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; } return { x, y }; };
      const target = () => {
        const o = offsetIn(frame, hero);
        const fw = frame.offsetWidth, fh = frame.offsetHeight;
        const cs = getComputedStyle(container);
        const innerL = container.offsetLeft + parseFloat(cs.paddingLeft);
        const innerW = container.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
        const top = nav.offsetHeight + 24;
        const s = Math.min(innerW / fw, (window.innerHeight - top - 24) / fh);
        return { s, x: innerL + innerW / 2 - (o.x + fw / 2), y: top + (fh * s) / 2 - (o.y + fh / 2) };
      };

      const tl = gsap.timeline({
        scrollTrigger: { trigger: hero, start: 'top top', end: '+=90%', pin: true, scrub: 0.6, invalidateOnRefresh: true },
        defaults: { ease: 'none' },
      });
      tl.fromTo(fades, { y: 0, autoAlpha: 1 }, { y: -60, autoAlpha: 0, stagger: 0.04, duration: 0.5, immediateRender: false }, 0)
        .fromTo(frame, { scale: 1, x: 0, y: 0 }, { immediateRender: false, scale: () => target().s, x: () => target().x, y: () => target().y, duration: 1 }, 0);
      return () => tl.kill();
    });

    // 3. The process steps run sideways while the section holds still.
    mm.add('(min-width: 64.01rem) and (min-height: 700px)', () => {
      const flow = document.querySelector('[data-flow]');
      if (!flow) return;
      const track = flow.querySelector('[data-flow-track]');
      const bar = flow.querySelector('[data-flow-bar]');
      flow.classList.add('is-horizontal');
      const distance = () => Math.max(0, track.scrollWidth - track.parentElement.clientWidth);
      const tl = gsap.timeline({
        scrollTrigger: { trigger: flow, start: 'top top', end: () => `+=${distance()}`, pin: true, scrub: 0.5, invalidateOnRefresh: true },
        defaults: { ease: 'none' },
      });
      tl.fromTo(track, { x: 0 }, { x: () => -distance() }, 0)
        .fromTo(bar, { scaleX: 0 }, { scaleX: 1 }, 0);
      ScrollTrigger.refresh();
      return () => { tl.kill(); flow.classList.remove('is-horizontal'); gsap.set(track, { clearProps: 'transform' }); };
    });

    // 2. The statement resolves word by word as it crosses the screen.
    const statement = document.querySelector('[data-scrub]');
    if (statement) {
      const words = statement.textContent.split(' ');
      statement.setAttribute('aria-label', statement.textContent);
      statement.textContent = '';
      words.forEach((w, i) => {
        const s = document.createElement('span');
        s.className = 'w';
        s.setAttribute('aria-hidden', 'true');
        s.textContent = w;
        statement.appendChild(s);
        if (i < words.length - 1) statement.appendChild(document.createTextNode(' '));
      });
      gsap.fromTo(statement.querySelectorAll('.w'), { opacity: 0.14 }, {
        opacity: 1, stagger: 0.08, ease: 'none',
        scrollTrigger: { trigger: statement, start: 'top 80%', end: 'bottom 45%', scrub: true },
      });
    }

    // Recalculate once fonts and images settle.
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
    if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
  }

  /* ---------- Fine pointer extras: cursor and the index preview ---------- */
  if (!finePointer) return;

  const cursor = document.querySelector('[data-cursor-el]');
  const label = document.querySelector('[data-cursor-label]');
  root.classList.add('has-cursor');
  let mx = -100, my = -100, cx = -100, cy = -100;
  window.addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
  document.addEventListener('pointerleave', () => cursor.classList.add('is-hidden'));
  document.addEventListener('pointerenter', () => cursor.classList.remove('is-hidden'));
  const loop = () => {
    cx += (mx - cx) * 0.22;
    cy += (my - cy) * 0.22;
    cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  document.querySelectorAll('[data-cursor]').forEach((el) => {
    el.addEventListener('pointerenter', () => { label.textContent = el.dataset.cursor; cursor.classList.add('is-big'); });
    el.addEventListener('pointerleave', () => cursor.classList.remove('is-big'));
  });

  const preview = document.querySelector('[data-preview-float]');
  if (!preview) return;
  const previewImg = preview.querySelector('img');
  const section = preview.parentElement;
  let px = 0, py = 0, tx = 0, ty = 0, running = false;
  const follow = () => {
    px += (tx - px) * 0.14;
    py += (ty - py) * 0.14;
    preview.style.translate = `${px}px ${py}px`;
    if (running) requestAnimationFrame(follow);
  };
  document.querySelectorAll('[data-preview]').forEach((row) => {
    const img = new Image();
    img.src = row.dataset.preview; // warm the cache
    row.addEventListener('pointerenter', () => {
      previewImg.src = row.dataset.preview;
      preview.classList.add('is-on');
      if (!running) { running = true; requestAnimationFrame(follow); }
    });
    row.addEventListener('pointerleave', () => { preview.classList.remove('is-on'); running = false; });
  });
  section.addEventListener('pointermove', (e) => {
    const r = section.getBoundingClientRect();
    tx = e.clientX - r.left + 40;
    ty = e.clientY - r.top;
    if (!preview.classList.contains('is-on')) { px = tx; py = ty; }
  }, { passive: true });
})();
