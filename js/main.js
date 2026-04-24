/* Damp Solve — main.js */

(function () {
  'use strict';

  // ── Sticky nav ─────────────────────────────────────────────
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // ── Hamburger / mobile menu ─────────────────────────────────
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on any link click inside mobile menu
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Active nav link ─────────────────────────────────────────
  const path = window.location.pathname;
  document.querySelectorAll('.nav__link, .nav__mobile-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    // Normalise: strip leading slash for comparison
    const hrefBase = href.replace(/^\.\.\//, '').replace(/^\//, '');
    const pathBase = path.replace(/^\//, '');
    if (hrefBase && pathBase.endsWith(hrefBase)) {
      link.classList.add('active');
    }
  });

  // ── Scroll-in animations (Intersection Observer) ────────────
  const animEls = document.querySelectorAll('.animate-in');
  if (animEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    animEls.forEach(el => io.observe(el));
  }

  // ── Form submission handler ─────────────────────────────────
  document.querySelectorAll('form[data-form]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      if (!btn) return;

      const orig = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;

      // Replace this timeout with a real fetch() to your endpoint
      setTimeout(() => {
        btn.textContent = '✓ Request sent — we\'ll be in touch shortly!';
        btn.style.background = '#16a34a';
        form.reset();
        setTimeout(() => {
          btn.textContent = orig;
          btn.style.background = '';
          btn.disabled = false;
        }, 5000);
      }, 1400);
    });
  });

  // ── Smooth scroll for in-page anchor links ──────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = nav ? nav.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - offset - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── Counter animation for stats bar ────────────────────────
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el  = e.target;
        const end = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const dur = 1400;
        const start = performance.now();
        const tick  = (now) => {
          const p = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.floor(ease * end) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => cio.observe(el));
  }

  // ── Hero carousel ──────────────────────────────────────────
  const carousel = document.getElementById('heroCarousel');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dots = document.querySelectorAll('.carousel__dot');

  if (carousel && prevBtn && nextBtn && dots.length) {
    let currentSlide = 0;
    const totalSlides = document.querySelectorAll('.carousel__slide').length;
    let autoPlayTimer;

    const goToSlide = (n) => {
      currentSlide = (n + totalSlides) % totalSlides;
      carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
      dots.forEach((d, i) => {
        d.classList.toggle('carousel__dot--active', i === currentSlide);
      });
      clearTimeout(autoPlayTimer);
      startAutoPlay();
    };

    const nextSlide = () => goToSlide(currentSlide + 1);
    const prevSlide = () => goToSlide(currentSlide - 1);

    const startAutoPlay = () => {
      autoPlayTimer = setTimeout(nextSlide, 6000);
    };

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        goToSlide(parseInt(dot.dataset.slide, 10));
      });
    });

    startAutoPlay();
  }

})();
