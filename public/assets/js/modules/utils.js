/* ================================================
   Utility Functions
   ================================================
   Common utility functions used across the site
   ================================================ */

const Utils = (function () {
    'use strict';

    /**
     * Debounce function
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function} Debounced function
     */
    function debounce(func, wait = 100) {
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

    /**
     * Throttle function
     * @param {Function} func - Function to throttle
     * @param {number} limit - Limit time in ms
     * @returns {Function} Throttled function
     */
    function throttle(func, limit = 100) {
        let inThrottle;

        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Format date to Japanese format
     * @param {Date|string} date - Date to format
     * @returns {string} Formatted date
     */
    function formatDateJP(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        const day = d.getDate();

        return `${year}年${month}月${day}日`;
    }

    /**
     * Check if element is in viewport
     * @param {Element} element - Element to check
     * @returns {boolean} Is in viewport
     */
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();

        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * Get cookie value
     * @param {string} name - Cookie name
     * @returns {string|null} Cookie value
     */
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);

        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        }

        return null;
    }

    /**
     * Set cookie
     * @param {string} name - Cookie name
     * @param {string} value - Cookie value
     * @param {number} days - Expiry days
     */
    function setCookie(name, value, days = 365) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;

        document.cookie = `${name}=${value};${expires};path=/`;
    }

    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     * @returns {Promise<void>}
     */
    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Failed to copy:', err);
            return false;
        }
    }

    /**
     * Generate unique ID
     * @returns {string} Unique ID
     */
    function generateId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Escape HTML special characters
     * @param {string} str - String to escape
     * @returns {string} Escaped string
     */
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    /**
     * Parse query string to object
     * @param {string} queryString - Query string
     * @returns {Object} Parsed parameters
     */
    function parseQueryString(queryString = window.location.search) {
        const params = {};
        const searchParams = new URLSearchParams(queryString);

        for (const [key, value] of searchParams) {
            params[key] = value;
        }

        return params;
    }

    /**
     * Lazy load images
     */
    function lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            });

            images.forEach(img => observer.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }

    // Public API
    return {
        debounce,
        throttle,
        formatDateJP,
        isInViewport,
        getCookie,
        setCookie,
        copyToClipboard,
        generateId,
        escapeHtml,
        parseQueryString,
        lazyLoadImages
    };
})();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}
