/* ================================================
   Language Switcher Module
   ================================================
   Handles multi-language switching functionality
   ================================================ */

const LanguageModule = (function () {
    'use strict';

    // Private variables
    const STORAGE_KEY = 'preferred_language';
    const DEFAULT_LANG = 'ja';
    let currentLang = DEFAULT_LANG;

    /**
     * Get current language from localStorage or URL
     * @returns {string} Language code
     */
    function getInitialLanguage() {
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');

        if (urlLang && translations[urlLang]) {
            return urlLang;
        }

        const storedLang = localStorage.getItem(STORAGE_KEY);
        if (storedLang && translations[storedLang]) {
            return storedLang;
        }

        return DEFAULT_LANG;
    }

    /**
     * Apply translations to all elements with data-i18n attribute
     * @param {string} lang - Language code
     */
    function applyTranslations(lang) {
        if (!translations[lang]) {
            console.error(`Translation not found for language: ${lang}`);
            return;
        }

        const elements = document.querySelectorAll('[data-i18n]');

        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = translations[lang][key];

            if (translation) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else {
                    element.innerHTML = translation;
                }
            }
        });

        // Update document attributes
        document.documentElement.lang = lang;

        // Update meta tags
        if (translations[lang].page_title) {
            document.title = translations[lang].page_title;
        }

        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription && translations[lang].meta_description) {
            metaDescription.content = translations[lang].meta_description;
        }
    }

    /**
     * Update language buttons state
     * @param {string} lang - Active language code
     */
    function updateLanguageButtons(lang) {
        const langButtons = document.querySelectorAll('.lang-btn');

        langButtons.forEach(btn => {
            const btnLang = btn.getAttribute('data-lang');
            btn.classList.toggle('active', btnLang === lang);
        });
    }

    /**
     * Switch to a new language
     * @param {string} lang - Target language code
     */
    function switchLanguage(lang) {
        if (!translations[lang]) {
            console.error(`Language not supported: ${lang}`);
            return;
        }

        currentLang = lang;
        localStorage.setItem(STORAGE_KEY, lang);

        applyTranslations(lang);
        updateLanguageButtons(lang);

        // Dispatch custom event for other modules
        document.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: lang }
        }));
    }

    /**
     * Initialize language module
     */
    function init() {
        currentLang = getInitialLanguage();

        // Apply initial translations
        applyTranslations(currentLang);
        updateLanguageButtons(currentLang);

        // Bind click events to language buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                if (lang !== currentLang) {
                    switchLanguage(lang);
                }
            });
        });
    }

    // Public API
    return {
        init,
        switchLanguage,
        getCurrentLanguage: () => currentLang
    };
})();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    LanguageModule.init();
});
