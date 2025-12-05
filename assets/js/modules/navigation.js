/* ================================================
   Navigation Module
   ================================================
   Handles header navigation functionality
   ================================================ */

const NavigationModule = (function () {
    'use strict';

    // DOM Elements
    let header, mobileMenuToggle, mainNav;

    /**
     * Handle header scroll effect
     */
    function handleScroll() {
        if (!header) return;

        const scrollY = window.scrollY;

        // Add scrolled class when page is scrolled
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    /**
     * Toggle mobile menu
     */
    function toggleMobileMenu() {
        if (!mobileMenuToggle || !mainNav) return;

        const isOpen = mainNav.classList.contains('active');

        mainNav.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        mobileMenuToggle.setAttribute('aria-expanded', !isOpen);

        // Prevent body scroll when menu is open
        document.body.style.overflow = isOpen ? '' : 'hidden';
    }

    /**
     * Close mobile menu
     */
    function closeMobileMenu() {
        if (!mobileMenuToggle || !mainNav) return;

        mainNav.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    /**
     * Highlight active navigation link
     */
    function highlightActiveLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            const linkPath = new URL(link.href, window.location.origin).pathname;

            if (linkPath === currentPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    /**
     * Smooth scroll to anchor
     * @param {Event} e - Click event
     */
    function handleAnchorClick(e) {
        const href = e.target.getAttribute('href');

        if (!href || !href.startsWith('#')) return;

        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            e.preventDefault();

            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = targetElement.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            closeMobileMenu();
        }
    }

    /**
     * Initialize navigation module
     */
    function init() {
        // Get DOM elements
        header = document.getElementById('header');
        mobileMenuToggle = document.getElementById('mobileMenuToggle');
        mainNav = document.getElementById('mainNav');

        if (!header) return;

        // Bind scroll event
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Initial check
        handleScroll();

        // Mobile menu toggle
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        }

        // Close menu on nav link click (mobile)
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });

        // Anchor link smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', handleAnchorClick);
        });

        // Highlight active page
        highlightActiveLink();

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeMobileMenu();
            }
        });

        // Close menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 992) {
                closeMobileMenu();
            }
        });
    }

    // Public API
    return {
        init,
        closeMobileMenu
    };
})();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    NavigationModule.init();
});
