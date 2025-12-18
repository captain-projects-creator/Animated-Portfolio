// js/script.js
// Responsive nav toggle + social buttons
// - Desktop: nav is inline
// - Mobile: hamburger toggles overlay (.nav-links.active)
// - Closes when clicking a link, outside, Esc, or on resize to desktop

// Elements (graceful null checks)
const menuIcon = document.getElementById('menu-icon');
const navLinks = document.querySelector('.nav-links');
const navAnchors = document.querySelectorAll('.nav-links a');
const gitLink = document.getElementById('link-git');
const linkedIn = document.getElementById('link-linkedin');
const visitBtn = document.querySelector('.visit-btn');

// Safety helpers
const isElement = el => el instanceof Element || el instanceof HTMLDocument;
const isMobileWidth = () => window.innerWidth <= 720;

// Initialize ARIA & icon state
if (isElement(menuIcon)) {
  menuIcon.setAttribute('role', 'button');
  menuIcon.setAttribute('aria-label', 'Toggle navigation menu');
  menuIcon.setAttribute('aria-expanded', 'false');
}
if (isElement(navLinks)) {
  navLinks.setAttribute('aria-hidden', 'true');
}

// Open / Close helpers
function openMobileMenu() {
  if (!isElement(navLinks) || !isElement(menuIcon)) return;
  navLinks.classList.add('active');
  document.body.classList.add('menu-open');

  // swap icon classes (Font Awesome)
  menuIcon.classList.remove('fa-bars');
  menuIcon.classList.add('fa-xmark');

  menuIcon.setAttribute('aria-expanded', 'true');
  navLinks.setAttribute('aria-hidden', 'false');
}

function closeMobileMenu() {
  if (!isElement(navLinks) || !isElement(menuIcon)) return;
  navLinks.classList.remove('active');
  document.body.classList.remove('menu-open');

  // swap icon back
  menuIcon.classList.remove('fa-xmark');
  menuIcon.classList.add('fa-bars');

  menuIcon.setAttribute('aria-expanded', 'false');
  navLinks.setAttribute('aria-hidden', 'true');
}

function toggleMobileMenu() {
  if (!isElement(navLinks) || !isElement(menuIcon)) return;
  if (!isMobileWidth()) return; // only toggle on mobile
  if (navLinks.classList.contains('active')) closeMobileMenu();
  else openMobileMenu();
}

// Attach menu toggle to menuIcon
if (isElement(menuIcon)) {
  menuIcon.addEventListener('click', (ev) => {
    ev.stopPropagation();
    toggleMobileMenu();
  });
}

// Clicking any nav link closes the mobile menu (mobile UX)
if (navAnchors && navAnchors.length) {
  navAnchors.forEach(a => {
    a.addEventListener('click', () => {
      if (isMobileWidth()) closeMobileMenu();
    });
  });
}

// Close when clicking outside the nav overlay
document.addEventListener('click', (e) => {
  if (!isMobileWidth()) return;
  if (!isElement(navLinks) || !navLinks.classList.contains('active')) return;

  // Use composedPath for Shadow DOM friendliness; fallback to e.target
  const path = (e.composedPath && e.composedPath()) || (e.path || []);
  const clickedInsideNav = path.includes(navLinks) || path.includes(menuIcon);
  if (!clickedInsideNav) closeMobileMenu();
});

// Close on ESC key
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' || e.key === 'Esc') {
    if (isElement(navLinks) && navLinks.classList.contains('active')) {
      closeMobileMenu();
    }
  }
});

// Close menu when resizing to desktop (debounced)
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (!isMobileWidth()) closeMobileMenu();
  }, 120);
});

// Social / external links (safe checks)
if (isElement(gitLink)) {
  gitLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.open('https://github.com/captain-projects-creator', '_blank', 'noopener,noreferrer');
  });
}

if (isElement(linkedIn)) {
  linkedIn.addEventListener('click', (e) => {
    e.preventDefault();
    // updated to https
    window.open('https://www.linkedin.com/in/deva-r-a9034232a', '_blank', 'noopener,noreferrer');
  });
}

if (isElement(visitBtn)) {
  visitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.open('https://github.com/captain-projects-creator', '_blank', 'noopener,noreferrer');
  });
}

// Accessibility: close overlay when focus moves away (optional improvement)
document.addEventListener('focusin', (e) => {
  if (!isMobileWidth()) return;
  if (!isElement(navLinks) || !navLinks.classList.contains('active')) return;

  const path = (e.composedPath && e.composedPath()) || (e.path || []);
  const focusedInsideNav = path.includes(navLinks) || path.includes(menuIcon);
  if (!focusedInsideNav) {
    // keep menu open if a keyboard user tabs into header elements; otherwise close
    // (this is conservative — remove this block if it conflicts with your UX)
    // closeMobileMenu();
  }
});