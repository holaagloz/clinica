/* Dirección de arte · Dr. Mario Segnini · Gloz Studio */
(() => {
  'use strict';

  /* ---------- 1. Ayudantes, banderas y tokens ---------- */
  const d = document;
  const html = d.documentElement;
  const $ = (s, c = d) => c.querySelector(s);
  const $$ = (s, c = d) => [...c.querySelectorAll(s)];
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const hasSplit = typeof window.SplitText !== 'undefined';
  const safe = (fn) => { try { fn(); } catch (e) { console.warn('[propuesta]', e); } };

  // Lujoso y editorial: curva larga sin rebote, recorridos cortos, inercia pausada.
  const M = { ease: 'power4.out', easeIO: 'power2.inOut', dur: 1.4, stagger: 0.14, dist: 24, lerp: 0.07 };

  // 4573 -> "4.573"; 92.6 -> "92,6"
  const fmt = (n, dec = 0) => {
    const [ent, frac] = n.toFixed(dec).split('.');
    const conPuntos = ent.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return frac ? `${conPuntos},${frac}` : conPuntos;
  };

  const portada = $('[data-portada]');
  const repetir = $('[data-ver-de-nuevo]');

  if (!hasGSAP) {
    html.classList.remove('js');
    if (repetir) repetir.hidden = true;
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  if (hasSplit) gsap.registerPlugin(SplitText);
  ScrollTrigger.config({ ignoreMobileResize: true });

  /* ---------- 2. Lenis ---------- */
  let lenis = null;
  safe(() => {
    if (RM || !window.Lenis || !M.lerp) return;
    lenis = new Lenis({ lerp: M.lerp, smoothWheel: true, wheelMultiplier: 1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  });

  const irA = (el, instant) => {
    if (lenis) lenis.scrollTo(el, { offset: 0, duration: instant ? 0 : 1.6, immediate: !!instant });
    else el.scrollIntoView({ behavior: RM || instant ? 'auto' : 'smooth' });
  };

  /* ---------- 3. Funcional, con o sin movimiento ---------- */
  safe(() => {
    d.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const hash = a.getAttribute('href');
      const el = hash.length > 1 && d.getElementById(hash.slice(1));
      if (!el) return;
      e.preventDefault();
      irA(el);
    });
  });

  /* ---------- 4. Firma de la portada ---------- */
  // Las esquinas del marco se dibujan, el retrato sale del negro, el titular sube por renglones
  // y el arco de sonrisa se traza de izquierda a derecha; el botón se llena en esa misma dirección.
  let splits = [];
  const limpiarSplits = () => { splits.forEach((s) => s.revert()); splits = []; };

  const prepararTrazo = (path) => {
    const L = path.getTotalLength();
    gsap.set(path, { strokeDasharray: L, strokeDashoffset: L });
    return L;
  };

  function firmaPortada() {
    limpiarSplits();
    const P = portada;
    const titulo = $('[data-titulo]', P);
    const nombre = $('[data-marca]', P);
    const esquinas = $$('[data-esquinas] i', P);
    const arcoSvg = $('[data-arco]', P);
    const punto = $('[data-arco] circle', P);
    const foto = $('[data-foto]', P);
    const img = $('img', foto);
    const boton = $('[data-boton]', P);
    const piezas = $$('[data-pieza]', P);

    let lineas = [titulo];
    let letras = [nombre];
    if (hasSplit) {
      const st = SplitText.create(titulo, { type: 'lines', mask: 'lines', linesClass: 'tl' });
      const sn = SplitText.create(nombre, { type: 'chars' });
      splits.push(st, sn);
      lineas = st.lines;
      letras = sn.chars;
    }

    gsap.set(esquinas, { scale: 0 });
    gsap.set(arcoSvg, { clipPath: 'inset(-20% 100% -20% 0%)' });
    gsap.set([titulo, nombre, boton, foto, arcoSvg, $('[data-esquinas]', P)], { visibility: 'visible' });
    gsap.set(lineas, { yPercent: 115 });
    gsap.set(letras, { autoAlpha: 0, y: 10 });
    gsap.set(piezas, { autoAlpha: 0, y: M.dist * 0.6 });
    gsap.set(punto, { autoAlpha: 0, scale: 0, transformOrigin: '50% 50%' });
    gsap.set(foto, { clipPath: 'inset(100% 0% 0% 0%)' });
    gsap.set(img, { scale: 1.14 });
    gsap.set(boton, { clipPath: 'inset(0% 100% 0% 0%)' });
    P.classList.add('portada--lista');

    const tl = gsap.timeline({ defaults: { ease: M.ease }, onComplete: limpiarSplits });
    tl.to(esquinas, { scale: 1, duration: 1.1, stagger: 0.12, ease: M.easeIO }, 0)
      .to(letras, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.04 }, 0.15)
      .to(foto, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.7, ease: M.easeIO }, 0.3)
      .to(img, { scale: 1, duration: 2.4 }, 0.3)
      .to(lineas, { yPercent: 0, duration: M.dur, stagger: M.stagger }, 0.5)
      .to(arcoSvg, { clipPath: 'inset(-20% 0% -20% 0%)', duration: 1.15, ease: M.easeIO }, 1.2)
      .to(punto, { autoAlpha: 1, scale: 1, duration: 0.5 }, 2.25)
      .to(boton, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.95, ease: M.easeIO }, 1.85)
      .to(piezas, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.06 }, 1.45);

    // Se salta con un toque o una tecla.
    const saltar = () => { if (tl.isActive()) tl.progress(1); };
    d.addEventListener('pointerdown', saltar, { once: true });
    d.addEventListener('keydown', saltar, { once: true });
    return tl;
  }

  /* Con "Reducir movimiento": nada corre solo y "Ver de nuevo" solo funde. */
  if (RM) {
    safe(() => {
      const aviso = $('[data-aviso-rm]');
      if (aviso) aviso.hidden = false;
      portada.classList.add('portada--lista');
      if (repetir) repetir.addEventListener('click', () => {
        irA(portada, true);
        gsap.fromTo('[data-portada] [data-pieza], [data-portada] [data-titulo], [data-portada] [data-boton], [data-portada] [data-foto]',
          { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, stagger: 0.08, ease: 'none' });
      });
    });
    return;
  }

  let tlPortada = null;
  safe(() => {
    const listo = d.fonts ? d.fonts.ready : Promise.resolve();
    Promise.race([listo, new Promise((r) => setTimeout(r, 1200))]).then(() => safe(() => { tlPortada = firmaPortada(); }));
    if (repetir) repetir.addEventListener('click', () => {
      irA(portada, true);
      if (tlPortada) tlPortada.kill();
      tlPortada = firmaPortada();
    });
  });

  /* ---------- 5. Contadores ---------- */
  const contar = (el, opts = {}) => {
    const fin = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.dec || '0', 10);
    const o = { v: 0 };
    return gsap.to(o, {
      v: fin, duration: opts.duration || 1.6, ease: opts.ease || 'power3.out',
      onUpdate: () => { el.textContent = fmt(o.v, dec); },
      paused: !!opts.paused,
    });
  };

  /* ---------- 6. Escena de razones ---------- */
  safe(() => {
    const escena = $('[data-escena]');
    const items = $$('[data-razon]', escena);
    const mm = gsap.matchMedia();

    // Escritorio: la escena queda fija y las razones se relevan con el scroll.
    mm.add('(min-width: 960px)', () => {
      escena.classList.add('is-escena');
      const avance = $('[data-progreso] .avance', escena);
      const L = avance.getTotalLength();
      gsap.set(avance, { strokeDasharray: L, strokeDashoffset: L });
      items.forEach((it, i) => gsap.set($$('[data-r]', it), { autoAlpha: i === 0 ? 1 : 0 }));

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: escena, start: 'top top', end: 'bottom bottom', scrub: 0.8 },
      });
      tl.to(avance, { strokeDashoffset: 0, duration: items.length }, 0);
      items.forEach((it, i) => {
        if (i === 0) return;
        const prev = $$('[data-r]', items[i - 1]);
        const cur = $$('[data-r]', it);
        // Sin cruce: la razón anterior termina de salir antes de que entre la nueva.
        tl.to(prev, { autoAlpha: 0, y: -M.dist, duration: 0.24, stagger: 0.02 }, i - 0.36)
          .fromTo(cur, { autoAlpha: 0, y: M.dist }, { autoAlpha: 1, y: 0, duration: 0.34, stagger: 0.05 }, i);
        const n = $('[data-count]', it);
        if (n) {
          const fin = parseFloat(n.dataset.count);
          const dec = parseInt(n.dataset.dec || '0', 10);
          const o = { v: 0 };
          tl.fromTo(o, { v: 0 }, { v: fin, duration: 0.5, onUpdate: () => { n.textContent = fmt(o.v, dec); } }, i + 0.1);
        }
      });
      tl.to({}, { duration: 0.4 });

      // La primera cifra cuenta al entrar.
      const n0 = $('[data-count]', items[0]);
      if (n0) {
        n0.textContent = '0';
        const c = contar(n0, { paused: true });
        ScrollTrigger.create({ trigger: escena, start: 'top 75%', once: true, onEnter: () => c.play() });
      }
      return () => escena.classList.remove('is-escena');
    });

    // Celular: cada razón aparece al llegar y su cifra cuenta.
    mm.add('(max-width: 959.98px)', () => {
      items.forEach((it) => {
        const partes = $$('[data-r]', it);
        gsap.set(partes, { autoAlpha: 0, y: M.dist });
        const n = $('[data-count]', it);
        const c = n ? contar(n, { paused: true }) : null;
        if (n) n.textContent = '0';
        ScrollTrigger.create({
          trigger: it, start: 'top 80%', once: true,
          onEnter: () => {
            gsap.to(partes, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.1, ease: M.ease });
            if (c) c.play();
          },
        });
      });
    });
  });

  /* ---------- 7. Títulos por renglones ---------- */
  safe(() => {
    $$('[data-split]').forEach((el) => {
      if (!hasSplit) {
        gsap.from(el, { autoAlpha: 0, y: M.dist, duration: 1.1, ease: M.ease, scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
        return;
      }
      SplitText.create(el, {
        type: 'lines', mask: 'lines', linesClass: 'tl', autoSplit: true,
        onSplit: (self) => gsap.from(self.lines, {
          yPercent: 115, duration: M.dur, stagger: M.stagger, ease: M.ease,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        }),
      });
    });
  });

  /* ---------- 8. Revelados ---------- */
  safe(() => {
    $$('[data-reveal]').forEach((el) => {
      gsap.from(el, { autoAlpha: 0, y: M.dist, duration: 1.2, ease: M.ease, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });
    // Fotos del proceso: se abren desde abajo y bajan de escala.
    $$('[data-clip]').forEach((el) => {
      const img = $('img', el);
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 82%', once: true } });
      tl.from(el, { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.5, ease: M.easeIO })
        .from(img, { scale: 1.14, duration: 2.2, ease: M.ease }, 0);
    });
    // Tratamientos: uno tras otro.
    const lista = $('[data-lista]');
    if (lista) gsap.from(lista.children, { autoAlpha: 0, y: 12, duration: 0.9, stagger: 0.07, ease: M.ease, scrollTrigger: { trigger: lista, start: 'top 85%', once: true } });
    // Paleta: las bandas se despliegan desde la izquierda.
    const bandas = $('[data-bandas]');
    if (bandas) gsap.from(bandas.children, { clipPath: 'inset(0% 100% 0% 0%)', duration: 1.3, stagger: 0.1, ease: M.easeIO, scrollTrigger: { trigger: bandas, start: 'top 80%', once: true } });
  });

  /* ---------- 9. Trazos que se dibujan ---------- */
  safe(() => {
    const dibujar = (svg, delay = 0) => {
      if (svg.hasAttribute('data-trazo-clip')) {   // trazo de grosor fijo: se descubre de izquierda a derecha
        return gsap.fromTo(svg, { clipPath: 'inset(-20% 100% -20% 0%)' }, { clipPath: 'inset(-20% 0% -20% 0%)', duration: 1.3, delay, ease: M.easeIO });
      }
      const paths = $$('path', svg);
      paths.forEach(prepararTrazo);
      const tl = gsap.timeline({ delay });
      tl.to(paths, { strokeDashoffset: 0, duration: 1.3, stagger: 0.12, ease: M.easeIO });
      const c = $('circle', svg);
      if (c) tl.fromTo(c, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.5, ease: M.ease }, '-=0.2');
      return tl;
    };
    const svgs = $$('[data-draw]');
    svgs.forEach((svg) => {
      if (svg.hasAttribute('data-trazo-clip')) gsap.set(svg, { clipPath: 'inset(-20% 100% -20% 0%)' });
      else $$('path', svg).forEach(prepararTrazo);
      ScrollTrigger.create({ trigger: svg, start: 'top 85%', once: true, onEnter: () => dibujar(svg) });
    });
    const boton = $('[data-ver-elementos]');
    if (boton) boton.addEventListener('click', () => {
      $$('.elementos [data-draw]').forEach((svg, i) => dibujar(svg, i * 0.15));
    });
  });

  /* ---------- 10. Arranque ---------- */
  addEventListener('load', () => ScrollTrigger.refresh());
})();
