/* Dirección de arte 3 · Dr. Mario Segnini · Gloz Studio
   Sin efectos al hacer scroll. El movimiento vive en la portada: el retrato se abre y
   las etiquetas llegan una tras otra, como mensajes de una conversación. */
(() => {
  'use strict';
  const d = document;
  const html = d.documentElement;
  const $ = (s, c = d) => c.querySelector(s);
  const $$ = (s, c = d) => [...c.querySelectorAll(s)];
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined';
  const safe = (fn) => { try { fn(); } catch (e) { console.warn('[propuesta-3]', e); } };

  const portada = $('[data-portada]');
  const repetir = $('[data-ver-de-nuevo]');

  /* ---------- Comparador antes / después (siempre funciona) ---------- */
  safe(() => {
    $$('[data-comparador]').forEach((c) => {
      const control = $('.comparador__control', c);
      const pon = (v) => c.style.setProperty('--pos', `${v}%`);
      control.addEventListener('input', () => pon(control.value));
      c.addEventListener('pointerdown', (e) => {
        const r = c.getBoundingClientRect();
        const v = Math.round(((e.clientX - r.left) / r.width) * 100);
        control.value = v; pon(v);
      });
    });
  });

  if (!hasGSAP) {
    html.classList.remove('js');
    if (repetir) repetir.hidden = true;
    return;
  }

  /* ---------- Scroll suave ---------- */
  let lenis = null;
  safe(() => {
    if (RM || !window.Lenis) return;
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  });
  safe(() => {
    d.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href').slice(1);
      const el = id && d.getElementById(id);
      if (!el) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(el, { offset: -44, duration: 1.3 }); else el.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' });
    });
  });

  const irArriba = () => { if (lenis) lenis.scrollTo(0, { immediate: true }); else scrollTo(0, 0); };

  /* ---------- Firma: la conversación ---------- */
  // El retrato entra en foco (como cuando alguien te mira), el titular sube,
  // la cápsula se dibuja detrás de "sonrisa" y las etiquetas llegan como mensajes.
  function firma() {
    const P = portada;
    const lineas = $$('[data-linea]', P);
    const piezas = $$('[data-pieza]', P);
    const retrato = $('[data-retrato]', P);
    const capsula = $('[data-capsula]', P);
    const burbujas = $$('[data-burbuja]', P);

    gsap.set([$('[data-titulo]', P), retrato, ...piezas, ...burbujas], { visibility: 'visible' });
    gsap.set(retrato, { autoAlpha: 0, scale: 1.08, filter: 'blur(14px)' });
    gsap.set(lineas, { autoAlpha: 0, y: 30 });
    gsap.set(capsula, { '--k': 0 });
    gsap.set(piezas, { autoAlpha: 0, y: 16 });
    gsap.set(burbujas, { autoAlpha: 0, scale: 0.7, y: 12, transformOrigin: '0% 100%' });
    P.classList.add('portada--lista');

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.to(retrato, { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 1.8, ease: 'power3.out' }, 0)
      .to(lineas, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.12 }, 0.55)
      .to(capsula, { '--k': 1, duration: 0.9, ease: 'power3.inOut' }, 1.05)
      .to(piezas, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1 }, 1.2)
      .to(burbujas, { autoAlpha: 1, scale: 1, y: 0, duration: 0.7, stagger: 0.3, ease: 'back.out(1.6)' }, 1.6)
      .set(retrato, { clearProps: 'filter' });

    const saltar = () => { if (tl.isActive()) tl.progress(1); };
    d.addEventListener('pointerdown', saltar, { once: true });
    d.addEventListener('keydown', saltar, { once: true });
    return tl;
  }

  if (RM) {
    safe(() => {
      const aviso = $('[data-aviso-rm]');
      if (aviso) aviso.hidden = false;
      portada.classList.add('portada--lista');
      if (repetir) repetir.addEventListener('click', () => {
        irArriba();
        gsap.fromTo('[data-portada] :is([data-titulo],[data-pieza],[data-retrato],[data-burbuja])', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, stagger: 0.08, ease: 'none' });
      });
    });
    return;
  }

  /* ---------- Frase: las palabras suben animadas al entrar en pantalla (una sola vez) ---------- */
  safe(() => {
    const p = $('[data-llenar]');
    if (!p || !('IntersectionObserver' in window)) return;
    p.innerHTML = p.textContent.trim().split(/\s+/).map((w) => `<span class="palabra"><span>${w}</span></span>`).join(' ');
    const palabras = $$('.palabra > span', p);
    gsap.set(palabras, { yPercent: 110, autoAlpha: 0 });
    const io = new IntersectionObserver((e) => {
      if (!e[0].isIntersecting) return;
      io.disconnect();
      gsap.to(palabras, { yPercent: 0, autoAlpha: 1, duration: 1, stagger: 0.035, ease: 'expo.out' });
    }, { threshold: 0.25 });
    io.observe(p);
    // Respaldo: si por algo no llega a dispararse, la frase se muestra igual.
    setTimeout(() => { if (palabras[0] && gsap.getProperty(palabras[0], 'autoAlpha') === 0 && p.getBoundingClientRect().top < innerHeight) gsap.set(palabras, { yPercent: 0, autoAlpha: 1 }); }, 4000);
  });

  let tl = null;
  safe(() => {
    const listo = d.fonts ? d.fonts.ready : Promise.resolve();
    Promise.race([listo, new Promise((r) => setTimeout(r, 1200))]).then(() => safe(() => { tl = firma(); }));
    if (repetir) repetir.addEventListener('click', () => { irArriba(); if (tl) tl.restart(); });
  });
})();
