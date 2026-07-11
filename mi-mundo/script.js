/* =========================================================
   UN VIAJE A MI MUNDO — script.js
   Navegación, scroll reveal, modal de imágenes, video slots,
   placeholders de imagen, masonry y utilidades varias.
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     1. Año automático en el footer
  --------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     2. Navbar: fondo al hacer scroll + menú móvil
  --------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const progressBar = document.getElementById('progressBar');
  const backToTop = document.getElementById('backToTop');

  function onScroll() {
    const y = window.scrollY;
    navbar.classList.toggle('is-scrolled', y > 40);
    backToTop.classList.toggle('is-visible', y > 500);

    // Barra de progreso de lectura
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (y / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------------------------------------------------------
     3. Indicador de sección activa en la barra de navegación
  --------------------------------------------------------- */
  const sections = document.querySelectorAll('main > section[id]');
  const navAnchors = document.querySelectorAll('.nav-link[data-nav]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(sec => sectionObserver.observe(sec));

  /* ---------------------------------------------------------
     4. Animaciones al aparecer (scroll reveal)
  --------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // pequeño desfase para un efecto escalonado dentro de la misma sección
        setTimeout(() => entry.target.classList.add('is-visible'), i % 4 * 60);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------------------------------------------------------
     5. Manejo de imágenes faltantes (placeholders elegantes)
     Cualquier <img class="ph-img"> que falle al cargar (porque
     el archivo real todavía no existe en /img) se reemplaza
     visualmente por una caja con el texto del atributo alt.
  --------------------------------------------------------- */
  document.querySelectorAll('img.ph-img').forEach(img => {
    img.addEventListener('error', function handleError() {
      img.removeEventListener('error', handleError);
      const label = img.getAttribute('data-placeholder-label') || img.getAttribute('alt') || 'Imagen';
      const box = document.createElement('div');
      box.className = 'img-missing';
      box.setAttribute('role', 'img');
      box.setAttribute('aria-label', label);
      box.innerHTML = `<span>🖼️<br>${label}</span>`;
      img.replaceWith(box);
    });
  });

  /* ---------------------------------------------------------
     6. Video slots — inserta un iframe responsivo de YouTube
     cuando data-youtube contiene una URL o ID válido. Si está
     vacío, muestra el estado de "falta información".
  --------------------------------------------------------- */
  function extractYouTubeId(value) {
    if (!value) return null;
    const patterns = [
      /(?:youtu\.be\/)([a-zA-Z0-9_-]{6,})/,
      /(?:v=)([a-zA-Z0-9_-]{6,})/,
      /(?:embed\/)([a-zA-Z0-9_-]{6,})/
    ];
    for (const re of patterns) {
      const match = value.match(re);
      if (match) return match[1];
    }
    // Si ya parece un ID plano
    if (/^[a-zA-Z0-9_-]{6,}$/.test(value.trim())) return value.trim();
    return null;
  }

  document.querySelectorAll('.video-slot').forEach(slot => {
    const raw = slot.getAttribute('data-youtube');
    const videoId = extractYouTubeId(raw);
    const title = slot.getAttribute('data-title') || 'Video de YouTube';

    if (videoId) {
      // Portada real de YouTube + botón de reproducción (patrón "lite embed").
      // Evita mostrar el error de incrustación de golpe: el video solo se
      // carga cuando la persona hace clic en reproducir.
      slot.classList.add('video-slot--facade');
      slot.style.backgroundImage = `url(https://i.ytimg.com/vi/${videoId}/hqdefault.jpg)`;
      slot.setAttribute('role', 'button');
      slot.setAttribute('tabindex', '0');
      slot.setAttribute('aria-label', `Reproducir: ${title}`);

      slot.innerHTML = `
        <span class="video-slot__play" aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M9 6.5v13l11-6.5-11-6.5Z" fill="currentColor"/></svg>
        </span>
        <a class="video-slot__yt-link" href="https://www.youtube.com/watch?v=${videoId}" target="_blank" rel="noopener noreferrer">Ver en YouTube ↗</a>
      `;

      function loadVideo() {
        slot.classList.remove('video-slot--facade');
        slot.style.backgroundImage = '';
        slot.innerHTML = '';
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        iframe.title = title;
        iframe.loading = 'lazy';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        slot.appendChild(iframe);
      }

      slot.addEventListener('click', (e) => {
        if (e.target.closest('.video-slot__yt-link')) return; // deja que el link abra YouTube normalmente
        loadVideo();
      });
      slot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); loadVideo(); }
      });
    } else {
      slot.setAttribute('data-empty', 'true');
    }
  });

  /* ---------------------------------------------------------
     7. Modal para ampliar imágenes (galería héroe + bitácora)
  --------------------------------------------------------- */
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');
  const modalClose = document.getElementById('modalClose');

  function openModal(imgEl) {
    const src = imgEl.tagName === 'IMG' ? imgEl.src : '';
    const alt = imgEl.tagName === 'IMG' ? imgEl.alt : imgEl.getAttribute('aria-label') || '';
    if (!src) return; // si es un placeholder sin imagen real, no abrir modal vacío
    modalImage.src = src;
    modalImage.alt = alt;
    modalCaption.textContent = alt;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    modalImage.src = '';
  }

  document.querySelectorAll('[data-modal-trigger]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const img = trigger.querySelector('img');
      if (img) openModal(img);
    });
  });

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  /* ---------------------------------------------------------
     8. Ordenar automáticamente la lista de Referencias (APA 7)
     Ordena los <li> alfabéticamente según su texto visible.
  --------------------------------------------------------- */
  const refsList = document.getElementById('referencesList');
  if (refsList) {
    const items = Array.from(refsList.querySelectorAll('li'));
    items.sort((a, b) => a.textContent.trim().localeCompare(b.textContent.trim(), 'es', { sensitivity: 'base' }));
    items.forEach(li => refsList.appendChild(li));
  }

  /* ---------------------------------------------------------
     9. Enlaces externos: abrir en nueva pestaña automáticamente
  --------------------------------------------------------- */
  document.querySelectorAll('[data-external]').forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });

});
