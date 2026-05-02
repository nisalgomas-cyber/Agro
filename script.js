/* ============================================================
   Ceylon Agro Development — Main JavaScript
   ============================================================ */

'use strict';

/* ── Navbar scroll behaviour ── */
(function () {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const isHomePage = window.location.pathname.endsWith('index.html') ||
                     window.location.pathname.endsWith('/') ||
                     window.location.pathname === '';

  function updateNavbar () {
    if (isHomePage) {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    } else {
      navbar.classList.add('scrolled'); // inner pages always opaque
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();
})();

/* ── Mobile hamburger menu ── */
(function () {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', function () {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close when a menu link is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
})();

/* ── Scroll-reveal animation ── */
(function () {
  const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger siblings slightly
        const siblings = entry.target.parentElement
          ? Array.from(entry.target.parentElement.children).filter(el =>
              el.classList.contains('reveal') ||
              el.classList.contains('reveal-left') ||
              el.classList.contains('reveal-right'))
          : [];
        const index = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${index * 80}ms`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
})();

/* ── Active nav link highlight ── */
(function () {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-menu .nav-link').forEach(link => {
    const href = (link.getAttribute('href') || '').split('#')[0];
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
})();

/* ── Counter animation ── */
(function () {
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 1800;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      const current = target * eased;
      el.textContent = prefix + (Number.isInteger(target) ? Math.round(current) : current.toFixed(1)) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

/* ── Form validation & submission (Contact) ── */
(function () {
  const form     = document.getElementById('contact-form');
  const success  = document.getElementById('contact-success');
  const submit   = document.getElementById('contact-submit');
  const replyEl  = document.getElementById('reply-email');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    submit.disabled = true;
    submit.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Sending…`;

    setTimeout(() => {
      if (replyEl) {
        const emailInput = document.getElementById('c-email');
        replyEl.textContent = emailInput ? emailInput.value : '';
      }
      if (success) {
        success.classList.add('show');
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      form.reset();
      submit.disabled = false;
      submit.innerHTML = `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/></svg> Send Message`;
    }, 1200);
  });
})();

/* ── Form validation & submission (Investment) ── */
(function () {
  const form    = document.getElementById('invest-form');
  const success = document.getElementById('invest-success');
  const submit  = document.getElementById('invest-submit');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    submit.disabled = true;
    submit.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Sending…`;

    setTimeout(() => {
      if (success) {
        success.classList.add('show');
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      form.reset();
      submit.disabled = false;
      submit.innerHTML = `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/></svg> Submit Investment Inquiry`;
    }, 1200);
  });
})();

/* ── Hero parallax ── */
(function () {
  const heroBg = document.getElementById('hero-bg');
  if (!heroBg) return;

  function parallax () {
    const scrollY = window.scrollY;
    heroBg.style.transform = `translateY(${scrollY * 0.35}px)`;
  }

  window.addEventListener('scroll', parallax, { passive: true });
})();

/* ── Map pin tooltips (projects page) ── */
(function () {
  const tooltip = document.getElementById('map-tooltip');
  if (!tooltip) return;

  document.querySelectorAll('.sri-lanka-map circle[data-site]').forEach(pin => {
    pin.addEventListener('mouseover', function (e) {
      tooltip.textContent = this.dataset.site;
      tooltip.style.display = 'block';

      const mapRect = this.closest('svg').getBoundingClientRect();
      const pinRect = this.getBoundingClientRect();
      const x = pinRect.left - mapRect.left + pinRect.width / 2;
      const y = pinRect.top  - mapRect.top;
      tooltip.style.left  = `${x}px`;
      tooltip.style.top   = `${y - 32}px`;
      tooltip.style.transform = 'translateX(-50%)';
    });

    pin.addEventListener('mouseout', function () {
      tooltip.style.display = 'none';
    });
  });
})();

/* ── Smooth anchor scrolling ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      const offset = 100; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── Spinning loader CSS class injection ── */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .quick-contact-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,.12); }
    .pulse-ring { animation: ping 2s cubic-bezier(0,0,.2,1) infinite; }
    @keyframes ping { 75%,100% { transform: scale(2); opacity: 0; } }
  `;
  document.head.appendChild(style);
})();

/* ── Page transition fade-in ── */
(function () {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity .35s ease';
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });
})();

/* ── Copy logo & images to assets folder hint ── */
// NOTE: Place the generated logo at: ceylon-agro/assets/logo.png
// Generated images should be copied to: ceylon-agro/assets/
//   hero-farm.jpg      → hero farm aerial image
//   green-chili.jpg    → green chili image
//   red-chili.jpg      → red chili image
//   spices.jpg         → spices image
//   logo.png           → company logo
