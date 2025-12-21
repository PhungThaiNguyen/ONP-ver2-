/**
 * ========================================
 * O.N.Precision - Language Switcher Module
 * ========================================
 * Module quản lý chuyển đổi ngôn ngữ
 */

// Default language
const DEFAULT_LANG = 'ja';

// Current language (from localStorage or default)
let currentLang = localStorage.getItem('preferred_language') || DEFAULT_LANG;

/**
 * Apply translations to all elements with data-i18n attribute
 * @param {string} lang - Language code ('ja' or 'vi')
 * @param {Object} translations - Translations object
 */
function applyTranslations(lang, translations) {
    if (!translations || !translations[lang]) {
        console.warn(`Translations not found for language: ${lang}`);
        return;
    }

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');

        if (translations[lang][key]) {
            // Handle different element types
            if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
                el.placeholder = translations[lang][key];
            } else if (el.tagName === 'META' && el.hasAttribute('content')) {
                el.content = translations[lang][key];
            } else {
                el.innerHTML = translations[lang][key];
            }
        }
    });

    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Dispatch custom event
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

/**
 * Update language button states
 * @param {string} lang - Active language code
 */
function updateLanguageButtons(lang) {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        const btnLang = btn.getAttribute('data-lang');
        btn.classList.toggle('active', btnLang === lang);
    });
}

/**
 * Initialize language switcher
 * @param {Object} translations - Translations object
 */
function initLanguageSwitcher(translations) {
    // Apply initial translations
    applyTranslations(currentLang, translations);
    updateLanguageButtons(currentLang);

    // Add click handlers to language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const lang = this.getAttribute('data-lang');

            if (lang && lang !== currentLang) {
                currentLang = lang;
                localStorage.setItem('preferred_language', lang);
                applyTranslations(lang, translations);
                updateLanguageButtons(lang);
            }
        });
    });
}

/**
 * Get current language
 * @returns {string} Current language code
 */
function getCurrentLanguage() {
    return currentLang;
}

// Export functions
window.LanguageSwitcher = {
    init: initLanguageSwitcher,
    apply: applyTranslations,
    getCurrent: getCurrentLanguage,
    updateButtons: updateLanguageButtons
};
