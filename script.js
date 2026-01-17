
document.addEventListener('DOMContentLoaded', () => {
    // UTM Propagation Logic
    const propagateUTMs = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
        
        // Find existing UTMs in the current URL
        const foundUtms = {};
        utmKeys.forEach(key => {
            if (urlParams.has(key)) {
                foundUtms[key] = urlParams.get(key);
            }
        });

        // If no UTMs found, nothing to do
        if (Object.keys(foundUtms).length === 0) return;

        // Apply found UTMs to all links with the 'cta-link' class
        const ctaLinks = document.querySelectorAll('.cta-link');
        ctaLinks.forEach(link => {
            try {
                const href = link.getAttribute('href');
                if (!href) return;

                const ctaUrl = new URL(href);
                Object.entries(foundUtms).forEach(([key, value]) => {
                    ctaUrl.searchParams.set(key, value);
                });
                link.setAttribute('href', ctaUrl.toString());
            } catch (e) {
                console.warn('Could not propagate UTMs to link:', link);
            }
        });
    };

    // Smooth scroll for anchors (already handled by CSS, but good for JS fallbacks)
    const setupSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offset = 80; // Header height
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = target.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    };

    // Initialize
    propagateUTMs();
    setupSmoothScroll();
});
