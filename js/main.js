/* ============================================
   ART BY REMYA — Main JavaScript
   GSAP animations, navigation, opening animation
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Determine if we're on the home page
  const isHomePage = document.getElementById('opening') !== null;

  if (isHomePage) {
    playOpeningAnimation();
  } else {
    document.body.classList.add('page-transition');
    initAfterOpening();
  }
});

/* ==================== OPENING ANIMATION ==================== */
function playOpeningAnimation() {
  const opening = document.getElementById('opening');
  const mandala = document.getElementById('openingMandala');
  const logo = document.getElementById('openingLogo');
  const tagline = document.getElementById('openingTagline');

  // Prevent scrolling during animation
  document.body.style.overflow = 'hidden';

  // Check if GSAP is loaded
  if (typeof gsap === 'undefined') {
    // Fallback: just remove opening after delay
    setTimeout(() => {
      opening.classList.add('opening--hidden');
      document.body.style.overflow = '';
      initAfterOpening();
    }, 500);
    return;
  }

  const tl = gsap.timeline({
    onComplete: () => {
      document.body.style.overflow = '';
      initAfterOpening();
    }
  });

  // Animate mandala SVG paths
  const paths = mandala.querySelectorAll('path, circle:not(:last-child)');
  paths.forEach(path => {
    if (path.tagName === 'circle' || path.tagName === 'path') {
      const length = path.getTotalLength ? path.getTotalLength() : 300;
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
    }
  });

  tl
    // Show mandala
    .to(mandala, {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out'
    })
    // Draw mandala paths
    .to(paths, {
      strokeDashoffset: 0,
      duration: 1.2,
      ease: 'power2.inOut',
      stagger: 0.05
    }, '-=0.1')
    // Show logo
    .to(logo, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out'
    }, '-=0.3')
    // Show tagline
    .to(tagline, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'power2.out'
    }, '-=0.2')
    // Pause briefly
    .to({}, { duration: 0.4 })
    // Fade out entire opening
    .to(opening, {
      opacity: 0,
      scale: 1.05,
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete: () => {
        opening.style.display = 'none';
      }
    });

  // Set initial states
  gsap.set(logo, { opacity: 0, y: 20 });
  gsap.set(tagline, { opacity: 0, y: 15 });
}

/* ==================== POST-OPENING INIT ==================== */
function initAfterOpening() {
  initNavigation();
  initHeroAnimations();
  initScrollReveal();
  initTestimonialCarousel();
  initButtonRipple();
  initWhatsAppFloat();
}

/* ==================== NAVIGATION ==================== */
function initNavigation() {
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileOverlay = document.getElementById('mobileOverlay');
  let isMenuOpen = false;

  // Scroll behavior — glassmorphism
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Check initial state

  // Mobile menu toggle
  if (menuToggle && mobileNav && mobileOverlay) {
    menuToggle.addEventListener('click', () => {
      isMenuOpen = !isMenuOpen;
      menuToggle.classList.toggle('header__menu-toggle--open', isMenuOpen);
      mobileNav.classList.toggle('mobile-nav--open', isMenuOpen);
      mobileOverlay.classList.toggle('mobile-nav__overlay--visible', isMenuOpen);
      document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    });

    mobileOverlay.addEventListener('click', () => {
      isMenuOpen = false;
      menuToggle.classList.remove('header__menu-toggle--open');
      mobileNav.classList.remove('mobile-nav--open');
      mobileOverlay.classList.remove('mobile-nav__overlay--visible');
      document.body.style.overflow = '';
    });

    // Close menu on link click
    mobileNav.querySelectorAll('.mobile-nav__link').forEach(link => {
      link.addEventListener('click', () => {
        isMenuOpen = false;
        menuToggle.classList.remove('header__menu-toggle--open');
        mobileNav.classList.remove('mobile-nav--open');
        mobileOverlay.classList.remove('mobile-nav__overlay--visible');
        document.body.style.overflow = '';
      });
    });
  }

  // Smooth scroll for anchor links on same page
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ==================== HERO ANIMATIONS ==================== */
function initHeroAnimations() {
  if (typeof gsap === 'undefined') return;

  const heroLabel = document.getElementById('heroLabel');
  const heroTitle = document.getElementById('heroTitle');
  const heroSubtitle = document.getElementById('heroSubtitle');
  const heroActions = document.getElementById('heroActions');
  const heroScroll = document.getElementById('heroScroll');

  if (!heroTitle) return;

  const tl = gsap.timeline({ delay: 0.2 });

  // Check if opening animation exists (home page)
  const isHomePage = document.getElementById('opening') !== null;
  const baseDelay = isHomePage ? 0 : 0.3;

  tl
    .to(heroLabel, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, baseDelay)
    .to(heroTitle, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.3')
    .to(heroSubtitle, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.3')
    .to(heroActions, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.2')
    .to(heroScroll, {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out'
    }, '-=0.1');

  // Set initial states
  gsap.set([heroLabel, heroTitle, heroSubtitle, heroActions], {
    opacity: 0,
    y: 30
  });
  gsap.set(heroScroll, { opacity: 0 });

  // Parallax on hero background
  const heroBg = document.querySelector('.hero__bg img');
  if (heroBg) {
    gsap.to(heroBg, {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }
}

/* ==================== SCROLL REVEAL ==================== */
function initScrollReveal() {
  if (typeof gsap === 'undefined') {
    // Fallback: just show everything
    document.querySelectorAll('.gs-reveal, .gs-reveal-up, .gs-reveal-down, .gs-reveal-left, .gs-reveal-right, .gs-reveal-scale').forEach(el => {
      el.style.opacity = '1';
      el.style.visibility = 'visible';
      el.style.transform = 'none';
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Batch reveal animations
  const revealElements = document.querySelectorAll('.gs-reveal, .gs-reveal-up, .gs-reveal-down, .gs-reveal-left, .gs-reveal-right, .gs-reveal-scale');

  revealElements.forEach(el => {
    const fromVars = { opacity: 0, visibility: 'hidden' };
    const toVars = {
      opacity: 1,
      visibility: 'visible',
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    };

    if (el.classList.contains('gs-reveal-up')) {
      fromVars.y = 50;
      toVars.y = 0;
    } else if (el.classList.contains('gs-reveal-down')) {
      fromVars.y = -50;
      toVars.y = 0;
    } else if (el.classList.contains('gs-reveal-left')) {
      fromVars.x = -50;
      toVars.x = 0;
    } else if (el.classList.contains('gs-reveal-right')) {
      fromVars.x = 50;
      toVars.x = 0;
    } else if (el.classList.contains('gs-reveal-scale')) {
      fromVars.scale = 0.9;
      toVars.scale = 1;
    }

    gsap.fromTo(el, fromVars, toVars);
  });

  // Stagger items in grids
  const staggerContainers = document.querySelectorAll('.services__grid, .pricing__grid, .collections__grid, .transformation__grid');
  staggerContainers.forEach(container => {
    const items = container.querySelectorAll('.gs-reveal-up');
    if (items.length > 0) {
      gsap.fromTo(items,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  });

  // Parallax for collection images
  document.querySelectorAll('.collection-card__image img').forEach(img => {
    gsap.to(img, {
      yPercent: 10,
      ease: 'none',
      scrollTrigger: {
        trigger: img.closest('.collection-card'),
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });

  // Process timeline animation
  const timelineSteps = document.querySelectorAll('.process__step');
  timelineSteps.forEach((step, i) => {
    gsap.fromTo(step,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: step,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        delay: i * 0.1
      }
    );
  });
}

/* ==================== TESTIMONIAL CAROUSEL ==================== */
function initTestimonialCarousel() {
  const track = document.getElementById('testimonialTrack');
  const dots = document.querySelectorAll('.testimonials__dot');
  if (!track || dots.length === 0) return;

  let current = 0;
  const total = dots.length;
  let interval;
  let startX = 0;
  let isDragging = false;

  function goTo(index) {
    current = index;
    track.style.transform = `translateX(-${current * 100}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle('testimonials__dot--active', i === current);
    });
  }

  function next() {
    goTo((current + 1) % total);
  }

  function startAutoplay() {
    interval = setInterval(next, 5000);
  }

  function stopAutoplay() {
    clearInterval(interval);
  }

  // Dot clicks
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      stopAutoplay();
      goTo(parseInt(dot.dataset.index));
      startAutoplay();
    });
  });

  // Touch/swipe support
  const carousel = document.getElementById('testimonialCarousel');
  if (carousel) {
    carousel.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      stopAutoplay();
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          goTo(Math.min(current + 1, total - 1));
        } else {
          goTo(Math.max(current - 1, 0));
        }
      }
      isDragging = false;
      startAutoplay();
    }, { passive: true });

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
  }

  startAutoplay();
}

/* ==================== BUTTON RIPPLE EFFECT ==================== */
function initButtonRipple() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

/* ==================== WHATSAPP FLOAT ==================== */
function initWhatsAppFloat() {
  const whatsapp = document.getElementById('whatsappFloat');
  if (!whatsapp) return;

  // Initially hidden, show after scroll
  whatsapp.style.opacity = '0';
  whatsapp.style.transform = 'scale(0)';
  whatsapp.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';

  const showWhatsApp = () => {
    if (window.scrollY > 300) {
      whatsapp.style.opacity = '1';
      whatsapp.style.transform = 'scale(1)';
    } else {
      whatsapp.style.opacity = '0';
      whatsapp.style.transform = 'scale(0)';
    }
  };

  window.addEventListener('scroll', showWhatsApp, { passive: true });

  // Show immediately on inner pages (no opening animation)
  if (!document.getElementById('opening')) {
    setTimeout(() => {
      whatsapp.style.opacity = '1';
      whatsapp.style.transform = 'scale(1)';
    }, 1000);
  }
}
