/**
 * Online Quran Classes - Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initHeaderScroll();
  initSmoothScroll();
  initScrollReveal();
  initPhoneInput();
  initEnrollForm();
});

/**
 * Mobile navigation toggle
 */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const compactToggle = document.querySelector('.compact-toggle');
  const menu = document.querySelector('.nav-menu');
  const compactMenu = document.querySelector('.compact-menu');
  const links = document.querySelectorAll('.nav-menu a');
  const compactLinks = document.querySelectorAll('.compact-menu a');
  const header = document.querySelector('.header');

  if (!toggle || !menu) return;

  let compactMenuCloseTimeout;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    menu.classList.toggle('active');
    document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
  });

  const openCompactMenu = () => {
    clearTimeout(compactMenuCloseTimeout);
    compactMenu?.classList.add('compact-open');
    compactToggle?.setAttribute('aria-expanded', 'true');
  };

  const closeCompactMenu = () => {
    compactMenu?.classList.remove('compact-open');
    compactToggle?.setAttribute('aria-expanded', 'false');
  };

  const scheduleCompactMenuClose = () => {
    clearTimeout(compactMenuCloseTimeout);
    compactMenuCloseTimeout = setTimeout(() => {
      closeCompactMenu();
    }, 90);
  };

  compactToggle?.addEventListener('click', () => {
    const isOpen = compactMenu?.classList.toggle('compact-open');
    compactToggle.setAttribute('aria-expanded', String(isOpen));
  });

  compactToggle?.addEventListener('mouseenter', () => {
    if (window.innerWidth > 768) {
      openCompactMenu();
    }
  });

  compactToggle?.addEventListener('mouseleave', (e) => {
    if (window.innerWidth <= 768) return;
    if (compactMenu?.contains(e.relatedTarget)) return;
    scheduleCompactMenuClose();
  });

  compactMenu?.addEventListener('mouseenter', () => {
    if (window.innerWidth > 768 && header?.classList.contains('scrolled')) {
      openCompactMenu();
    }
  });

  compactMenu?.addEventListener('mouseleave', (e) => {
    if (window.innerWidth <= 768) return;
    if (compactToggle?.contains(e.relatedTarget)) return;
    scheduleCompactMenuClose();
  });

  // Close menu when clicking a link
  links.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      menu.classList.remove('active');
      closeCompactMenu();
      document.body.style.overflow = '';
    });
  });

  compactLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeCompactMenu();
    });
  });

  document.addEventListener('click', (e) => {
    const clickedInsideHeader = header?.contains(e.target);
    const clickedCompactToggle = compactToggle?.contains(e.target);
    const clickedMenu = compactMenu?.contains(e.target);
    if (!clickedInsideHeader && !clickedCompactToggle && !clickedMenu) {
      closeCompactMenu();
    }
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      toggle.classList.remove('active');
      menu.classList.remove('active');
      closeCompactMenu();
      document.body.style.overflow = '';
    }
  });
}

/**
 * Header shadow on scroll
 */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  const compactToggle = document.querySelector('.compact-toggle');
  const compactMenu = document.querySelector('.compact-menu');
  if (!header) return;

  const getScrollTop = () => {
    const el = document.documentElement;
    const body = document.body;
    return Math.max(
      window.scrollY || 0,
      window.pageYOffset || 0,
      el?.scrollTop || 0,
      body?.scrollTop || 0
    );
  };

  const handleScroll = () => {
    const scrolled = getScrollTop() > 20;
    document.documentElement.classList.toggle('scrolled-page', scrolled);
    if (scrolled) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
      compactMenu?.classList.remove('compact-open');
      compactToggle?.setAttribute('aria-expanded', 'false');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  if (window.visualViewport) {
    window.visualViewport.addEventListener('scroll', handleScroll, { passive: true });
    window.visualViewport.addEventListener('resize', handleScroll, { passive: true });
  }
  window.addEventListener('orientationchange', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header')?.offsetHeight || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Scroll reveal animations
 */
function initScrollReveal() {
  const revealElements = [
    ...document.querySelectorAll('.course-card'),
    ...document.querySelectorAll('.step'),
    ...document.querySelectorAll('.feature'),
    ...document.querySelectorAll('.enroll-form'),
    ...document.querySelectorAll('.review-card'),
    ...document.querySelectorAll('.reviews-note'),
    ...document.querySelectorAll('.reviews-cta')
  ];

  if (!('IntersectionObserver' in window) || revealElements.length === 0) {
    // Fallback: just show everything
    revealElements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  revealElements.forEach((el, index) => {
    el.classList.add('reveal');
    const delayClass = `delay-${(index % 4) + 1}`;
    el.classList.add(delayClass);
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.05,
      rootMargin: '40px 0px 40px 0px'
    }
  );

  revealElements.forEach(el => observer.observe(el));
}

/**
 * Phone number input - country code + validation
 */
function initPhoneInput() {
  const countrySelect = document.getElementById('country-code');
  const phoneInput = document.getElementById('phone');
  if (!countrySelect || !phoneInput) return;

  function updatePhoneField() {
    const selected = countrySelect.options[countrySelect.selectedIndex];
    const length = selected?.dataset.length ? parseInt(selected.dataset.length, 10) : 10;
    const maxLength = selected?.dataset.lengthMax ? parseInt(selected.dataset.lengthMax, 10) : length;
    phoneInput.maxLength = maxLength;
    phoneInput.placeholder = `Enter ${length}${maxLength > length ? '-' + maxLength : ''} digits (no spaces)`;
    phoneInput.setAttribute('data-required-length', length);
    phoneInput.setAttribute('data-max-length', maxLength);
  }

  countrySelect.addEventListener('change', updatePhoneField);
  updatePhoneField();
}

/**
 * Validate phone number length for selected country (only when phone is provided)
 */
function validatePhoneLength() {
  const countrySelect = document.getElementById('country-code');
  const phoneInput = document.getElementById('phone');
  if (!countrySelect || !phoneInput) return true;

  const digits = phoneInput.value.replace(/\D/g, '');
  if (digits.length === 0) return true; // Optional field - skip validation when empty

  const selected = countrySelect.options[countrySelect.selectedIndex];
  const minLength = selected?.dataset.length ? parseInt(selected.dataset.length, 10) : 0;
  const maxLength = selected?.dataset.lengthMax ? parseInt(selected.dataset.lengthMax, 10) : minLength;

  if (digits.length < minLength || digits.length > maxLength) {
    phoneInput.setCustomValidity(`Enter ${minLength}${maxLength > minLength ? '-' + maxLength : ''} digits for this country`);
    return false;
  }
  phoneInput.setCustomValidity('');
  return true;
}

/**
 * Enrollment form handling - submits to Formspree
 * Setup: Replace YOUR_FORM_ID in the form's data-formspree-id with your Formspree form ID
 * Get your form ID at https://formspree.io
 */
function initEnrollForm() {
  const form = document.querySelector('.enroll-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validatePhoneLength()) {
      document.getElementById('phone')?.reportValidity();
      return;
    }

    const formId = form.dataset.formspreeId || form.getAttribute('action')?.split('/').pop();
    if (!formId || formId === 'YOUR_FORM_ID') {
      alert('Please set up Formspree: Replace YOUR_FORM_ID with your form ID from formspree.io');
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    try {
      const formData = new FormData(form);
      const countryCode = form.querySelector('#country-code')?.value || '';
      const phone = form.querySelector('#phone')?.value?.replace(/\D/g, '') || '';
      if (countryCode && phone) {
        formData.set('phone', `${countryCode} ${phone}`);
        formData.delete('country_code');
      } else {
        formData.delete('country_code');
        formData.delete('phone');
      }
      const response = await fetch(`https://formspree.io/f/${formId}`, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        btn.textContent = 'Submitted! ✓';
        form.reset();
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Something went wrong');
      }
    } catch (err) {
      btn.textContent = 'Try again';
      alert(err.message || 'Failed to submit. Please try again.');
    } finally {
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
      }, 3000);
    }
  });
}
