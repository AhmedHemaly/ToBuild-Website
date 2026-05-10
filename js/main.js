'use strict';

/* ============================================================
   Sticky nav — transparent on hero, opaque on scroll
============================================================ */
const navHeader = document.getElementById('nav-header');

function updateNav() {
  if (window.scrollY > 40) {
    navHeader.classList.add('scrolled');
  } else {
    navHeader.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ============================================================
   Hamburger — mobile nav toggle
============================================================ */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!navHeader.contains(e.target) && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});

/* ============================================================
   Smooth scroll — anchor links
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navHeight = navHeader.offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================================================
   IntersectionObserver — fade-in on scroll
============================================================ */
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings in the same parent grid
        const siblings = Array.from(entry.target.parentElement.children).filter(
          el => el.classList.contains('observe-fade')
        );
        const index = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${index * 90}ms`;
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.observe-fade').forEach(el => fadeObserver.observe(el));

/* ============================================================
   Newsletter form — validation + success state
============================================================ */
const form          = document.getElementById('newsletter-form');
const successPanel  = document.getElementById('newsletter-success');
const emailInput    = document.getElementById('nl-email');
const emailError    = document.getElementById('nl-email-error');

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function showEmailError(msg) {
  emailInput.classList.add('error');
  emailError.textContent = msg;
}

function clearEmailError() {
  emailInput.classList.remove('error');
  emailError.textContent = '';
}

emailInput.addEventListener('input', () => {
  if (emailInput.value && !isValidEmail(emailInput.value)) {
    showEmailError('Please enter a valid email address.');
  } else {
    clearEmailError();
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!emailInput.value.trim()) {
    showEmailError('Email address is required.');
    emailInput.focus();
    return;
  }

  if (!isValidEmail(emailInput.value)) {
    showEmailError('Please enter a valid email address.');
    emailInput.focus();
    return;
  }

  clearEmailError();

  // Show success state (no backend required)
  form.hidden = true;
  successPanel.hidden = false;
});

/* ============================================================
   Active nav link — highlight current section on scroll
============================================================ */
const sections = document.querySelectorAll('section[id], div[id]');
const navAnchors = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { rootMargin: '-40% 0px -50% 0px' }
);

sections.forEach(sec => sectionObserver.observe(sec));
