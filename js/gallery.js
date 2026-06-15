/* ============================================
   ART BY REMYA — Gallery Module
   Portfolio filtering, lightbox, before/after slider
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initPortfolioFilters();
  initLightbox();
  initBeforeAfterSliders();
});

/* ==================== PORTFOLIO FILTERS ==================== */
function initPortfolioFilters() {
  const filters = document.querySelectorAll('.portfolio__filter');
  const items = document.querySelectorAll('.gallery-item');

  if (filters.length === 0 || items.length === 0) return;

  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      const category = filter.dataset.filter;

      // Update active filter
      filters.forEach(f => f.classList.remove('portfolio__filter--active'));
      filter.classList.add('portfolio__filter--active');

      // Filter items
      items.forEach(item => {
        const itemCat = item.dataset.category;
        const show = category === 'all' || itemCat === category;

        if (show) {
          item.style.display = '';
          // Animate in
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(item,
              { opacity: 0, scale: 0.95 },
              { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
            );
          } else {
            item.style.opacity = '1';
          }
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ==================== LIGHTBOX ==================== */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  if (!lightbox) return;

  const galleryItems = document.querySelectorAll('.gallery-item');
  let currentIndex = 0;
  let visibleItems = [];

  function getVisibleItems() {
    return [...document.querySelectorAll('.gallery-item')].filter(
      item => item.style.display !== 'none'
    );
  }

  function openLightbox(index) {
    visibleItems = getVisibleItems();
    currentIndex = index;
    const img = visibleItems[currentIndex]?.querySelector('img');
    if (!img) return;

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('lightbox--open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('lightbox--open');
    document.body.style.overflow = '';
  }

  function navigate(direction) {
    visibleItems = getVisibleItems();
    currentIndex = (currentIndex + direction + visibleItems.length) % visibleItems.length;
    const img = visibleItems[currentIndex]?.querySelector('img');
    if (!img) return;

    // Animate transition
    if (typeof gsap !== 'undefined') {
      gsap.to(lightboxImg, {
        opacity: 0,
        duration: 0.15,
        onComplete: () => {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt;
          gsap.to(lightboxImg, { opacity: 1, duration: 0.15 });
        }
      });
    } else {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
    }
  }

  // Click handlers
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      visibleItems = getVisibleItems();
      const idx = visibleItems.indexOf(item);
      if (idx !== -1) openLightbox(idx);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigate(-1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => navigate(1));

  // Close on overlay click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('lightbox--open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
}

/* ==================== BEFORE/AFTER SLIDERS ==================== */
function initBeforeAfterSliders() {
  const sliders = document.querySelectorAll('.transform-card__slider');

  sliders.forEach(slider => {
    const before = slider.querySelector('.transform-card__before');
    const divider = slider.querySelector('.transform-card__divider');
    if (!before || !divider) return;

    let isDragging = false;

    function updatePosition(clientX) {
      const rect = slider.getBoundingClientRect();
      let x = clientX - rect.left;
      x = Math.max(0, Math.min(x, rect.width));
      const percent = (x / rect.width) * 100;

      before.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
      divider.style.left = percent + '%';
    }

    // Mouse events
    slider.addEventListener('mousedown', (e) => {
      isDragging = true;
      updatePosition(e.clientX);
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) updatePosition(e.clientX);
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch events
    slider.addEventListener('touchstart', (e) => {
      isDragging = true;
      updatePosition(e.touches[0].clientX);
    }, { passive: true });

    slider.addEventListener('touchmove', (e) => {
      if (isDragging) {
        updatePosition(e.touches[0].clientX);
        e.preventDefault();
      }
    }, { passive: false });

    slider.addEventListener('touchend', () => {
      isDragging = false;
    }, { passive: true });
  });
}
