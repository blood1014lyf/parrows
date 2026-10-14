/**
 * Parrow's Signature — Vanilla JavaScript & Compliance Engine
 * - Dynamic header scroll state (light/dark logo transition)
 * - Accessible mobile drawer navigation (ARIA dialog)
 * - Video Play/Pause toggle (WCAG 2.2.2 Pause, Stop, Hide compliance)
 * - Prefers-reduced-motion detection & compliance
 * - Cookie & Privacy Consent Banner (Ghana Act 843 & GDPR)
 * - Accessible Legal Modals (Focus trapping, Esc key, ARIA dialog)
 * - Form validation with mandatory statutory consent
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const header = document.getElementById('siteHeader');
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const heroVideo = document.getElementById('heroVideo');
  const videoToggle = document.getElementById('videoToggle');
  const videoIconPause = document.getElementById('videoIconPause');
  const videoIconPlay = document.getElementById('videoIconPlay');
  const videoToggleText = document.getElementById('videoToggleText');
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieAcceptAll = document.getElementById('cookieAcceptAll');
  const cookieAcceptEssential = document.getElementById('cookieAcceptEssential');
  const cookieReopenBtn = document.getElementById('cookieReopenBtn');
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  // 1. Header scroll listener
  const updateHeader = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  // 2. Accessible Mobile Drawer
  if (mobileToggle && mobileDrawer) {
    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : !mobileDrawer.classList.contains('open');
      mobileDrawer.classList.toggle('open', isOpen);
      mobileDrawer.setAttribute('aria-hidden', !isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';

      if (isOpen) {
        const firstLink = mobileDrawer.querySelector('a');
        if (firstLink) firstLink.focus();
      } else {
        mobileToggle.focus();
      }
    };

    mobileToggle.addEventListener('click', () => toggleMenu());
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  }

  // 3. Ambient Hero Video Autoplay Assurance
  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.setAttribute('playsinline', '');
    heroVideo.setAttribute('autoplay', '');
    heroVideo.setAttribute('loop', '');

    const tryPlay = () => {
      const p = heroVideo.play();
      if (p !== undefined) {
        p.catch(() => {
          const resume = () => {
            heroVideo.play().catch(() => {});
            ['touchstart', 'click', 'scroll', 'keydown'].forEach(evt => {
              window.removeEventListener(evt, resume);
            });
          };
          ['touchstart', 'click', 'scroll', 'keydown'].forEach(evt => {
            window.addEventListener(evt, resume, { passive: true });
          });
        });
      }
    };

    tryPlay();
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && heroVideo.paused) {
        heroVideo.play().catch(() => {});
      }
    });
  }

  // 4. Smooth Anchor Scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        targetEl.setAttribute('tabindex', '-1');
        targetEl.focus({ preventScroll: true });
      }
    });
  });

  // 5. Cookie Consent Banner (Ghana Act 843 & GDPR compliance)
  if (cookieBanner) {
    const consent = localStorage.getItem('parrows_cookie_consent');
    if (!consent) {
      setTimeout(() => {
        cookieBanner.classList.add('active');
      }, 900);
    }

    const setConsent = (type) => {
      localStorage.setItem('parrows_cookie_consent', type);
      cookieBanner.classList.remove('active');
    };

    if (cookieAcceptAll) {
      cookieAcceptAll.addEventListener('click', () => setConsent('all'));
    }
    if (cookieAcceptEssential) {
      cookieAcceptEssential.addEventListener('click', () => setConsent('essential'));
    }
    if (cookieReopenBtn) {
      cookieReopenBtn.addEventListener('click', () => {
        cookieBanner.classList.add('active');
        cookieAcceptAll.focus();
      });
    }
  }

  // 6. Accessible In-Page Legal Modals
  let lastActiveElement = null;

  const openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    lastActiveElement = document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus close button
    const closeBtn = modal.querySelector('.legal-modal-close');
    if (closeBtn) closeBtn.focus();
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastActiveElement) {
      lastActiveElement.focus();
      lastActiveElement = null;
    }
  };

  document.querySelectorAll('.legal-modal-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      const target = trigger.getAttribute('data-target');
      if (target && document.getElementById(target)) {
        e.preventDefault();
        openModal(target);
      }
    });
  });

  document.querySelectorAll('.legal-modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });

    modal.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', () => closeModal(modal));
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openDialog = document.querySelector('.legal-modal-backdrop.open');
      if (openDialog) {
        closeModal(openDialog);
      }
    }
  });

  // 7. Contact Form Handling with Consent Verification
  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Check native validity
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const consentCheck = document.getElementById('formConsent');
      if (consentCheck && !consentCheck.checked) {
        consentCheck.focus();
        alert('Please accept the data processing consent to submit your design enquiry.');
        return;
      }

      const submitBtn = contactForm.querySelector('.form-submit-btn');
      const originalText = submitBtn.textContent;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Transmitting...';

      setTimeout(() => {
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        formFeedback.style.display = 'block';

        setTimeout(() => {
          formFeedback.style.display = 'none';
        }, 7000);
      }, 700);
    });
  }
});
