/**
 * Apex Build Premium Construction JS Application
 * Includes Sticky Nav, Active Section Tracking, Preloader, Scroll Reveal,
 * Stat Counters, Services Drawers, Project Filter, Gallery Lightbox,
 * Modal Triggers, Form Validations, and Toast System.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Preloader Fade Out
     ========================================================================== */
  const preloader = document.getElementById('preloader');
  
  // Wait until everything (images, stylesheets) has loaded
  window.addEventListener('load', () => {
    // Small timeout to allow the user to notice the glowing logo pulse
    setTimeout(() => {
      preloader.classList.add('fade-out');
    }, 600);
  });

  // Fallback in case window load takes too long (e.g. slow network)
  setTimeout(() => {
    if (!preloader.classList.contains('fade-out')) {
      preloader.classList.add('fade-out');
    }
  }, 3000);


  /* ==========================================================================
     2. Mobile Menu Toggle & Body Scroll Lock
     ========================================================================== */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    menuToggle.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('active');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Lock background scrolling
  }

  function closeMobileMenu() {
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('active');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Restore scrolling
  }

  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  // Close mobile menu when links are clicked
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });


  /* ==========================================================================
     3. Sticky Header, Scroll Progress & Back-to-Top
     ========================================================================== */
  const mainHeader = document.getElementById('main-header');
  const scrollProgressBar = document.getElementById('scroll-progress-bar');
  const backToTopBtn = document.getElementById('back-to-top');
  const progressCircle = document.querySelector('.progress-ring-circle');
  
  // Calculate properties of the progress ring (Radius is 22px)
  const radius = progressCircle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius; // Approx. 138.23
  progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
  progressCircle.style.strokeDashoffset = circumference;

  function updateScrollProgress() {
    const scrollY = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // 3.1 Header Sticky state transition
    if (scrollY > 50) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }

    // 3.2 Top Bar scroll progress loader width
    if (documentHeight > 0) {
      const scrollPercent = (scrollY / documentHeight) * 100;
      scrollProgressBar.style.width = `${scrollPercent}%`;

      // 3.3 Back-to-top button visibility and progress ring update
      if (scrollY > 300) {
        backToTopBtn.classList.add('active');
      } else {
        backToTopBtn.classList.remove('active');
      }

      // Fill progress ring path
      const offset = circumference - (scrollPercent / 100) * circumference;
      progressCircle.style.strokeDashoffset = offset;
    } else {
      scrollProgressBar.style.width = '0%';
      backToTopBtn.classList.remove('active');
    }
  }

  window.addEventListener('scroll', updateScrollProgress);
  updateScrollProgress(); // Run once initially on load

  // Scroll to top smooth click
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });


  /* ==========================================================================
     4. Active Link Highlight (Scrollspy)
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  const observerOptions = {
    root: null, // Viewport
    rootMargin: '-20% 0px -40% 0px', // Trigger when section occupies the core viewport area
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        // Update desktop links
        desktopLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        // Update mobile links
        mobileLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    sectionObserver.observe(section);
  });


  /* ==========================================================================
     5. Scroll Reveal Animations (Custom Intersection Observer)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserverOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px', // Trigger slightly before element rolls into view
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.getAttribute('data-delay') || 0;
        
        if (delay > 0) {
          setTimeout(() => {
            el.classList.add('revealed');
          }, delay);
        } else {
          el.classList.add('revealed');
        }
        
        revealObserver.unobserve(el); // Only reveal once
      }
    });
  }, revealObserverOptions);

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });


  /* ==========================================================================
     6. Dynamic Stat Counter Animation
     ========================================================================== */
  const counters = document.querySelectorAll('.counter');
  
  const counterObserverOptions = {
    root: null,
    threshold: 0.5 // Trigger when card is clearly visible
  };

  const startCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2000; // 2 seconds total count animation
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out quadratic function
      const easeProgress = progress * (2 - progress);
      const currentValue = Math.floor(easeProgress * target);
      
      el.textContent = currentValue;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        el.textContent = target; // Ensure exact final number is printed
      }
    }
    requestAnimationFrame(updateCounter);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounter(entry.target);
        counterObserver.unobserve(entry.target); // Trigger only once
      }
    });
  }, counterObserverOptions);

  counters.forEach(counter => {
    counterObserver.observe(counter);
  });


  /* ==========================================================================
     7. Services Sliding Drawers
     ========================================================================== */
  const learnMoreButtons = document.querySelectorAll('.learn-more-trigger');
  const drawerCloseButtons = document.querySelectorAll('.drawer-close');

  learnMoreButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const serviceId = btn.getAttribute('data-service');
      const drawer = document.getElementById(`drawer-${serviceId}`);
      if (drawer) {
        drawer.classList.add('active');
      }
    });
  });

  drawerCloseButtons.forEach(closeBtn => {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const drawer = closeBtn.parentElement;
      if (drawer) {
        drawer.classList.remove('active');
      }
    });
  });

  // Close service drawers when clicking anywhere outside card/drawer
  document.addEventListener('click', (e) => {
    const activeDrawers = document.querySelectorAll('.service-drawer.active');
    activeDrawers.forEach(drawer => {
      if (!drawer.contains(e.target) && !e.target.classList.contains('learn-more-trigger')) {
        drawer.classList.remove('active');
      }
    });
  });


  /* ==========================================================================
     8. Projects Gallery Filter
     ========================================================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.projects-grid .project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active states on button tabs
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        // Visual transition: scale and fade-out first
        if (filterVal === 'all' || category === filterVal) {
          card.classList.remove('hide');
          // Mini timeout to re-trigger scale transition
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          card.classList.add('hide');
        }
      });
    });
  });


  /* ==========================================================================
     9. Project Lightbox Dialog Modal
     ========================================================================== */
  const lightboxModal = document.getElementById('project-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTag = document.getElementById('lightbox-tag');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxClient = document.getElementById('lightbox-client');
  const lightboxLocation = document.getElementById('lightbox-location');
  const lightboxBudget = document.getElementById('lightbox-budget');
  const lightboxDate = document.getElementById('lightbox-date');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxClose = lightboxModal.querySelector('.lightbox-close');
  const lightboxOverlay = lightboxModal.querySelector('.lightbox-overlay');

  function openLightbox(card) {
    const imgPath = card.querySelector('.project-img').src;
    const tagText = card.querySelector('.project-tag').textContent;
    const titleText = card.querySelector('.project-card-title').textContent;
    
    // Details parsed from hidden nodes inside card
    const detailNode = card.querySelector('.project-detail-content');
    const clientText = detailNode.querySelector('.detail-client').textContent;
    const locationText = detailNode.querySelector('.detail-location').textContent;
    const budgetText = detailNode.querySelector('.detail-budget').textContent;
    const dateText = detailNode.querySelector('.detail-date').textContent;
    const descText = detailNode.querySelector('.detail-description').textContent;

    // Inject data
    lightboxImg.src = imgPath;
    lightboxImg.alt = titleText;
    lightboxTag.textContent = tagText;
    lightboxTitle.textContent = titleText;
    lightboxClient.textContent = clientText;
    lightboxLocation.textContent = locationText;
    lightboxBudget.textContent = budgetText;
    lightboxDate.textContent = dateText;
    lightboxDesc.textContent = descText;

    // Trigger visual popup and body scroll lock
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Event Delegation for clicking project cards
  document.getElementById('projects-grid').addEventListener('click', (e) => {
    const card = e.target.closest('.project-card');
    // Ensure the close drawer triggers inside service section don't clash here
    if (card) {
      openLightbox(card);
    }
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxOverlay.addEventListener('click', closeLightbox);

  // Close lightbox on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });


  /* ==========================================================================
     10. Get Quote Modal triggers
     ========================================================================== */
  const quoteModal = document.getElementById('quote-modal');
  const quoteModalClose = quoteModal.querySelector('.quote-modal-close');
  const quoteModalOverlay = quoteModal.querySelector('.quote-modal-overlay');

  function openQuoteModal() {
    quoteModal.classList.add('active');
    quoteModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeQuoteModal() {
    quoteModal.classList.remove('active');
    quoteModal.setAttribute('aria-hidden', 'true');
    // Only restore scroll if lightbox modal isn't also open
    if (!lightboxModal.classList.contains('active')) {
      document.body.style.overflow = '';
    }
  }

  // Handle all triggers matching class/attribute
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.modal-trigger');
    if (trigger && trigger.getAttribute('data-modal') === 'quote-modal') {
      // Close lightbox if trigger was clicked inside the lightbox
      if (lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
      openQuoteModal();
    }
  });

  quoteModalClose.addEventListener('click', closeQuoteModal);
  quoteModalOverlay.addEventListener('click', closeQuoteModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && quoteModal.classList.contains('active')) {
      closeQuoteModal();
    }
  });


  /* ==========================================================================
     11. Form Validation (Contact & Quote Form) & Toast System
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const quoteForm = document.getElementById('quote-form');
  const successToast = document.getElementById('toast-success');
  const toastClose = successToast.querySelector('.toast-close');
  const toastMsg = document.getElementById('toast-msg');

  // Regex patterns
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const PHONE_REGEX = /^\+?[0-9\s\-()]{7,20}$/;

  function validateInput(input, validationFn, errorMsgId) {
    const group = input.closest('.input-group');
    const value = input.value.trim();
    const isValid = validationFn(value);

    if (!isValid) {
      group.classList.add('invalid');
      return false;
    } else {
      group.classList.remove('invalid');
      return true;
    }
  }

  // Set up real-time validation feedback clearing on keystroke
  const attachRealTimeValidation = (formInputs) => {
    formInputs.forEach(input => {
      // Input event clears errors as user types/interacts
      input.addEventListener('input', () => {
        const group = input.closest('.input-group');
        group.classList.remove('invalid');
      });
      // Blur checks it
      input.addEventListener('blur', () => {
        const value = input.value.trim();
        if (value === '') {
          // If optional and blank, don't show invalid. Here all are marked required.
          input.closest('.input-group').classList.add('invalid');
        }
      });
    });
  };

  const contactInputs = contactForm.querySelectorAll('input, textarea, select');
  const quoteInputs = quoteForm.querySelectorAll('input, textarea, select');
  
  attachRealTimeValidation(contactInputs);
  attachRealTimeValidation(quoteInputs);

  // Validation functions
  const isNotEmpty = val => val.length > 0;
  const isValidEmail = val => EMAIL_REGEX.test(val);
  const isValidPhone = val => PHONE_REGEX.test(val);

  // Trigger Toast Notification
  function showToast(message) {
    toastMsg.textContent = message;
    successToast.classList.add('active');

    // Automatically dismiss after 5 seconds
    setTimeout(() => {
      hideToast();
    }, 5000);
  }

  function hideToast() {
    successToast.classList.remove('active');
  }

  toastClose.addEventListener('click', hideToast);

  // Form Submit: Contact
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const phoneInput = document.getElementById('contact-phone');
    const projectInput = document.getElementById('contact-project');
    const msgInput = document.getElementById('contact-message');

    // Run all validations
    const isNameValid = validateInput(nameInput, isNotEmpty, 'name-error');
    const isEmailValid = validateInput(emailInput, isValidEmail, 'email-error');
    const isPhoneValid = validateInput(phoneInput, isValidPhone, 'phone-error');
    const isProjectValid = validateInput(projectInput, isNotEmpty, 'project-error');
    const isMsgValid = validateInput(msgInput, isNotEmpty, 'message-error');

    if (isNameValid && isEmailValid && isPhoneValid && isProjectValid && isMsgValid) {
      // Form is valid! Simulate API submission
      const submitBtn = contactForm.querySelector('.btn-submit');
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        // Reset fields
        contactForm.reset();
        
        // Trigger Toast
        showToast('Your estimating inquiry has been received! An Apex engineer will contact you in 24 hours.');
      }, 1500);
    }
  });

  // Form Submit: Quote Modal
  quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('quote-name');
    const emailInput = document.getElementById('quote-email');
    const phoneInput = document.getElementById('quote-phone');
    const projectInput = document.getElementById('quote-project');
    const msgInput = document.getElementById('quote-message');

    const isNameValid = validateInput(nameInput, isNotEmpty, 'qname-error');
    const isEmailValid = validateInput(emailInput, isValidEmail, 'qemail-error');
    const isPhoneValid = validateInput(phoneInput, isValidPhone, 'qphone-error');
    const isProjectValid = validateInput(projectInput, isNotEmpty, 'qproject-error');
    const isMsgValid = validateInput(msgInput, isNotEmpty, 'qmessage-error');

    if (isNameValid && isEmailValid && isPhoneValid && isProjectValid && isMsgValid) {
      const submitBtn = document.getElementById('btn-submit-quote');
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      // Select spinner inside button
      const spinner = document.getElementById('quote-spinner');
      spinner.style.display = 'inline-block';
      submitBtn.querySelector('span').style.display = 'none';

      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        spinner.style.display = 'none';
        submitBtn.querySelector('span').style.display = 'inline-block';

        quoteForm.reset();
        closeQuoteModal();

        showToast('Your quote request is registered! Our estimating officer will reach out with pricing options.');
      }, 1500);
    }
  });

});
