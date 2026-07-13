document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // MOBILE NAVIGATION MENU TOGGLE
  // ==========================================
  const toggleBtn = document.querySelector('.navbar-toggle');
  const navMenu = document.querySelector('.navbar-nav');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('active');
      
      // Change toggle icon
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('active')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-times');
        } else {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
        navMenu.classList.remove('active');
        const icon = toggleBtn.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
    });

    // Close menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = toggleBtn.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      });
    });
  }

  // ==========================================
  // NAVBAR SCROLL EFFECT
  // ==========================================
  const navbar = document.querySelector('.navbar');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Check initial scroll state

  // ==========================================
  // ACTIVE NAV LINK HIGHLIGHTER
  // ==========================================
  const currentPath = window.location.pathname;
  const pageLinks = document.querySelectorAll('.navbar-nav .nav-link');
  
  pageLinks.forEach(link => {
    const href = link.getAttribute('href');
    // Check if path match or if home path matches index.html
    if (currentPath.endsWith(href) || 
        (href === 'index.html' && (currentPath.endsWith('/') || currentPath === '')) ||
        (currentPath.includes('dashboard') && href.includes('dashboard')) ||
        (currentPath.includes('story') && href.includes('story')) ||
        (currentPath.includes('about') && href.includes('about'))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // ==========================================
  // INTERSECTION OBSERVER: SCROLL ANIMATIONS
  // ==========================================
  const fadeUpElements = document.querySelectorAll('.fade-up-element');
  
  if ('IntersectionObserver' in window) {
    const animationObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Animates once
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters viewport
    });

    fadeUpElements.forEach(el => animationObserver.observe(el));
  } else {
    // Fallback if observer not supported
    fadeUpElements.forEach(el => el.classList.add('visible'));
  }

  // ==========================================
  // KPI COUNT-UP ANIMATION
  // ==========================================
  const countUpElements = document.querySelectorAll('.count-up');
  
  const animateCount = (el) => {
    const targetVal = parseFloat(el.getAttribute('data-value'));
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    const duration = 2000; // milliseconds
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Easing function (easeOutQuad)
      const easeProgress = progress * (2 - progress);
      const currentVal = easeProgress * targetVal;
      
      el.textContent = `${prefix}${currentVal.toFixed(decimals)}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        el.textContent = `${prefix}${targetVal.toFixed(decimals)}${suffix}`;
      }
    };

    requestAnimationFrame(updateCount);
  };

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.5
    });

    countUpElements.forEach(el => counterObserver.observe(el));
  } else {
    // Fallback count up immediately
    countUpElements.forEach(el => animateCount(el));
  }

  // ==========================================
  // TABLEAU EMBED LOADER HANDLER
  // ==========================================
  // Check if there is an embed container on this page
  const embedLoader = document.querySelector('.embed-loader');
  const iframeContainer = document.querySelector('.embed-inner');

  if (embedLoader && iframeContainer) {
    // Check if the user has pasted the Tableau embed
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          // If an iframe or embed script executes, watch for its frame completion or just hide after a short delay
          setTimeout(() => {
            embedLoader.style.opacity = '0';
            setTimeout(() => {
              embedLoader.style.display = 'none';
            }, 500);
          }, 1500); // 1.5s delay to allow rendering
        }
      });
    });

    observer.observe(iframeContainer, { childList: true });

    // Fallback: hide loader after 4 seconds regardless if code wasn't injected yet or failed
    setTimeout(() => {
      if (embedLoader.style.display !== 'none') {
        embedLoader.style.opacity = '0';
        setTimeout(() => {
          embedLoader.style.display = 'none';
        }, 500);
      }
    }, 4000);
  }

  // ==========================================
  // ABOUT PAGE SIDEBAR NAVIGATION SYNC
  // ==========================================
  const docSections = document.querySelectorAll('.doc-section');
  const docNavLinks = document.querySelectorAll('.doc-nav-link');

  if (docSections.length > 0 && docNavLinks.length > 0) {
    const sectionPositions = [];
    
    // Find initial offsets
    const updatePositions = () => {
      sectionPositions.length = 0;
      docSections.forEach(sec => {
        sectionPositions.push({
          id: sec.getAttribute('id'),
          top: sec.getBoundingClientRect().top + window.scrollY - 150
        });
      });
    };
    
    updatePositions();
    window.addEventListener('resize', updatePositions);
    
    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY;
      let activeSectionId = docSections[0].getAttribute('id');

      for (let i = 0; i < sectionPositions.length; i++) {
        if (scrollPos >= sectionPositions[i].top) {
          activeSectionId = sectionPositions[i].id;
        }
      }

      docNavLinks.forEach(link => {
        if (link.getAttribute('href') === `#${activeSectionId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    });
  }
});
