/* Dirección de arte 2 · Dr. Mario Segnini · Gloz Studio
   Sin revelados al hacer scroll: el contenido siempre está. El movimiento vive en
   la portada (la banda de sonrisa se abre), la cinta de cifras y el comparador. */
(() => {
  'use strict';
  const d = document;
  const html = d.documentElement;
  const $ = (s, c = d) => c.querySelector(s);
  const $$ = (s, c = d) => [...c.querySelectorAll(s)];
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined';
  const safe = (fn) => { try { fn(); } catch (e) { console.warn('[propuesta-2]', e); } };
  const M = { ease: 'expo.out', easeIO: 'power3.inOut', lerp: 0.1 };

  const portada = $('[data-portada]');
  const repetir = $('[data-ver-de-nuevo]');

  /* ---------- Comparador antes / después (funciona siempre) ---------- */
  safe(() => {
    $$('[data-comparador]').forEach((c) => {
      const control = $('.comparador__control', c);
      const pon = (v) => c.style.setProperty('--pos', `${v}%`);
      control.addEventListener('input', () => pon(control.value));
      // En pantallas táctiles, tocar en cualquier punto mueve la línea.
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
    lenis = new Lenis({ lerp: M.lerp, smoothWheel: true });
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  });
  safe(() => {
    d.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const el = a.getAttribute('href').length > 1 && d.getElementById(a.getAttribute('href').slice(1));
      if (!el) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(el, { duration: 1.4 }); else el.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' });
    });
  });

  /* ---------- Firma: la banda de sonrisa se abre ---------- */
  // Una línea blanca cruza la pantalla, se abre en una franja y deja ver la sonrisa a color
  // sobre el retrato en blanco y negro. El titular se escribe en sus dos pesos y termina el botón.
  function firma() {
    const P = portada;
    const doctor = $('[data-doctor]', P);
    const fotoDoc = $('img', doctor);
    const banda = $('[data-banda]', P);
    const fotoBanda = $('img', banda);
    const lineas = $$('[data-linea]', P);
    const pie = $$('[data-pie]', P);

    gsap.set([doctor, banda, $('[data-titulo]', P), ...pie], { visibility: 'visible' });
    gsap.set(doctor, { clipPath: 'inset(0% 0% 100% 0%)' });
    gsap.set(fotoDoc, { scale: 1.12 });
    gsap.set(banda, { clipPath: 'inset(50% 0% 50% 0%)' });
    gsap.set(fotoBanda, { scale: 1.18 });
    gsap.set(lineas, { autoAlpha: 0, y: 26 });
    gsap.set(pie, { autoAlpha: 0 });
    P.classList.add('portada--lista');

    const tl = gsap.timeline({ defaults: { ease: M.ease } });
    tl.to(doctor, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: M.easeIO }, 0)
      .to(fotoDoc, { scale: 1, duration: 2 }, 0)
      .fromTo(banda, { clipPath: 'inset(50% 100% 50% 0%)' }, { clipPath: 'inset(50% 0% 50% 0%)', duration: 0.7, ease: M.easeIO }, 0.55)
      .to(banda, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: M.easeIO }, 1.2)
      .to(fotoBanda, { scale: 1, duration: 2.2 }, 1.2)
      .to(lineas, { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.12 }, 1.35)
      .to(pie, { autoAlpha: 1, duration: 0.9, stagger: 0.1, ease: 'power2.out' }, 1.9);

    const saltar = () => { if (tl.isActive()) tl.progress(1); };
    d.addEventListener('pointerdown', saltar, { once: true });
    d.addEventListener('keydown', saltar, { once: true });
    return tl;
  }

  const irArriba = () => { if (lenis) lenis.scrollTo(0, { immediate: true }); else scrollTo(0, 0); };

  if (RM) {
    safe(() => {
      const aviso = $('[data-aviso-rm]');
      if (aviso) aviso.hidden = false;
      portada.classList.add('portada--lista');
      if (repetir) repetir.addEventListener('click', () => {
        irArriba();
        gsap.fromTo('[data-portada] :is([data-doctor],[data-banda],[data-titulo],[data-pie])', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, stagger: 0.1, ease: 'none' });
      });
    });
    return;
  }

  let tl = null;
  safe(() => {
    const listo = d.fonts ? d.fonts.ready : Promise.resolve();
    Promise.race([listo, new Promise((r) => setTimeout(r, 1200))]).then(() => safe(() => { tl = firma(); }));
    if (repetir) repetir.addEventListener('click', () => { irArriba(); if (tl) tl.restart(); });
  });

  /* ---------- Pista del comparador: un vaivén corto, una sola vez ---------- */
  safe(() => {
    const c = $('[data-comparador]');
    if (!c || !('IntersectionObserver' in window)) return;
    const control = $('.comparador__control', c);
    const io = new IntersectionObserver((entradas) => {
      if (!entradas[0].isIntersecting) return;
      io.disconnect();
      const o = { v: 50 };
      gsap.timeline({ delay: 0.3 })
        .to(o, { v: 32, duration: 0.8, ease: 'power2.inOut', onUpdate: () => { c.style.setProperty('--pos', `${o.v}%`); control.value = o.v; } })
        .to(o, { v: 50, duration: 0.9, ease: 'power2.inOut', onUpdate: () => { c.style.setProperty('--pos', `${o.v}%`); control.value = o.v; } });
    }, { threshold: 0.6 });
    io.observe(c);
  });
})();
