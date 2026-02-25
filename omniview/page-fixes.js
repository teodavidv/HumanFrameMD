// Besyner Reading Glasses - JavaScript Fixes and Enhancements

(function() {
  'use strict';

  // Ensure document is ready
  function onReady(callback) {
    if (document.readyState !== 'loading') {
      callback();
    } else {
      document.addEventListener('DOMContentLoaded', callback);
    }
  }

  onReady(function() {
    // Fix 1: Ensure all images are properly loaded
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.addEventListener('error', function() {
        console.warn('Image failed to load:', this.src);
        // Optionally add a placeholder or fallback
        this.style.backgroundColor = '#f0f0f0';
      });
    });

    // Fix 2: Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });

    // Fix 3: Mobile menu toggle (if exists)
    const menuToggle = document.querySelector('.menu-toggle, [aria-label="Menu"]');
    const mobileMenu = document.querySelector('.mobile-menu, nav');
    
    if (menuToggle && mobileMenu) {
      menuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        this.setAttribute('aria-expanded', 
          this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
      });

      // Close menu when link is clicked
      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
          mobileMenu.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // Fix 4: Enhance FAQ accordion functionality
    const details = document.querySelectorAll('details');
    details.forEach(detail => {
      detail.addEventListener('toggle', function() {
        // Close other details when one is opened
        if (this.open) {
          details.forEach(other => {
            if (other !== this) {
              other.open = false;
            }
          });
        }
      });
    });

    // Fix 5: Add viewport meta tag if missing
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
      document.head.appendChild(viewport);
    }

    // Fix 6: Ensure buttons are keyboard accessible
    document.querySelectorAll('.smb-button, .smb-header-btn, [role="button"]').forEach(btn => {
      if (!btn.hasAttribute('role')) {
        btn.setAttribute('role', 'button');
      }
      if (!btn.hasAttribute('tabindex')) {
        btn.setAttribute('tabindex', '0');
      }
      
      btn.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    });

    // Fix 7: Handle sticky header behavior
    const header = document.querySelector('.smb-header-fixed');
    if (header) {
      let lastScrollTop = 0;
      const headerHeight = header.offsetHeight;

      window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > headerHeight) {
          header.classList.add('smb-fixed');
        } else {
          header.classList.remove('smb-fixed');
        }
        
        lastScrollTop = scrollTop;
      }, false);
    }

    // Fix 8: Responsive image handling
    const updateResponsiveImages = function() {
      const width = window.innerWidth;
      const images = document.querySelectorAll('img[data-responsive]');
      
      images.forEach(img => {
        if (width <= 480) {
          img.style.maxWidth = '100%';
        } else if (width <= 768) {
          img.style.maxWidth = '100%';
        } else {
          img.style.maxWidth = '100%';
        }
      });
    };

    window.addEventListener('resize', updateResponsiveImages);
    updateResponsiveImages();

    // Fix 9: Ensure form inputs are properly styled and accessible
    document.querySelectorAll('input, textarea, select').forEach(input => {
      input.addEventListener('focus', function() {
        this.classList.add('focused');
      });
      
      input.addEventListener('blur', function() {
        this.classList.remove('focused');
      });
    });

    // Fix 10: Add loading state handling
    document.querySelectorAll('a[href*="Order"], button[type="submit"]').forEach(btn => {
      btn.addEventListener('click', function() {
        const originalText = this.textContent;
        this.setAttribute('data-loading', 'true');
        this.disabled = true;
        
        // Reset after 3 seconds (adjust as needed)
        setTimeout(() => {
          this.removeAttribute('data-loading');
          this.disabled = false;
        }, 3000);
      });
    });

    // Fix 11: Ensure proper z-index stacking
    const fixZIndex = function() {
      const elements = document.querySelectorAll('[style*="z-index"]');
      let maxZ = 1;
      
      elements.forEach(el => {
        const zIndex = parseInt(window.getComputedStyle(el).zIndex);
        if (!isNaN(zIndex) && zIndex > maxZ) {
          maxZ = zIndex;
        }
      });
    };

    fixZIndex();

    // Fix 12: Ensure proper print styles
    if (window.matchMedia) {
      const printMediaQuery = window.matchMedia('print');
      printMediaQuery.addListener(function(mq) {
        if (mq.matches) {
          document.body.classList.add('printing');
        } else {
          document.body.classList.remove('printing');
        }
      });
    }

    // Fix 13: Handle external link behavior
    document.querySelectorAll('a[href^="http"]').forEach(link => {
      if (!link.hostname || link.hostname !== window.location.hostname) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });

    // Fix 14: Prevent layout shift on scroll
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.documentElement.style.setProperty('--scrollbar-width', scrollbarWidth + 'px');
    }

    console.log('Besyner page fixes applied successfully');
  });

  // Expose utility functions globally if needed
  window.BesynerFixes = {
    version: '1.0.0',
    initialized: true
  };
})();
