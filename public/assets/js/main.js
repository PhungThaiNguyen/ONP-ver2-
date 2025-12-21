/**
 * ================================================
 * O.N.Precision - Main JavaScript
 * 
 * Chức năng chính:
 * - Chuyển đổi ngôn ngữ (Language Switcher)
 * - Mobile Navigation
 * - Scroll Animations
 * - Header Scroll Effect
 * - Back to Top Button
 * ================================================
 */

(function () {
    'use strict';

    // ========================
    // DOM Elements Cache
    // ========================
    const DOM = {
        html: document.documentElement,
        header: document.getElementById('header'),
        mobileMenuToggle: document.getElementById('mobileMenuToggle'),
        mainNav: document.getElementById('mainNav'),
        langBtns: document.querySelectorAll('.lang-btn'),
        backToTop: document.getElementById('backToTop'),
        navLinks: document.querySelectorAll('.nav-link'),
        i18nElements: document.querySelectorAll('[data-i18n]')
    };

    // ========================
    // Configuration
    // ========================
    const CONFIG = {
        scrollThreshold: 100,
        animationObserverThreshold: 0.1,
        defaultLang: 'ja',
        supportedLangs: ['ja', 'en', 'vi'],
        storageKey: 'preferred_language'
    };

    // ========================
    // Language Switcher
    // Hệ thống chuyển đổi ngôn ngữ
    // ========================
    const LanguageSwitcher = {
        currentLang: CONFIG.defaultLang,

        /**
         * Khởi tạo Language Switcher
         */
        init() {
            // Lấy ngôn ngữ đã lưu hoặc từ URL
            this.currentLang = this.getSavedLang() || this.getLangFromURL() || CONFIG.defaultLang;

            // Áp dụng ngôn ngữ
            this.applyLanguage(this.currentLang);

            // Gắn event listeners cho các nút chuyển ngôn ngữ
            this.bindEvents();
        },

        /**
         * Lấy ngôn ngữ từ localStorage
         */
        getSavedLang() {
            try {
                const saved = localStorage.getItem(CONFIG.storageKey);
                return CONFIG.supportedLangs.includes(saved) ? saved : null;
            } catch (e) {
                return null;
            }
        },

        /**
         * Lấy ngôn ngữ từ URL parameter
         */
        getLangFromURL() {
            const urlParams = new URLSearchParams(window.location.search);
            const lang = urlParams.get('lang');
            return CONFIG.supportedLangs.includes(lang) ? lang : null;
        },

        /**
         * Lưu ngôn ngữ vào localStorage
         */
        saveLang(lang) {
            try {
                localStorage.setItem(CONFIG.storageKey, lang);
            } catch (e) {
                console.warn('Cannot save language preference');
            }
        },

        /**
         * Áp dụng ngôn ngữ cho trang
         * @param {string} lang - Mã ngôn ngữ ('ja' hoặc 'vi')
         */
        applyLanguage(lang) {
            if (!translations || !translations[lang]) {
                console.error('Translations not found for:', lang);
                return;
            }

            this.currentLang = lang;

            // Cập nhật thuộc tính lang của HTML để CSS có thể điều chỉnh font
            DOM.html.setAttribute('lang', lang);

            // Cập nhật title và meta description
            document.title = translations[lang].page_title || document.title;
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc && translations[lang].meta_description) {
                metaDesc.setAttribute('content', translations[lang].meta_description);
            }

            // Cập nhật tất cả elements có data-i18n
            DOM.i18nElements.forEach(element => {
                const key = element.getAttribute('data-i18n');
                if (translations[lang][key]) {
                    // Hỗ trợ HTML trong translations (như <br>)
                    if (translations[lang][key].includes('<')) {
                        element.innerHTML = translations[lang][key];
                    } else {
                        element.textContent = translations[lang][key];
                    }
                }
            });

            // Cập nhật trạng thái active của các nút ngôn ngữ
            DOM.langBtns.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.lang === lang);
            });

            // Lưu preference
            this.saveLang(lang);

            // Dispatch custom event để các component khác có thể lắng nghe
            window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
        },

        /**
         * Gắn event listeners
         */
        bindEvents() {
            DOM.langBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const lang = e.currentTarget.dataset.lang;
                    if (lang !== this.currentLang) {
                        this.applyLanguage(lang);
                    }
                });
            });
        }
    };

    // ========================
    // Mobile Navigation
    // Menu di động
    // ========================
    const MobileNav = {
        isOpen: false,

        init() {
            if (!DOM.mobileMenuToggle || !DOM.mainNav) return;

            this.bindEvents();
        },

        toggle() {
            this.isOpen = !this.isOpen;
            DOM.mobileMenuToggle.classList.toggle('active', this.isOpen);
            DOM.mainNav.classList.toggle('active', this.isOpen);
            DOM.mobileMenuToggle.setAttribute('aria-expanded', this.isOpen);

            // Ngăn scroll khi menu mở
            document.body.style.overflow = this.isOpen ? 'hidden' : '';
        },

        close() {
            if (!this.isOpen) return;
            this.isOpen = false;
            DOM.mobileMenuToggle.classList.remove('active');
            DOM.mainNav.classList.remove('active');
            DOM.mobileMenuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        },

        bindEvents() {
            // Toggle button
            DOM.mobileMenuToggle.addEventListener('click', () => this.toggle());

            // Đóng menu khi click nav link
            DOM.navLinks.forEach(link => {
                link.addEventListener('click', () => this.close());
            });

            // Đóng menu khi nhấn Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });
        }
    };

    // ========================
    // Header Scroll Effect
    // Hiệu ứng header khi scroll
    // ========================
    const HeaderScroll = {
        init() {
            if (!DOM.header) return;

            this.handleScroll();
            window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        },

        handleScroll() {
            const scrollY = window.scrollY || window.pageYOffset;
            DOM.header.classList.toggle('scrolled', scrollY > CONFIG.scrollThreshold);
        }
    };

    // ========================
    // Back to Top Button
    // Nút quay lại đầu trang
    // ========================
    const BackToTop = {
        init() {
            if (!DOM.backToTop) return;

            this.handleScroll();
            window.addEventListener('scroll', () => this.handleScroll(), { passive: true });

            DOM.backToTop.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        },

        handleScroll() {
            const scrollY = window.scrollY || window.pageYOffset;
            DOM.backToTop.classList.toggle('visible', scrollY > CONFIG.scrollThreshold * 3);
        }
    };

    // ========================
    // Smooth Scroll for Anchor Links
    // Cuộn mượt cho các link anchor
    // ========================
    const SmoothScroll = {
        init() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    const href = this.getAttribute('href');
                    if (href === '#') return;

                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        const offsetTop = target.getBoundingClientRect().top + window.pageYOffset;
                        const headerOffset = parseInt(getComputedStyle(document.documentElement)
                            .getPropertyValue('--header-height')) || 80;

                        window.scrollTo({
                            top: offsetTop - headerOffset,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }
    };

    // ========================
    // Scroll Animations
    // Hiệu ứng animation khi scroll
    // ========================
    const ScrollAnimations = {
        init() {
            // Thêm class fade-in cho các elements cần animation
            const animatedElements = document.querySelectorAll(
                '.section-header, .product-card, .works-video-card, .works-description, .precision-block, .cta-card'
            );

            animatedElements.forEach(el => el.classList.add('fade-in'));

            // Sử dụng Intersection Observer để detect khi element vào viewport
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                            observer.unobserve(entry.target);
                        }
                    });
                }, {
                    threshold: CONFIG.animationObserverThreshold,
                    rootMargin: '0px 0px -50px 0px'
                });

                animatedElements.forEach(el => observer.observe(el));
            } else {
                // Fallback cho browsers cũ
                animatedElements.forEach(el => el.classList.add('visible'));
            }
        }
    };

    // ========================
    // Active Navigation Link
    // Highlight nav link dựa trên scroll position
    // ========================
    const ActiveNavLink = {
        init() {
            const sections = document.querySelectorAll('section[id]');

            if (!sections.length) return;

            const observerOptions = {
                rootMargin: '-20% 0px -80% 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute('id');
                        this.setActiveLink(id);
                    }
                });
            }, observerOptions);

            sections.forEach(section => observer.observe(section));
        },

        setActiveLink(sectionId) {
            DOM.navLinks.forEach(link => {
                const href = link.getAttribute('href');
                link.classList.toggle('active', href === `#${sectionId}`);
            });
        }
    };

    // ========================
    // Video Thumbnail Click Handler
    // Xử lý click vào video thumbnail
    // ========================
    const VideoHandler = {
        init() {
            const videoThumbnails = document.querySelectorAll('.video-thumbnail');

            videoThumbnails.forEach(thumbnail => {
                thumbnail.addEventListener('click', function () {
                    // Có thể mở modal video hoặc chuyển đến YouTube
                    const youtubeLink = this.closest('.works-video-card')?.querySelector('.youtube-link');
                    if (youtubeLink) {
                        window.open(youtubeLink.href, '_blank');
                    }
                });
            });
        }
    };

    // ========================
    // Initialize All Modules
    // Khởi tạo tất cả modules
    // ========================
    function init() {
        // Đợi DOM load xong
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initModules);
        } else {
            initModules();
        }
    }

    function initModules() {
        LanguageSwitcher.init();
        MobileNav.init();
        HeaderScroll.init();
        BackToTop.init();
        SmoothScroll.init();
        ScrollAnimations.init();
        ActiveNavLink.init();
        VideoHandler.init();

        // Log để debug
        console.log('🚀 O.N.Precision website initialized');
        console.log(`🌐 Current language: ${LanguageSwitcher.currentLang}`);
    }

    // Start
    init();

})();
