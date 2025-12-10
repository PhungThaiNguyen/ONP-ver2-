/**
 * ========================================
 * ONPrecision - Common UI Components Module
 * ========================================
 * Module cho các UI components chung
 */

/**
 * Initialize Header scroll effect
 */
function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });
}

/**
 * Initialize Back to Top button
 */
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;

    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 300);
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/**
 * Initialize Mobile Menu
 */
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');

    if (!menuBtn || !mobileNav) return;

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        mobileNav.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close menu on link click
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
}

/**
 * Initialize Tabs
 */
function initTabs() {
    document.querySelectorAll('[data-tabs]').forEach(tabContainer => {
        const tabs = tabContainer.querySelectorAll('[data-tab]');
        const panels = tabContainer.querySelectorAll('[data-panel]');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.getAttribute('data-tab');

                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                panels.forEach(panel => {
                    panel.classList.toggle('active', panel.getAttribute('data-panel') === target);
                });
            });
        });
    });
}

/**
 * Initialize Smooth Scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Initialize Accordion
 */
function initAccordion() {
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = item.querySelector('.accordion-content');
            const isOpen = item.classList.contains('active');

            // Close all accordions in same container
            const container = item.parentElement;
            if (container.hasAttribute('data-accordion-single')) {
                container.querySelectorAll('.accordion-item').forEach(acc => {
                    acc.classList.remove('active');
                    acc.querySelector('.accordion-content').style.maxHeight = null;
                });
            }

            // Toggle current
            if (!isOpen) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                item.classList.remove('active');
                content.style.maxHeight = null;
            }
        });
    });
}

/**
 * Initialize Modal
 */
function initModal() {
    // Open modal
    document.querySelectorAll('[data-modal-open]').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.getAttribute('data-modal-open');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close modal
    document.querySelectorAll('[data-modal-close]').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modal = trigger.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Close on backdrop click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    });
}

/**
 * Initialize all common components
 */
function initCommonComponents() {
    initHeaderScroll();
    initBackToTop();
    initMobileMenu();
    initTabs();
    initSmoothScroll();
    initAccordion();
    initModal();
}

// Export functions
window.UIComponents = {
    init: initCommonComponents,
    initHeaderScroll,
    initBackToTop,
    initMobileMenu,
    initTabs,
    initSmoothScroll,
    initAccordion,
    initModal
};

// Auto-initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initCommonComponents);
