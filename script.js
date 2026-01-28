
document.addEventListener('DOMContentLoaded', () => {
    // UTM Propagation Logic
    const propagateUTMs = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
        
        const foundUtms = {};
        utmKeys.forEach(key => {
            if (urlParams.has(key)) {
                foundUtms[key] = urlParams.get(key);
            }
        });

        if (Object.keys(foundUtms).length === 0) return;

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

    // Smooth scroll for anchors
    const setupSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offset = 80;
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

    // Carousel Logic
    const setupCarousel = () => {
        const track = document.getElementById('carousel-track');
        const slides = Array.from(track.children);
        const nextBtn = document.getElementById('next-btn');
        const prevBtn = document.getElementById('prev-btn');
        const dotsNav = document.getElementById('carousel-dots');
        
        if (!track) return;
        
        let currentIndex = 0;
        const slideCount = slides.length;

        // Create Dots
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = `w-3 h-3 rounded-full transition ${i === 0 ? 'bg-brand-light' : 'bg-white/30'}`;
            dot.addEventListener('click', () => updateCarousel(i));
            dotsNav.appendChild(dot);
        });

        const dots = Array.from(dotsNav.children);

        const updateCarousel = (index) => {
            if (index < 0) index = slideCount - 1;
            if (index >= slideCount) index = 0;
            
            currentIndex = index;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            dots.forEach((dot, i) => {
                dot.className = `w-3 h-3 rounded-full transition ${i === currentIndex ? 'bg-brand-light' : 'bg-white/30'}`;
            });
        };

        nextBtn?.addEventListener('click', () => updateCarousel(currentIndex + 1));
        prevBtn?.addEventListener('click', () => updateCarousel(currentIndex - 1));

        // Auto play every 3 seconds
        let autoPlayInterval = setInterval(() => updateCarousel(currentIndex + 1), 3000);

        // Pause auto play on hover
        const container = document.getElementById('community-carousel');
        container?.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        container?.addEventListener('mouseleave', () => {
            autoPlayInterval = setInterval(() => updateCarousel(currentIndex + 1), 3000);
        });

        // Swipe support (simple)
        let touchStartX = 0;
        container?.addEventListener('touchstart', e => touchStartX = e.touches[0].clientX);
        container?.addEventListener('touchend', e => {
            const touchEndX = e.changedTouches[0].clientX;
            if (touchStartX - touchEndX > 50) updateCarousel(currentIndex + 1);
            if (touchStartX - touchEndX < -50) updateCarousel(currentIndex - 1);
        });
    };

    // Initialize
    propagateUTMs();
    setupSmoothScroll();
    setupCarousel();
});
