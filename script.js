/* ============ script.js ============
   Everything runs after the page has loaded (the script tag is at the bottom of index.html). */

// 1. Tell the CSS that JavaScript is working.
//    Our CSS only hides the menu or fades sections when this class exists,
//    so if JavaScript ever fails, the site still shows everything.
document.documentElement.classList.add('js');

// 2. MOBILE MENU: open and close the navigation
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('site-nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    // aria-expanded tells screen readers whether the menu is open
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  // Close the menu after tapping a link
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
    });
  });

  // Close the menu with the Escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('open')) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });
}

// 3. FOOTER YEAR: always shows the current year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// 4. ACTIVE MENU LINK: highlights the section you are reading
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('#site-nav a');

if ('IntersectionObserver' in window && sections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    },
    // Counts a section as "current" when it crosses the middle band of the screen
    { rootMargin: '-45% 0px -50% 0px' }
  );
  sections.forEach((section) => sectionObserver.observe(section));
}

// 5. SCROLL REVEAL: sections fade up gently as they come into view
const revealItems = document.querySelectorAll('main section:not(.hero), .card, .timeline > li');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if ('IntersectionObserver' in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once only
        }
      });
    },
    { threshold: 0.12 }
  );
  revealItems.forEach((item) => {
    item.classList.add('reveal');
    revealObserver.observe(item);
  });
}
/* ===== SCRIPT SECTION: stat-counters | START =====
   Counts the four top numbers up from 0 when they scroll into view.
   The final numbers are already written in index.html, so if JavaScript
   fails (or the visitor prefers reduced motion) they still show correctly. */
(function () {
  const counters = document.querySelectorAll('[data-count]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!counters.length || reduceMotion || !('IntersectionObserver' in window)) return;

  // Writes one frame of the animation, keeping decimals and the "+" sign
  function show(el, value) {
    const decimals = Number(el.dataset.decimals || 0);
    const suffix = el.dataset.suffix || '';
    el.textContent = value.toFixed(decimals) + suffix;
  }

  function animate(el) {
    const target = Number(el.dataset.count);
    const duration = 1800; // milliseconds
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // fast at first, gentle landing
      show(el, target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target); // run once only
      }
    });
  }, { threshold: 0.6 });

  counters.forEach((el) => {
    show(el, 0); // start from zero
    counterObserver.observe(el);
  });
})();
/* ===== SCRIPT SECTION: stat-counters | END ===== */
