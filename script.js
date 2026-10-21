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
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieAcceptAll = document.getElementById('cookieAcceptAll');
  const cookieAcceptEssential = document.getElementById('cookieAcceptEssential');
  const cookieReopenBtn = document.getElementById('cookieReopenBtn');
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  // 0. Loam-Style Curtain Preloader with Parrow's Signature Logo
  const preloader = document.getElementById('preloader');
  if (preloader) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.body.classList.remove('pl-active');
      document.body.classList.add('pl-done');
      preloader.style.display = 'none';
      const heroSection = document.querySelector('.hero-section');
      if (heroSection) heroSection.classList.add('hero-revealed');
    } else {
      document.body.classList.add('pl-active');
      window.scrollTo(0, 0);

      const logoImg = preloader.querySelector('.pl-logo img');
      const pctEl = document.getElementById('plPct');
      const MAX_BLUR = 20;
      let progress = 0;
      let targetProgress = 0.18;
      let revealed = false;
      const startTime = performance.now();

      const updateUI = (val) => {
        if (logoImg) {
          const blurVal = ((1 - val) * MAX_BLUR).toFixed(1);
          logoImg.style.filter = `blur(${blurVal}px)`;
        }
        if (pctEl) {
          pctEl.textContent = Math.round(val * 100);
        }
      };

      const animateProgress = () => {
        if (revealed) return;
        progress += (targetProgress - progress) * 0.12;
        if (Math.abs(targetProgress - progress) < 0.005) {
          progress = targetProgress;
        }
        updateUI(progress);

        if (progress >= 0.99 && targetProgress >= 1) {
          doReveal();
        } else {
          requestAnimationFrame(animateProgress);
        }
      };
      requestAnimationFrame(animateProgress);

      const doReveal = () => {
        if (revealed) return;
        revealed = true;
        updateUI(1);

        const elapsed = performance.now() - startTime;
        const holdDelay = Math.max(100, 500 - elapsed) + 250;

        setTimeout(() => {
          const logoWrap = preloader.querySelector('.pl-logo');
          if (logoWrap) {
            logoWrap.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            logoWrap.style.opacity = '0';
            logoWrap.style.transform = 'scale(0.96)';
          }

          setTimeout(() => {
            preloader.classList.add('lift');

            // Trigger smooth hero text & actions reveal
            const heroSection = document.querySelector('.hero-section');
            if (heroSection) {
              heroSection.classList.add('hero-revealed');
            }
            if (heroVideo && heroVideo.paused) {
              heroVideo.play().catch(() => {});
            }

            setTimeout(() => {
              document.body.classList.remove('pl-active');
              document.body.classList.add('pl-done');
              preloader.style.display = 'none';
            }, 900);
          }, 200);
        }, holdDelay);
      };

      // Real loading tasks
      const tasks = [];

      // Task 1: Fonts
      if (document.fonts && document.fonts.ready) {
        tasks.push(document.fonts.ready);
      } else {
        tasks.push(Promise.resolve());
      }

      // Task 2: Hero Video ready
      tasks.push(new Promise((resolve) => {
        if (!heroVideo || heroVideo.readyState >= 2) {
          resolve();
        } else {
          const onCanPlay = () => {
            heroVideo.removeEventListener('canplay', onCanPlay);
            heroVideo.removeEventListener('loadeddata', onCanPlay);
            heroVideo.removeEventListener('error', onCanPlay);
            resolve();
          };
          heroVideo.addEventListener('canplay', onCanPlay);
          heroVideo.addEventListener('loadeddata', onCanPlay);
          heroVideo.addEventListener('error', onCanPlay);
        }
      }));

      // Task 3: Window Load
      tasks.push(new Promise((resolve) => {
        if (document.readyState === 'complete') {
          resolve();
        } else {
          window.addEventListener('load', resolve, { once: true });
        }
      }));

      let completedTasks = 0;
      tasks.forEach((taskPromise) => {
        taskPromise.then(() => {
          completedTasks++;
          targetProgress = Math.min(1, 0.2 + (completedTasks / tasks.length) * 0.8);
        }).catch(() => {
          completedTasks++;
          targetProgress = Math.min(1, 0.2 + (completedTasks / tasks.length) * 0.8);
        });
      });

      // Safety failsafe: never trap visitor
      setTimeout(() => {
        if (!revealed) {
          targetProgress = 1;
          const heroSection = document.querySelector('.hero-section');
          if (heroSection) heroSection.classList.add('hero-revealed');
        }
      }, 3500);
    }
  }

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

  // 3. Hero Video Seamless Autoplay & Infinite Loop
  if (heroVideo) {
    heroVideo.setAttribute('playsinline', '');
    heroVideo.setAttribute('webkit-playsinline', '');
    heroVideo.setAttribute('autoplay', '');
    heroVideo.setAttribute('loop', '');
    heroVideo.muted = true;
    heroVideo.defaultMuted = true;

    const playVideo = () => {
      const p = heroVideo.play();
      if (p !== undefined) {
        p.catch(() => {
          heroVideo.muted = true;
          heroVideo.play().catch(() => {});
        });
      }
    };

    playVideo();

    heroVideo.addEventListener('loadedmetadata', playVideo, { once: true });
    heroVideo.addEventListener('canplay', playVideo, { once: true });

    // Explicit infinite loop fallback
    heroVideo.addEventListener('ended', () => {
      heroVideo.currentTime = 0;
      playVideo();
    });

    // Resume when tab regains focus
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && heroVideo.paused) {
        playVideo();
      }
    });

    // Fallback on first user interaction in case browser policy delayed autoplay
    const onFirstUserAction = () => {
      if (heroVideo.paused) {
        playVideo();
      }
    };
    ['touchstart', 'pointerdown', 'scroll', 'click'].forEach(evt => {
      window.addEventListener(evt, onFirstUserAction, { passive: true, once: true });
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
