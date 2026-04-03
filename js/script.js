'use strict';

/* =====================================================
   NAV: scroll effect + active link
===================================================== */
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');
const scrollTopBtn = document.getElementById('scroll-top');

function onScroll() {
  // Scrolled style
  nav.classList.toggle('scrolled', window.scrollY > 20);

  // Scroll-to-top button
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);

  // Active nav link
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 100) {
      current = section.id;
    }
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* =====================================================
   MOBILE MENU
===================================================== */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

function closeMobileMenu() {
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(isOpen));
  mobileMenu.classList.toggle('open', isOpen);
  mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

mobileLinks.forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

/* =====================================================
   SMOOTH SCROLL
===================================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* =====================================================
   SCROLL TO TOP
===================================================== */
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* =====================================================
   INTERSECTION OBSERVER: fade-up + skill bars
===================================================== */
const fadeObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0, rootMargin: '0px 0px 80px 0px' }
);

document.querySelectorAll('.fade-up').forEach(el => {
  fadeObserver.observe(el);
});

// Skill bars — animate width when the skills section comes into view
const skillsSection = document.getElementById('skills');

const skillObserver = new IntersectionObserver(
  entries => {
    if (entries[0].isIntersecting) {
      document.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      skillObserver.disconnect();
    }
  },
  { threshold: 0, rootMargin: '0px 0px 80px 0px' }
);

if (skillsSection) {
  skillObserver.observe(skillsSection);
}

/* =====================================================
   CONTACT FORM — Formspree AJAX
===================================================== */
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');

if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const action = contactForm.getAttribute('action');

    // If the form hasn't been configured yet, fall back to mailto
    if (!action || action.includes('YOUR_FORM_ID')) {
      const name    = encodeURIComponent(contactForm.querySelector('[name="name"]').value);
      const email   = encodeURIComponent(contactForm.querySelector('[name="email"]').value);
      const subject = encodeURIComponent(contactForm.querySelector('[name="subject"]').value);
      const message = encodeURIComponent(contactForm.querySelector('[name="message"]').value);
      window.location.href = `mailto:ad01santosh@gmail.com?subject=${subject}&body=From: ${name} (${email})%0A%0A${message}`;
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    try {
      const response = await fetch(action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        formStatus.textContent = '✓ Message sent! I\'ll get back to you soon.';
        formStatus.className = 'form-status success';
        contactForm.reset();
      } else {
        const data = await response.json();
        const msg = data.errors ? data.errors.map(e => e.message).join(', ') : 'Something went wrong.';
        formStatus.textContent = '✗ ' + msg;
        formStatus.className = 'form-status error';
      }
    } catch {
      formStatus.textContent = '✗ Network error. Please try again.';
      formStatus.className = 'form-status error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
}
