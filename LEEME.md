# Propuesta web · Dr. Mario Segnini (Gloz Studio)

Página principal: `index.html`, la dirección de arte 3 (blanco y azul profundo).
Versiones anteriores: `direccion-de-arte.html` (1) y `direccion-de-arte-2.html` (2).

## Publicar en GitHub Pages (5 minutos)
1. En github.com, crea un repositorio nuevo, por ejemplo `propuesta-segnini`. Debe ser **público**, porque Pages gratis solo funciona con repositorios públicos.
2. En esta carpeta, conéctalo y súbelo:
   ```
   git remote add origin https://github.com/TU_USUARIO/propuesta-segnini.git
   git push -u origin main
   ```
3. En el repositorio, entra a **Settings → Pages**. En **Source** elige *Deploy from a branch*, luego la rama `main` y la carpeta `/ (root)`, y guarda.
4. Al cabo de 1 o 2 minutos queda en `https://holaagloz.github.io/clinica/`.
5. Para que WhatsApp muestre la vista previa, cambia en `index.html` la línea `og:image` por la dirección completa: `https://holaagloz.github.io/clinica/img/v3/og-imagen.jpg`.

## Por validar
- Fotos y casos tomados del Instagram del doctor. Hay que confirmar el permiso para usarlos.
- El retrato del doctor mide 625 px: para la web final conviene uno en alta resolución.
- Los testimonios y el dominio siguen pendientes.
- La página no aparece en buscadores (`noindex`) porque es una propuesta privada.

## Técnico
- HTML, CSS y JS sin compilación. GSAP 3.13.0, ScrollTrigger y Lenis 1.3.11 van en `vendor/`.
- Fuentes de Google Fonts: Manrope y Cinzel.
- Si cambias el CSS o el JS, sube el número `?v=` en el HTML para que los navegadores no muestren la versión vieja.
