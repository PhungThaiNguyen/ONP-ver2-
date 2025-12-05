/* ================================================
   Animations Module
   ================================================
   Handles scroll animations and effects
   ================================================ */

const AnimationsModule = (function () {
    'use strict';

    // Intersection Observer instance
    let observer;

    /**
     * Create intersection observer for fade-in animations
     */
    function createObserver() {
        const options = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');

                    // Optionally unobserve after animation
                    if (entry.target.dataset.animateOnce !== 'false') {
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, options);
    }

    /**
     * Observe elements with animation classes
     */
    function observeElements() {
        const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    /**
     * Handle back to top button visibility
     */
    function handleBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');

        if (!backToTopBtn) return;

        function toggleVisibility() {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }

        window.addEventListener('scroll', toggleVisibility, { passive: true });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Initial check
        toggleVisibility();
    }

    /**
     * Add staggered animation delays to children
     * @param {string} parentSelector - Parent element selector
     * @param {number} delay - Delay between each child (ms)
     */
    function staggerChildren(parentSelector, delay = 100) {
        const parents = document.querySelectorAll(parentSelector);

        parents.forEach(parent => {
            const children = parent.querySelectorAll('.fade-in, [data-stagger]');

            children.forEach((child, index) => {
                child.style.transitionDelay = `${index * delay}ms`;
            });
        });
    }

    /**
     * Counter animation for numbers
     * @param {Element} element - Element containing the number
     * @param {number} target - Target number
     * @param {number} duration - Animation duration (ms)
     */
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(easeOutQuart * target);

            element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    /**
     * Initialize animations module
     */
    function init() {
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            // Show all elements without animation
            document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
                el.classList.add('visible');
            });
            return;
        }

        createObserver();
        observeElements();
        handleBackToTop();
    }

    // Public API
    return {
        init,
        staggerChildren,
        animateCounter
    };
})();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    AnimationsModule.init();
});
