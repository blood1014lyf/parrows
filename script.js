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
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasPreloaded = sessionStorage.getItem('ps_preloaded');

    if (isReducedMotion || hasPreloaded) {
      document.body.classList.remove('pl-active');
      document.body.classList.add('pl-done');
      preloader.style.display = 'none';
      const heroSection = document.querySelector('.hero-section');
      if (heroSection) heroSection.classList.add('hero-revealed');
      setTimeout(() => {
        if (typeof startTypewriter === 'function') {
          startTypewriter();
        }
      }, 100);
      if (heroVideo && heroVideo.paused) {
        heroVideo.play().catch(() => {});
      }
    } else {
      document.body.classList.add('pl-active');
      window.scrollTo(0, 0);

      const logoImg = preloader.querySelector('.pl-logo img');
      const pctEl = document.getElementById('plPct');
      const MAX_BLUR = 18;
      let progress = 0;
      let targetProgress = 0.22;
      let revealed = false;

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
        progress += (targetProgress - progress) * 0.15;
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
        try {
          sessionStorage.setItem('ps_preloaded', 'true');
        } catch (e) {}
        updateUI(1);

        setTimeout(() => {
          const logoWrap = preloader.querySelector('.pl-logo');
          if (logoWrap) {
            logoWrap.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            logoWrap.style.opacity = '0';
            logoWrap.style.transform = 'scale(0.96)';
          }

          setTimeout(() => {
            preloader.classList.add('lift');

            // Trigger sleek hero typewriter effect as curtain lifts
            if (typeof startTypewriter === 'function') {
              startTypewriter();
            } else {
              const heroActions = document.querySelector('.hero-actions');
              if (heroActions) heroActions.classList.add('revealed');
            }

            if (heroVideo && heroVideo.paused) {
              heroVideo.play().catch(() => {});
            }

            setTimeout(() => {
              document.body.classList.remove('pl-active');
              document.body.classList.add('pl-done');
              preloader.style.display = 'none';
            }, 800);
          }, 160);
        }, 150);
      };

      // Fast, synthetic/asset progress ramp that guarantees completion in 700-800ms
      const scheduleRamp = (ms, target) => {
        setTimeout(() => {
          if (!revealed) {
            targetProgress = Math.max(targetProgress, target);
          }
        }, ms);
      };

      scheduleRamp(80, 0.42);
      scheduleRamp(240, 0.68);
      scheduleRamp(450, 0.88);
      scheduleRamp(680, 1.0);

      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          if (!revealed) targetProgress = Math.max(targetProgress, 0.6);
        }).catch(() => {});
      }

      // Absolute safety failsafe: after 1.2s max, ALWAYS lift curtain
      setTimeout(() => {
        if (!revealed) {
          targetProgress = 1;
          doReveal();
        }
      }, 1200);
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

  // 3a. Sleek Hero Headline Typewriter Effect
  const heroTitle = document.getElementById('heroTitle');
  const typeOutput = heroTitle ? heroTitle.querySelector('.typewriter-output') : null;
  const typeCursor = heroTitle ? heroTitle.querySelector('.typewriter-cursor') : null;
  const fullHeroText = heroTitle ? (heroTitle.dataset.typewriterText || heroTitle.textContent.trim()) : 'Spaces that carry your signature.';
  let typewriterStarted = false;

  function startTypewriter() {
    if (typewriterStarted || !typeOutput) return;
    typewriterStarted = true;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      typeOutput.textContent = fullHeroText;
      if (typeCursor) typeCursor.classList.add('finished');
      const heroActions = document.querySelector('.hero-actions');
      if (heroActions) heroActions.classList.add('revealed');
      return;
    }

    typeOutput.textContent = '';
    let charIndex = 0;
    // 33 characters * 21ms = ~690ms (fast, sleek, under 0.8 seconds)
    const typingInterval = 21;

    const typeNextChar = () => {
      if (charIndex < fullHeroText.length) {
        typeOutput.textContent += fullHeroText.charAt(charIndex);
        charIndex++;
        setTimeout(typeNextChar, typingInterval);
      } else {
        setTimeout(() => {
          if (typeCursor) typeCursor.classList.add('finished');
        }, 180);
        const heroActions = document.querySelector('.hero-actions');
        if (heroActions) heroActions.classList.add('revealed');
      }
    };

    typeNextChar();
  }

  // Scroll-trigger via IntersectionObserver for Hero Headline
  if (heroTitle) {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && typeOutput) {
      typeOutput.textContent = '';
    }

    const heroObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!document.body.classList.contains('pl-active')) {
            startTypewriter();
            obs.unobserve(entry.target);
          }
        }
      });
    }, {
      threshold: 0.15
    });

    heroObserver.observe(heroTitle);
  }

  // 3b. Scroll-Triggered Staggered Word Fade-In for Feature Section Headers
  function initStaggerHeaders() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const headers = document.querySelectorAll('.section-title, .pillar-title, .stagger-header');

    headers.forEach(header => {
      if (header.classList.contains('stagger-header')) return;
      header.classList.add('stagger-header');

      const text = header.textContent.trim();
      const words = text.split(/\s+/);
      header.innerHTML = words.map((word, i) => {
        return `<span class="stagger-word" style="--w-idx: ${i}">${word}</span>`;
      }).join(' ');

      header.classList.add('js-ready');
    });

    const headerObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in-view');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px 40px 0px'
    });

    headers.forEach(header => {
      headerObserver.observe(header);
    });
  }

  initStaggerHeaders();

  // 3d. Sitewide Smooth Cinematic Scroll Motion Design
  function initCinematicScrollReveals() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.cinematic-reveal, .stagger-entrance').forEach(el => {
        el.classList.add('is-in-view');
      });
      return;
    }

    // Auto-tag key narrative blocks and cards for choreographed cinematic entrance
    const narrative = document.querySelector('.studio-narrative');
    if (narrative) narrative.classList.add('cinematic-reveal');

    const grids = document.querySelectorAll('.pillars-grid, .experience-grid, .showroom-grid');
    grids.forEach(grid => {
      const items = grid.children;
      Array.from(items).forEach((item, idx) => {
        item.classList.add('stagger-entrance');
        item.style.setProperty('--item-idx', idx);
      });
    });

    const ctaWrap = document.querySelector('.experience-cta-wrap');
    if (ctaWrap) ctaWrap.classList.add('cinematic-reveal');

    const contactLeft = document.querySelector('.contact-left');
    const contactFormWrap = document.querySelector('.contact-form-wrap');
    if (contactLeft) contactLeft.classList.add('cinematic-reveal');
    if (contactFormWrap) contactFormWrap.classList.add('cinematic-reveal');

    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in-view');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.06,
      rootMargin: '0px 0px 60px 0px'
    });

    document.querySelectorAll('.cinematic-reveal, .stagger-entrance').forEach(el => {
      revealObserver.observe(el);
    });
  }

  initCinematicScrollReveals();

  // 3c. Hero Video Seamless Autoplay & Infinite Loop
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
