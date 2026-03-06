// =========================================
// filosofia.js — Initialiser for the Philosophy section
// =========================================

(function () {
    'use strict';

    /**
     * init() is called once the section HTML is injected into #app-content.
     * Currently handles:
     *  - Staggered fade-in entrance animations for each content block
     *  - Pausing the marquee when the page is not visible (tab switch)
     */
    function init() {
        const container = document.querySelector('.philosophy-container');
        if (!container) return;

        // ——— 1. Entrance animation via IntersectionObserver ———
        const animatables = container.querySelectorAll(
            '.manifesto-headline, .manifesto-body p, .section-label, .what-content p, .clients-title, .marquee-wrapper'
        );

        animatables.forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(24px)';
            el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
            el.style.transitionDelay = `${i * 80}ms`;
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatables.forEach(el => observer.observe(el));

        // ——— 2. Pause marquee while tab is hidden ———
        const track = container.querySelector('.marquee-track');

        function onVisibilityChange() {
            if (track) {
                track.style.animationPlayState = document.hidden ? 'paused' : 'running';
            }
        }

        document.addEventListener('visibilitychange', onVisibilityChange);

        // Cleanup when the SPA router unloads this section
        window.addEventListener('section-unload', function cleanup() {
            document.removeEventListener('visibilitychange', onVisibilityChange);
            window.removeEventListener('section-unload', cleanup);
        }, { once: true });
    }

    // ——— Wait for the router's 'section-loaded' event ———
    window.addEventListener('section-loaded', function handler(e) {
        if (e.detail && e.detail.section === 'filosofia') {
            init();
        }
    });

})();
