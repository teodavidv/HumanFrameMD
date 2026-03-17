(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  ready(function () {
    var body = document.body;
    var navCollapse = document.getElementById('navbarSupportedContent');
    var navToggler = document.querySelector('.navbar-toggler');
    var featuresLink = document.getElementById('features');
    var comparisonLink = document.getElementById('comparison');
    var reviewsLink = document.getElementById('reviews');
    var comparisonSection = document.querySelector('.sec5');
    var reviewsSection = document.querySelector('.sec4');
    var featuresSection = document.querySelector('.sec3');
    var faqSection = document.querySelector('.sec9');
    var orderButtons = Array.from(document.querySelectorAll('.orderNwbtn, .orderNwbtnFixed'));
    var mobileCta = document.querySelector('.mobCtaBtn');
    var mobileSlider = document.querySelector('.secStepMobileSlider');
    var mobilePages = Array.from(document.querySelectorAll('.secStepMobileSliderPage'));
    var mobileIndicators = Array.from(document.querySelectorAll('.secStepMobileSliderIndicator'));

    function closeNav() {
      if (!navCollapse || !navToggler) return;
      navCollapse.classList.remove('show');
      navToggler.classList.add('collapsed');
      navToggler.setAttribute('aria-expanded', 'false');
    }

    function openNav() {
      if (!navCollapse || !navToggler) return;
      navCollapse.classList.add('show');
      navToggler.classList.remove('collapsed');
      navToggler.setAttribute('aria-expanded', 'true');
    }

    function toggleNav(event) {
      if (event) event.preventDefault();
      if (!navCollapse) return;
      if (navCollapse.classList.contains('show')) {
        closeNav();
      } else {
        openNav();
      }
    }

    function smoothScrollTo(target) {
      if (!target) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeNav();
    }

    if (navToggler) {
      navToggler.removeAttribute('data-bs-toggle');
      navToggler.addEventListener('click', toggleNav);
    }

    if (featuresLink) {
      featuresLink.setAttribute('href', '#features-section');
      featuresLink.addEventListener('click', function (event) {
        event.preventDefault();
        smoothScrollTo(featuresSection);
      });
    }

    if (comparisonLink) {
      comparisonLink.setAttribute('href', '#comparison-section');
      comparisonLink.addEventListener('click', function (event) {
        event.preventDefault();
        smoothScrollTo(comparisonSection);
      });
    }

    if (reviewsLink) {
      reviewsLink.setAttribute('href', '#reviews-section');
      reviewsLink.addEventListener('click', function (event) {
        event.preventDefault();
        smoothScrollTo(reviewsSection);
      });
    }

    if (featuresSection) featuresSection.id = 'features-section';
    if (comparisonSection) comparisonSection.id = 'comparison-section';
    if (reviewsSection) reviewsSection.id = 'reviews-section';
    if (faqSection) faqSection.id = 'faq-section';

    orderButtons.forEach(function (button) {
      if (button.tagName === 'A') {
        button.setAttribute('href', '#faq-section');
      }
      button.addEventListener('click', function (event) {
        event.preventDefault();
        smoothScrollTo(faqSection || document.body);
      });
    });

    function getViewportWidth() {
      return window.__forceMobileWidth || window.innerWidth || document.documentElement.clientWidth || 0;
    }

    function updateMobileCta() {
      if (!mobileCta) return;
      var isMobile = getViewportWidth() < 768;
      var shouldShow = false;
      if (isMobile) {
        var heroButton = document.querySelector('.bnrAr .orderNwbtn');
        if (heroButton) {
          var rect = heroButton.getBoundingClientRect();
          shouldShow = rect.bottom < 0 || window.scrollY > 700;
        } else {
          shouldShow = window.scrollY > 700;
        }
      }
      mobileCta.classList.toggle('is-visible', shouldShow);
      mobileCta.classList.toggle('d-none', !shouldShow);
      body.classList.toggle('has-mobile-cta', shouldShow);
    }

    function updateSliderIndicators() {
      if (!mobileSlider || !mobileIndicators.length || !mobilePages.length) return;
      var sliderLeft = mobileSlider.scrollLeft;
      var closestIndex = 0;
      var closestDistance = Infinity;

      mobilePages.forEach(function (page, index) {
        var distance = Math.abs(page.offsetLeft - sliderLeft);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      mobileIndicators.forEach(function (indicator, index) {
        indicator.classList.toggle('active', index === closestIndex);
      });
    }

    mobileIndicators.forEach(function (indicator, index) {
      indicator.addEventListener('click', function () {
        var page = mobilePages[index];
        if (!page || !mobileSlider) return;
        mobileSlider.scrollTo({ left: page.offsetLeft, behavior: 'smooth' });
      });
    });

    if (mobileSlider) {
      mobileSlider.addEventListener('scroll', function () {
        window.requestAnimationFrame(updateSliderIndicators);
      }, { passive: true });
      updateSliderIndicators();
    }

    window.addEventListener('resize', function () {
      updateMobileCta();
      if (getViewportWidth() >= 992) closeNav();
      updateSliderIndicators();
    });

    function syncHeroVideos() {
      var videos = Array.from(document.querySelectorAll('#splide01 video, .sec3 video, .secSteps video'));
      videos.forEach(function (video) {
        video.muted = true;
        video.setAttribute('muted', '');
        video.setAttribute('autoplay', '');
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        video.setAttribute('preload', 'auto');
        var slide = video.closest('.splide__slide');
        var shouldPlay = !slide || slide.classList.contains('is-active');
        try {
          if (shouldPlay) {
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') promise.catch(function () {});
          } else {
            video.pause();
            video.currentTime = 0;
          }
        } catch (e) {}
      });
    }

    function setHeroSlide(nextIndex) {
      var heroSlides = Array.from(document.querySelectorAll('#splide01 .splide__slide'));
      var thumbSlides = Array.from(document.querySelectorAll('#splide02 .splide__slide'));
      if (!heroSlides.length) return false;
      var safeIndex = (nextIndex + heroSlides.length) % heroSlides.length;
      heroSlides.forEach(function (slide, index) {
        slide.classList.remove('is-active', 'is-visible', 'is-prev', 'is-next');
        slide.setAttribute('aria-hidden', index === safeIndex ? 'false' : 'true');
        slide.style.transform = 'translateX(' + ((index - safeIndex) * 100) + '%)';
        slide.style.display = index === safeIndex ? 'block' : 'none';
        slide.style.opacity = index === safeIndex ? '1' : '0';
        slide.style.zIndex = index === safeIndex ? '2' : '1';
        if (index === safeIndex) {
          slide.classList.add('is-active', 'is-visible');
        } else if (index === (safeIndex + 1) % heroSlides.length) {
          slide.classList.add('is-next');
        } else if (index === (safeIndex - 1 + heroSlides.length) % heroSlides.length) {
          slide.classList.add('is-prev');
        }
      });
      thumbSlides.forEach(function (thumb, index) {
        thumb.classList.remove('is-active', 'is-next', 'is-visible');
        thumb.setAttribute('aria-current', index === safeIndex ? 'true' : 'false');
        if (index === safeIndex) {
          thumb.classList.add('is-active', 'is-visible');
        } else if (index === (safeIndex + 1) % thumbSlides.length) {
          thumb.classList.add('is-next', 'is-visible');
        } else {
          thumb.classList.add('is-visible');
        }
      });
      syncHeroVideos();
      updateHeroBadges();
      return true;
    }


    function updateHeroBadges() {
      var badges = document.getElementById('slider90Days');
      if (!badges) return;
      badges.style.display = getCurrentHeroIndex() === 0 ? 'flex' : 'none';
    }

    function getCurrentHeroIndex() {
      var heroSlides = Array.from(document.querySelectorAll('#splide01 .splide__slide'));
      var currentIndex = heroSlides.findIndex(function (slide) {
        return slide.classList.contains('is-active');
      });
      return currentIndex >= 0 ? currentIndex : 0;
    }

    function advanceHeroSlider(step) {
      return setHeroSlide(getCurrentHeroIndex() + step);
    }

    var nextArrow = document.querySelector('.splide__arrow--next');
    var prevArrow = document.querySelector('.splide__arrow--prev');
    if (nextArrow) {
      nextArrow.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        advanceHeroSlider(1);
      }, true);
    }
    if (prevArrow) {
      prevArrow.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        advanceHeroSlider(-1);
      }, true);
    }


    Array.from(document.querySelectorAll('#splide02 .splide__slide')).forEach(function (thumb, index) {
      thumb.addEventListener('click', function (event) {
        event.preventDefault();
        setHeroSlide(index);
      });
      thumb.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setHeroSlide(index);
        }
      });
    });

    Array.from(document.querySelectorAll('video')).forEach(function (video) {
      video.muted = true;
      video.setAttribute('muted', '');
      video.setAttribute('autoplay', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      video.setAttribute('preload', 'auto');
      video.addEventListener('loadedmetadata', function () {
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') promise.catch(function () {});
      });
    });

    syncHeroVideos();
    updateHeroBadges();
    window.setTimeout(function () { syncHeroVideos(); updateHeroBadges(); }, 300);
    window.setInterval(syncHeroVideos, 2500);

    window.addEventListener('scroll', updateMobileCta, { passive: true });
    window.addEventListener('load', updateMobileCta);
    updateMobileCta();
    closeNav();
  });
})();
