(function() {
    function updateDates() {
        const dateElements = document.querySelectorAll('.dynamic-date');
        const today = new Date();
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        const formattedDate = today.toLocaleDateString('en-US', options);
        
        dateElements.forEach(el => {
            el.textContent = formattedDate;
        });
    }

    function fixLazyAssets() {
        // Fix for images using data-src
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            if (img.dataset.src && (!img.src || img.src.includes('smoothspine.com'))) {
                // If it's an external URL that we might have locally, we'd prefer local
                // but for now let's ensure it has a valid src
                img.src = img.dataset.src;
                img.classList.remove('fk-lazy');
                img.classList.remove('re-fk-lazy');
            }
        });

        // Fix for videos using data-src
        const lazyVideos = document.querySelectorAll('video[data-src]');
        lazyVideos.forEach(video => {
            if (video.dataset.src && (!video.src || video.src.includes('smoothspine.com'))) {
                video.src = video.dataset.src;
                video.classList.remove('fk-lazy');
                video.classList.remove('re-fk-lazy');
            }
        });
    }

    // Run on load
    updateDates();
    fixLazyAssets();

    // Also run on scroll to catch any dynamic additions or missed elements
    window.addEventListener('scroll', fixLazyAssets);
    
    console.log('SmoothSpine Page Fixes Loaded');
})();
