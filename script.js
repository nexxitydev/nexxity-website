/* ============================================================
   NEXXITY — script.js
   Hero Section JavaScript (Section 1 of N)
   All future section scripts will be appended below.
============================================================ */

'use strict';

/* ============================================================
   UTILITY: Safe DOM selector helpers
============================================================ */
const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

/* ============================================================
   1. NAVBAR — Scroll Behaviour
   Adds `.scrolled` class when user scrolls past threshold.
   Enables frosted glass background via CSS.
============================================================ */
(function initNavbarScroll() {
  const navbar = $('#navbar');
  if (!navbar) return;

  const SCROLL_THRESHOLD = 60; // px before navbar becomes opaque

  const onScroll = () => {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  // Passive listener for performance
  window.addEventListener('scroll', onScroll, { passive: true });

  // Run once on init in case page loads mid-scroll
  onScroll();
})();

/* ============================================================
   2. MOBILE MENU — Hamburger Open / Close
============================================================ */
(function initMobileMenu() {
  const hamburgerBtn = $('#hamburgerBtn');
  const mobileMenu   = $('#mobileMenu');
  const closeBtn     = $('#mobileCloseBtn');
  const mobileLinks  = $$('.mobile-menu__link');

  if (!hamburgerBtn || !mobileMenu) return;

  const openMenu = () => {
    mobileMenu.classList.add('open');
    hamburgerBtn.classList.add('active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  };

  const closeMenu = () => {
    mobileMenu.classList.remove('open');
    hamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  hamburgerBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }

  // Close on any nav link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  // Close on backdrop click (outside menu links)
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) closeMenu();
  });
})();

/* ============================================================
   3. HERO VIDEO — Graceful Fallback
   If the video fails to load/play, the hero bg remains #050505
   via CSS. We enhance by adding a subtle gradient overlay instead.
============================================================ */
(function initHeroVideo() {
  const video = $('.hero__video');
  if (!video) return;

  // Attempt to play (some browsers need explicit play() call)
  const playAttempt = video.play();

  if (playAttempt !== undefined) {
    playAttempt
      .then(() => {
        // Video playing — nothing extra needed
      })
      .catch(() => {
        // Autoplay blocked or video failed
        // Graceful: CSS background handles fallback
        video.style.display = 'none';

        // Add a subtle animated gradient as fallback background
        const hero = $('.hero');
        if (hero) {
          hero.style.background =
            'radial-gradient(ellipse at 30% 40%, rgba(0,209,255,0.04) 0%, transparent 60%), ' +
            'radial-gradient(ellipse at 70% 70%, rgba(0,100,200,0.05) 0%, transparent 55%), ' +
            '#050505';
        }
      });
  }
})();

/* ============================================================
   4. STAGGERED HERO ENTRANCE ANIMATIONS
   CSS handles the animation via `animation-delay`. This JS block
   exists for IntersectionObserver-based replay insurance and
   to add extra smoothness for slower connections.
============================================================ */
(function initHeroAnimations() {
  const animatedEls = $$('.animate-hero');
  if (!animatedEls.length) return;

  // If CSS animation already fired (fast connections), nothing to do.
  // For slow connections: ensure elements become visible after 2.5s max.
  const safetyTimer = setTimeout(() => {
    animatedEls.forEach(el => {
      el.style.opacity    = '1';
      el.style.transform  = 'translateY(0)';
    });
  }, 2500);

  // Clean up safety timer if animations fired normally
  animatedEls[animatedEls.length - 1]?.addEventListener(
    'animationend',
    () => clearTimeout(safetyTimer),
    { once: true }
  );
})();

/* ============================================================
   5. SMOOTH ANCHOR SCROLL
   Intercepts clicks on anchor links for smooth scroll behaviour,
   accounting for the fixed navbar height.
============================================================ */
(function initSmoothScroll() {
  const NAVBAR_OFFSET = 80; // px — adjust if navbar height changes

  document.addEventListener('click', (e) => {
    const target = e.target.closest('a[href^="#"]');
    if (!target) return;

    const id = target.getAttribute('href');
    if (id === '#') return;

    const section = document.querySelector(id);
    if (!section) return;

    e.preventDefault();

    const top = section.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET;

    window.scrollTo({
      top,
      behavior: 'smooth'
    });
  });
})();

/* ============================================================
   6. NAVBAR CTA — Micro-Interaction (ripple on click)
============================================================ */
(function initNavbarCTARipple() {
  const cta = $('.navbar__cta');
  if (!cta) return;

  cta.addEventListener('click', function(e) {
    // Create ripple element
    const ripple = document.createElement('span');
    const rect   = cta.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);
    const x      = e.clientX - rect.left - size / 2;
    const y      = e.clientY - rect.top  - size / 2;

    Object.assign(ripple.style, {
      position:      'absolute',
      width:         `${size}px`,
      height:        `${size}px`,
      left:          `${x}px`,
      top:           `${y}px`,
      borderRadius:  '50%',
      background:    'rgba(0, 209, 255, 0.12)',
      transform:     'scale(0)',
      animation:     'rippleEffect 0.5s ease forwards',
      pointerEvents: 'none',
    });

    cta.style.position = 'relative';
    cta.style.overflow = 'hidden';
    cta.appendChild(ripple);

    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
  });

  // Inject ripple keyframes dynamically (once)
  if (!document.getElementById('rippleStyle')) {
    const style = document.createElement('style');
    style.id = 'rippleStyle';
    style.textContent = `
      @keyframes rippleEffect {
        to { transform: scale(2.5); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
})();

/* ============================================================
   7. HERO HEADING — Typewriter-style word reveal (enhancement)
   Adds a very subtle cursor blink at the end of the heading
   accent word for 2 seconds, then removes it.
============================================================ */
(function initHeadingAccentCursor() {
  const accent = $('.hero__heading-accent');
  if (!accent) return;

  const cursor = document.createElement('span');
  Object.assign(cursor.style, {
    display:        'inline-block',
    width:          '2px',
    height:         '0.9em',
    background:     'var(--color-accent, #00D1FF)',
    marginLeft:     '3px',
    verticalAlign:  'middle',
    borderRadius:   '1px',
    animation:      'cursorBlink 0.7s step-end infinite',
    opacity:        '0.8',
  });

  accent.appendChild(cursor);

  // Inject cursor blink keyframes (once)
  if (!document.getElementById('cursorBlinkStyle')) {
    const style = document.createElement('style');
    style.id = 'cursorBlinkStyle';
    style.textContent = `
      @keyframes cursorBlink {
        0%, 100% { opacity: 0.8; }
        50%       { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  // Remove cursor after 2.8s
  setTimeout(() => {
    cursor.style.transition = 'opacity 0.4s ease';
    cursor.style.opacity    = '0';
    setTimeout(() => cursor.remove(), 450);
  }, 2800);
})();

/* ============================================================
   8. ACTIVE NAV LINK — Highlight based on scroll position
   (Will be extended as more sections are added)
============================================================ */
(function initActiveNavLink() {
  const navLinks = $$('.navbar__link');
  if (!navLinks.length) return;

  const sectionIds = navLinks.map(link => {
    const href = link.getAttribute('href');
    return href?.startsWith('#') ? href.slice(1) : null;
  }).filter(Boolean);

  const onScroll = () => {
    const scrollPos = window.scrollY + 120;

    let activeId = null;

    sectionIds.forEach(id => {
      const section = document.getElementById(id);
      if (!section) return;
      if (section.offsetTop <= scrollPos) {
        activeId = id;
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${activeId}`) {
        link.style.color = '#FFFFFF';
      } else {
        link.style.color = '';
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ============================================================
   FUTURE SECTION SCRIPTS WILL BE APPENDED BELOW THIS BLOCK
============================================================ */
