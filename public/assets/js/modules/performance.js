/**
 * O.N.Precision - Performance Optimization Module
 * Lazy loading, Service Worker registration, Web Vitals tracking
 */

const PerformanceOptimizer = {
    /**
     * Initialize all performance optimizations
     */
    init() {
        this.registerServiceWorker();
        this.initLazyLoading();
        this.initPreloading();
        this.measureWebVitals();
        console.log('[Performance] Optimization initialized');
    },

    /**
     * Register Service Worker
     */
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                        console.log('[SW] Registered:', registration.scope);

                        // Check for updates
                        registration.addEventListener('updatefound', () => {
                            const newWorker = registration.installing;
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    // New content available
                                    console.log('[SW] New content available');
                                    this.showUpdateNotification();
                                }
                            });
                        });
                    })
                    .catch((error) => {
                        console.log('[SW] Registration failed:', error);
                    });
            });
        }
    },

    /**
     * Show update notification
     */
    showUpdateNotification() {
        // Create toast notification for update
        const toast = document.createElement('div');
        toast.className = 'update-toast';
        toast.innerHTML = `
            <p data-i18n="update_available">新しいコンテンツがあります</p>
            <button onclick="location.reload()" data-i18n="refresh">更新する</button>
        `;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #333;
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            display: flex;
            gap: 16px;
            align-items: center;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        document.body.appendChild(toast);
    },

    /**
     * Initialize lazy loading for images
     */
    initLazyLoading() {
        // Use native lazy loading with fallback
        const images = document.querySelectorAll('img[data-src]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px', // Start loading 50px before visible
                threshold: 0.01
            });

            images.forEach((img) => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach((img) => this.loadImage(img));
        }
    },

    /**
     * Load image from data-src
     */
    loadImage(img) {
        const src = img.dataset.src;
        if (!src) return;

        // Add loading class
        img.classList.add('loading');

        // Create temp image to check load
        const tempImg = new Image();
        tempImg.onload = () => {
            img.src = src;
            img.classList.remove('loading');
            img.classList.add('loaded');
            img.removeAttribute('data-src');
        };
        tempImg.onerror = () => {
            img.classList.remove('loading');
            img.classList.add('error');
        };
        tempImg.src = src;
    },

    /**
     * Preload critical resources
     */
    initPreloading() {
        // Prefetch next likely pages based on current page
        const currentPath = window.location.pathname;
        const prefetchLinks = this.getPrefetchLinks(currentPath);

        prefetchLinks.forEach((href) => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = href;
            document.head.appendChild(link);
        });
    },

    /**
     * Get links to prefetch based on current page
     */
    getPrefetchLinks(path) {
        const prefetchMap = {
            '/': ['/products.html', '/works.html', '/contact.html'],
            '/index.html': ['/products.html', '/works.html', '/contact.html'],
            '/products.html': ['/product-detail.html', '/contact.html'],
            '/works.html': ['/products.html', '/equipment.html'],
            '/company.html': ['/contact.html', '/recruit.html'],
            '/news.html': ['/news-detail.html']
        };

        return prefetchMap[path] || [];
    },

    /**
     * Measure Web Vitals
     */
    measureWebVitals() {
        // First Contentful Paint (FCP)
        if ('PerformanceObserver' in window) {
            try {
                // LCP - Largest Contentful Paint
                new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    console.log('[Web Vitals] LCP:', lastEntry.startTime.toFixed(2), 'ms');
                }).observe({ type: 'largest-contentful-paint', buffered: true });

                // FID - First Input Delay
                new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    entries.forEach((entry) => {
                        console.log('[Web Vitals] FID:', entry.processingStart - entry.startTime, 'ms');
                    });
                }).observe({ type: 'first-input', buffered: true });

                // CLS - Cumulative Layout Shift
                let clsValue = 0;
                new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    entries.forEach((entry) => {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    });
                    console.log('[Web Vitals] CLS:', clsValue.toFixed(4));
                }).observe({ type: 'layout-shift', buffered: true });

            } catch (e) {
                console.log('[Web Vitals] Not supported');
            }
        }

        // Log page load time
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log('[Performance] Page load:', loadTime.toFixed(2), 'ms');
        });
    },

    /**
     * Debounce utility for scroll/resize handlers
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle utility for frequent events
     */
    throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function (...args) {
            if (!lastRan) {
                func(...args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(() => {
                    if ((Date.now() - lastRan) >= limit) {
                        func(...args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => PerformanceOptimizer.init());
} else {
    PerformanceOptimizer.init();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceOptimizer;
}
