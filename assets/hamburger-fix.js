// Hamburger menu fix for static HTML export
(function() {
  function initHamburgerMenu() {
    var hamburgerButton = document.querySelector('[class*="hamburger-button"]');
    var mobileNav = document.querySelector('nav[class*="mobile-nav"]');
    
    if (hamburgerButton && mobileNav) {
      // Find the closed class dynamically
      var closedClass = null;
      mobileNav.classList.forEach(function(c) {
        if (c.indexOf('closed') !== -1) {
          closedClass = c;
        }
      });
      
      if (!closedClass) {
        closedClass = 'MobileMenu-module-scss-module__LV3ulG__closed';
      }
      
      hamburgerButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (mobileNav.classList.contains(closedClass)) {
          mobileNav.classList.remove(closedClass);
          hamburgerButton.setAttribute('aria-expanded', 'true');
        } else {
          mobileNav.classList.add(closedClass);
          hamburgerButton.setAttribute('aria-expanded', 'false');
        }
      });
      
      console.log('Hamburger menu fix applied successfully');
    } else {
      console.log('Hamburger menu elements not found, retrying...');
      setTimeout(initHamburgerMenu, 100);
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHamburgerMenu);
  } else {
    initHamburgerMenu();
  }
})();
