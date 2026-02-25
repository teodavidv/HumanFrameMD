// Page Fixes JavaScript - Functionality and Responsive Behavior

(function() {
  'use strict';

  // Initialize page fixes on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPageFixes);
  } else {
    initPageFixes();
  }

  function initPageFixes() {
    // Fix viewport meta tag if needed
    ensureViewportMeta();
    
    // Fix responsive layout
    handleResponsiveLayout();
    
    // Fix button functionality
    fixButtonBehavior();
    
    // Fix image loading
    fixImageLoading();
    
    // Handle window resize
    window.addEventListener('resize', debounce(handleResponsiveLayout, 250));
  }

  // Ensure proper viewport meta tag
  function ensureViewportMeta() {
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      viewportMeta.content = 'width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0';
      document.head.insertBefore(viewportMeta, document.head.firstChild);
    }
  }

  // Handle responsive layout adjustments
  function handleResponsiveLayout() {
    const width = window.innerWidth;
    const mainContent = document.querySelector('.smb-page-main');
    const sidebar = document.querySelector('.smb-page-right');
    
    if (width <= 768) {
      if (mainContent) {
        mainContent.style.flexDirection = 'column';
      }
      if (sidebar) {
        sidebar.style.maxWidth = '100%';
      }
    } else {
      if (mainContent) {
        mainContent.style.flexDirection = 'row';
      }
      if (sidebar) {
        sidebar.style.maxWidth = '300px';
      }
    }
  }

  // Fix button behavior and click handlers
  function fixButtonBehavior() {
    const buttons = document.querySelectorAll('.smb-click-button, .smb-right-button, [class*="button"]');
    buttons.forEach(button => {
      if (!button.style.cursor) {
        button.style.cursor = 'pointer';
      }
      
      // Add hover effects
      button.addEventListener('mouseenter', function() {
        this.style.opacity = '0.9';
      });
      
      button.addEventListener('mouseleave', function() {
        this.style.opacity = '1';
      });
    });
  }

  // Fix image loading and ensure they display correctly
  function fixImageLoading() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      // Set max-width for responsive images
      if (!img.style.maxWidth) {
        img.style.maxWidth = '100%';
      }
      
      // Handle image load errors
      img.addEventListener('error', function() {
        console.warn('Image failed to load:', this.src);
        // Optionally add a placeholder or error handling
      });
      
      // Ensure images are loaded
      if (img.complete && img.naturalHeight === 0) {
        console.warn('Image appears broken:', img.src);
      }
    });
  }

  // Utility function for debouncing
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Fix popup functionality if present
  function fixPopupBehavior() {
    const popups = document.querySelectorAll('.popup');
    popups.forEach(popup => {
      const closeBtn = popup.querySelector('.close');
      if (closeBtn) {
        closeBtn.addEventListener('click', function() {
          popup.classList.remove('is-active');
        });
      }
      
      // Close popup when overlay is clicked
      const overlay = popup.querySelector('.overlay');
      if (overlay) {
        overlay.addEventListener('click', function() {
          popup.classList.remove('is-active');
        });
      }
    });
  }

  // Initialize popup behavior
  fixPopupBehavior();

  // Ensure proper link behavior
  function fixLinkBehavior() {
    const links = document.querySelectorAll('a[onclick*="linkMethod"]');
    links.forEach(link => {
      link.style.cursor = 'pointer';
    });
  }

  fixLinkBehavior();

  // Log initialization complete
  console.log('Page fixes initialized successfully');
})();
