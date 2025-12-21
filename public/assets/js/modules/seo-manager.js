/**
 * ================================================
 * O.N.Precision - SEO Enhancement Module
 * ================================================
 * 
 * Features:
 * - Dynamic Schema.org structured data
 * - Breadcrumb markup
 * - FAQ schema (for pages with FAQs)
 * - LocalBusiness schema
 * - Product schema
 * - Organization schema
 * ================================================
 */

const SEOManager = (function () {
    'use strict';

    // Base URL configuration
    const BASE_URL = 'https://www.onprecision.com';

    // Page SEO data for all languages
    const PAGE_SEO = {
        'index': {
            title: {
                ja: 'O.N.Precision | 精密切削加工の専門メーカー',
                en: 'O.N.Precision | Precision Machining Specialist',
                vi: 'O.N.Precision | Chuyên Gia Gia Công Chính Xác'
            },
            description: {
                ja: 'O.N.Precisionは精密切削加工の専門メーカーです。自動車部品・電子部品・医療機器部品の高精度加工を承ります。',
                en: 'O.N.Precision is a professional precision machining manufacturer. We handle high-precision machining for automotive, electronic, and medical device components.',
                vi: 'O.N.Precision là nhà sản xuất gia công chính xác chuyên nghiệp. Chúng tôi chuyên gia công độ chính xác cao cho linh kiện ô tô, điện tử và thiết bị y tế.'
            },
            keywords: {
                ja: '精密加工, 切削加工, CNC加工, O.N.Precision, 旋盤加工, 自動車部品, 電子部品',
                en: 'precision machining, CNC machining, O.N.Precision, lathe processing, automotive parts, electronic components',
                vi: 'gia công chính xác, gia công CNC, O.N.Precision, tiện, linh kiện ô tô, linh kiện điện tử'
            }
        },
        'works': {
            title: {
                ja: '事業内容 | O.N.Precision - 精密切削加工',
                en: 'Services | O.N.Precision - Precision Machining',
                vi: 'Dịch Vụ | O.N.Precision - Gia Công Chính Xác'
            },
            description: {
                ja: 'O.N.Precisionの事業内容。NC旋盤による精密切削加工、自動車部品・電子部品の高精度加工を承ります。',
                en: 'O.N.Precision services. Precision cutting with NC lathes, high-precision machining for automotive and electronic parts.',
                vi: 'Dịch vụ O.N.Precision. Gia công cắt chính xác bằng máy tiện NC, gia công độ chính xác cao cho linh kiện ô tô và điện tử.'
            },
            keywords: {
                ja: '事業内容, 精密加工, NC旋盤, 切削加工, 自動車部品',
                en: 'services, precision machining, NC lathe, cutting, automotive parts',
                vi: 'dịch vụ, gia công chính xác, máy tiện NC, cắt gọt, linh kiện ô tô'
            }
        },
        'products': {
            title: {
                ja: '加工事例 | O.N.Precision - 精密切削加工製品',
                en: 'Products | O.N.Precision - Precision Machined Parts',
                vi: 'Sản Phẩm | O.N.Precision - Linh Kiện Gia Công Chính Xác'
            },
            description: {
                ja: 'O.N.Precision精密切削加工品のご紹介。真鍮、ステンレス、アルミ、鋼鉄など多様な材質の加工実績。',
                en: 'O.N.Precision precision machined products. Processing experience with various materials including brass, stainless steel, aluminum, and steel.',
                vi: 'Sản phẩm gia công chính xác O.N.Precision. Kinh nghiệm gia công đa dạng vật liệu: đồng thau, inox, nhôm và thép.'
            },
            keywords: {
                ja: '加工事例, 精密加工品, 真鍮, ステンレス, アルミ, 切削加工',
                en: 'products, precision parts, brass, stainless steel, aluminum, machining',
                vi: 'sản phẩm, linh kiện chính xác, đồng thau, inox, nhôm, gia công'
            }
        },
        'equipment': {
            title: {
                ja: '設備一覧 | O.N.Precision - NC自動旋盤・検査機器',
                en: 'Equipment | O.N.Precision - NC Lathes & Inspection',
                vi: 'Thiết Bị | O.N.Precision - Máy Tiện NC & Kiểm Tra'
            },
            description: {
                ja: 'O.N.Precisionの設備一覧。NC自動旋盤、複合旋盤、各種検査機器を完備。高精度加工を実現する最新設備をご紹介。',
                en: 'O.N.Precision equipment list. Fully equipped with NC automatic lathes, complex lathes, and inspection equipment for high-precision machining.',
                vi: 'Danh sách thiết bị O.N.Precision. Trang bị đầy đủ máy tiện tự động NC, máy tiện phức hợp và thiết bị kiểm tra cho gia công chính xác cao.'
            },
            keywords: {
                ja: '設備一覧, NC自動旋盤, CNC, 検査機器, 精密加工設備',
                en: 'equipment, NC automatic lathe, CNC, inspection equipment, precision machining',
                vi: 'thiết bị, máy tiện tự động NC, CNC, thiết bị kiểm tra, gia công chính xác'
            }
        },
        'company': {
            title: {
                ja: '会社案内 | O.N.Precision - 会社概要・沿革',
                en: 'About Us | O.N.Precision - Company Profile',
                vi: 'Về Chúng Tôi | O.N.Precision - Giới Thiệu Công Ty'
            },
            description: {
                ja: 'O.N.Precisionの会社案内。1967年創業の精密切削加工メーカー。沿革、アクセス、代表挨拶をご紹介。',
                en: 'About O.N.Precision. A precision machining manufacturer founded in 1967. History, access, and message from the president.',
                vi: 'Về O.N.Precision. Nhà sản xuất gia công chính xác thành lập năm 1967. Lịch sử, địa chỉ và thông điệp từ giám đốc.'
            },
            keywords: {
                ja: '会社案内, 会社概要, O.N.Precision, 精密加工メーカー, 企業情報',
                en: 'about us, company profile, O.N.Precision, precision machining manufacturer',
                vi: 'về chúng tôi, hồ sơ công ty, O.N.Precision, nhà sản xuất gia công chính xác'
            }
        },
        'contact': {
            title: {
                ja: 'お問い合わせ | O.N.Precision - 見積り・ご相談',
                en: 'Contact | O.N.Precision - Quote & Inquiry',
                vi: 'Liên Hệ | O.N.Precision - Báo Giá & Tư Vấn'
            },
            description: {
                ja: 'O.N.Precisionへのお問い合わせ。見積り依頼、製品に関するお問い合わせ、採用に関するお問い合わせはこちら。',
                en: 'Contact O.N.Precision. For quote requests, product inquiries, and recruitment questions.',
                vi: 'Liên hệ O.N.Precision. Yêu cầu báo giá, thắc mắc về sản phẩm và tuyển dụng.'
            },
            keywords: {
                ja: 'お問い合わせ, 見積り, 相談, 採用, O.N.Precision',
                en: 'contact, quote, inquiry, recruitment, O.N.Precision',
                vi: 'liên hệ, báo giá, tư vấn, tuyển dụng, O.N.Precision'
            }
        },
        'recruit': {
            title: {
                ja: '採用情報 | O.N.Precision - NC旋盤オペレーター募集',
                en: 'Careers | O.N.Precision - NC Lathe Operator Jobs',
                vi: 'Tuyển Dụng | O.N.Precision - Vận Hành Máy Tiện NC'
            },
            description: {
                ja: 'O.N.Precisionの採用情報。ものづくりに情熱を持つ方を募集中。NC旋盤オペレーター、製造スタッフ募集。',
                en: 'O.N.Precision careers. We are looking for passionate manufacturing professionals. NC lathe operators and production staff wanted.',
                vi: 'Tuyển dụng O.N.Precision. Tìm kiếm nhân sự đam mê sản xuất. Tuyển vận hành máy tiện NC và nhân viên sản xuất.'
            },
            keywords: {
                ja: '採用情報, 求人, NC旋盤オペレーター, 製造業, 転職',
                en: 'careers, jobs, NC lathe operator, manufacturing, employment',
                vi: 'tuyển dụng, việc làm, vận hành máy tiện NC, sản xuất'
            }
        },
        'news': {
            title: {
                ja: 'ニュース | O.N.Precision - お知らせ・新着情報',
                en: 'News | O.N.Precision - Announcements & Updates',
                vi: 'Tin Tức | O.N.Precision - Thông Báo & Cập Nhật'
            },
            description: {
                ja: 'O.N.Precisionのニュース・お知らせ。設備増強、新製品、会社情報などをお届けします。',
                en: 'O.N.Precision news and announcements. Equipment upgrades, new products, and company information.',
                vi: 'Tin tức và thông báo O.N.Precision. Nâng cấp thiết bị, sản phẩm mới và thông tin công ty.'
            },
            keywords: {
                ja: 'ニュース, お知らせ, 新着情報, O.N.Precision',
                en: 'news, announcements, updates, O.N.Precision',
                vi: 'tin tức, thông báo, cập nhật, O.N.Precision'
            }
        },
        'news-detail': {
            title: {
                ja: 'ニュース詳細 | O.N.Precision',
                en: 'News Detail | O.N.Precision',
                vi: 'Chi Tiết Tin Tức | O.N.Precision'
            },
            description: {
                ja: 'O.N.Precisionの最新ニュース詳細をお届けします。設備投資、技術情報、会社からのお知らせ。',
                en: 'Detailed news from O.N.Precision. Equipment investment, technical information, and company announcements.',
                vi: 'Chi tiết tin tức từ O.N.Precision. Đầu tư thiết bị, thông tin kỹ thuật và thông báo công ty.'
            },
            keywords: {
                ja: 'ニュース詳細, O.N.Precision, お知らせ',
                en: 'news detail, O.N.Precision, announcements',
                vi: 'chi tiết tin tức, O.N.Precision, thông báo'
            }
        },
        'product-detail': {
            title: {
                ja: '製品詳細 | O.N.Precision - 精密切削加工製品',
                en: 'Product Detail | O.N.Precision - Precision Machined Parts',
                vi: 'Chi Tiết Sản Phẩm | O.N.Precision - Linh Kiện Gia Công Chính Xác'
            },
            description: {
                ja: 'O.N.Precisionの精密加工製品詳細。高品質な精密切削加工品をご紹介します。',
                en: 'O.N.Precision precision machined product details. High-quality precision cutting products.',
                vi: 'Chi tiết sản phẩm gia công chính xác O.N.Precision. Sản phẩm cắt gọt chính xác chất lượng cao.'
            },
            keywords: {
                ja: '製品詳細, 精密加工, O.N.Precision',
                en: 'product detail, precision machining, O.N.Precision',
                vi: 'chi tiết sản phẩm, gia công chính xác, O.N.Precision'
            }
        }
    };

    // Company information
    const COMPANY_INFO = {
        name: 'O.N.Precision',
        alternateName: 'O.N.Precision Co., Ltd.',
        url: BASE_URL,
        logo: `${BASE_URL}/assets/images/logo.png`,
        description: {
            ja: '精密切削加工の専門メーカー。自動車部品・電子部品の高精度加工を承ります。',
            en: 'Professional precision machining manufacturer specializing in automotive and electronic components.',
            vi: 'Nhà sản xuất gia công chính xác chuyên nghiệp về linh kiện ô tô và điện tử.'
        },
        address: {
            streetAddress: '281 Đường Số 1, Ấp 3',
            addressLocality: 'Củ Chi',
            addressRegion: 'Hồ Chí Minh',
            postalCode: '00000',
            addressCountry: 'VN'
        },
        telephone: '+84-907-692-367',
        email: 'info@O.N.Precision.com',
        openingHours: 'Mo-Fr 08:00-17:00',
        priceRange: '$$',
        sameAs: [
            'https://www.youtube.com/@nagaokaseiki'
        ]
    };

    /**
     * Get current language
     */
    function getLang() {
        return localStorage.getItem('preferred_language') || 'ja';
    }

    /**
     * Inject JSON-LD script into head
     */
    function injectSchema(schema) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema, null, 0);
        document.head.appendChild(script);
    }

    /**
     * Generate Organization schema
     */
    function generateOrganizationSchema() {
        const lang = getLang();
        return {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            '@id': `${BASE_URL}/#organization`,
            name: COMPANY_INFO.name,
            alternateName: COMPANY_INFO.alternateName,
            url: COMPANY_INFO.url,
            logo: {
                '@type': 'ImageObject',
                url: COMPANY_INFO.logo,
                width: 200,
                height: 60
            },
            description: COMPANY_INFO.description[lang],
            address: {
                '@type': 'PostalAddress',
                ...COMPANY_INFO.address
            },
            telephone: COMPANY_INFO.telephone,
            email: COMPANY_INFO.email,
            sameAs: COMPANY_INFO.sameAs
        };
    }

    /**
     * Generate LocalBusiness schema
     */
    function generateLocalBusinessSchema() {
        const lang = getLang();
        return {
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            '@id': `${BASE_URL}/#localbusiness`,
            name: COMPANY_INFO.name,
            image: COMPANY_INFO.logo,
            url: COMPANY_INFO.url,
            telephone: COMPANY_INFO.telephone,
            email: COMPANY_INFO.email,
            address: {
                '@type': 'PostalAddress',
                ...COMPANY_INFO.address
            },
            openingHoursSpecification: {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '08:00',
                closes: '17:00'
            },
            priceRange: COMPANY_INFO.priceRange,
            description: COMPANY_INFO.description[lang]
        };
    }

    /**
     * Generate Breadcrumb schema
     */
    function generateBreadcrumbSchema(items) {
        return {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: items.map((item, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: item.name,
                item: item.url ? `${BASE_URL}${item.url}` : undefined
            }))
        };
    }

    /**
     * Generate WebPage schema
     */
    function generateWebPageSchema(options = {}) {
        const lang = getLang();
        const {
            name = document.title,
            description = document.querySelector('meta[name="description"]')?.content || '',
            url = window.location.href,
            image = `${BASE_URL}/assets/images/og-image.jpg`
        } = options;

        return {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            '@id': `${url}#webpage`,
            url: url,
            name: name,
            description: description,
            inLanguage: lang === 'ja' ? 'ja-JP' : lang === 'vi' ? 'vi-VN' : 'en-US',
            isPartOf: {
                '@id': `${BASE_URL}/#website`
            },
            primaryImageOfPage: {
                '@type': 'ImageObject',
                url: image
            },
            datePublished: '2024-01-01',
            dateModified: new Date().toISOString().split('T')[0]
        };
    }

    /**
     * Generate Product schema
     */
    function generateProductSchema(product) {
        return {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description,
            image: product.image,
            brand: {
                '@type': 'Brand',
                name: COMPANY_INFO.name
            },
            manufacturer: {
                '@type': 'Organization',
                name: COMPANY_INFO.name
            },
            category: product.category,
            material: product.material
        };
    }

    /**
     * Generate FAQ schema
     */
    function generateFAQSchema(faqs) {
        return {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map(faq => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: faq.answer
                }
            }))
        };
    }

    /**
     * Generate Article schema (for news)
     */
    function generateArticleSchema(article) {
        return {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.title,
            description: article.excerpt,
            image: article.image,
            datePublished: article.datePublished,
            dateModified: article.dateModified || article.datePublished,
            author: {
                '@type': 'Organization',
                name: COMPANY_INFO.name
            },
            publisher: {
                '@type': 'Organization',
                name: COMPANY_INFO.name,
                logo: {
                    '@type': 'ImageObject',
                    url: COMPANY_INFO.logo
                }
            }
        };
    }

    /**
     * Generate WebSite schema with SearchAction
     */
    function generateWebSiteSchema() {
        return {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            '@id': `${BASE_URL}/#website`,
            url: BASE_URL,
            name: COMPANY_INFO.name,
            description: COMPANY_INFO.description.ja,
            publisher: {
                '@id': `${BASE_URL}/#organization`
            },
            inLanguage: ['ja-JP', 'en-US', 'vi-VN']
        };
    }

    /**
     * Update canonical URL based on current language
     */
    function updateCanonical() {
        const lang = getLang();
        let canonical = document.querySelector('link[rel="canonical"]');

        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }

        const basePath = window.location.pathname;
        const langParam = lang !== 'ja' ? `?lang=${lang}` : '';
        canonical.href = `${BASE_URL}${basePath}${langParam}`;
    }

    /**
     * Update Open Graph tags based on language
     */
    function updateOpenGraph() {
        const lang = getLang();
        const localeMap = {
            ja: 'ja_JP',
            en: 'en_US',
            vi: 'vi_VN'
        };

        const ogLocale = document.querySelector('meta[property="og:locale"]');
        if (ogLocale) {
            ogLocale.content = localeMap[lang] || 'ja_JP';
        }
    }

    /**
     * Initialize SEO for homepage
     */
    function initHomepage() {
        injectSchema(generateWebSiteSchema());
        injectSchema(generateOrganizationSchema());
        injectSchema(generateLocalBusinessSchema());
        injectSchema(generateBreadcrumbSchema([
            { name: 'Home' }
        ]));
    }

    /**
     * Initialize SEO for products page
     */
    function initProductsPage() {
        const lang = getLang();
        injectSchema(generateBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: lang === 'ja' ? '加工事例' : lang === 'vi' ? 'Sản phẩm' : 'Products' }
        ]));
    }

    /**
     * Initialize SEO for company page
     */
    function initCompanyPage() {
        const lang = getLang();
        injectSchema(generateBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: lang === 'ja' ? '会社概要' : lang === 'vi' ? 'Về chúng tôi' : 'About Us' }
        ]));
        injectSchema(generateLocalBusinessSchema());
    }

    /**
     * Initialize SEO for news page
     */
    function initNewsPage() {
        const lang = getLang();
        injectSchema(generateBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: lang === 'ja' ? 'ニュース' : lang === 'vi' ? 'Tin tức' : 'News' }
        ]));
    }

    /**
     * Initialize SEO for contact page
     */
    function initContactPage() {
        const lang = getLang();
        injectSchema(generateBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: lang === 'ja' ? 'お問い合わせ' : lang === 'vi' ? 'Liên hệ' : 'Contact' }
        ]));
    }

    /**
     * Get current page key from pathname
     */
    function getPageKey() {
        const path = window.location.pathname;
        if (path === '/' || path.endsWith('index.html')) return 'index';
        if (path.includes('product-detail')) return 'product-detail';
        if (path.includes('products')) return 'products';
        if (path.includes('news-detail')) return 'news-detail';
        if (path.includes('news')) return 'news';
        if (path.includes('works')) return 'works';
        if (path.includes('equipment')) return 'equipment';
        if (path.includes('company')) return 'company';
        if (path.includes('contact')) return 'contact';
        if (path.includes('recruit')) return 'recruit';
        return 'index';
    }

    /**
     * Update meta tags dynamically based on language
     */
    function updateMetaTags() {
        const lang = getLang();
        const pageKey = getPageKey();
        const seoData = PAGE_SEO[pageKey];

        if (!seoData) return;

        // Update document title
        if (seoData.title && seoData.title[lang]) {
            document.title = seoData.title[lang];
        }

        // Update meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && seoData.description && seoData.description[lang]) {
            metaDesc.content = seoData.description[lang];
        }

        // Update meta keywords
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (seoData.keywords && seoData.keywords[lang]) {
            if (!metaKeywords) {
                metaKeywords = document.createElement('meta');
                metaKeywords.name = 'keywords';
                document.head.appendChild(metaKeywords);
            }
            metaKeywords.content = seoData.keywords[lang];
        }

        // Update OG title
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle && seoData.title && seoData.title[lang]) {
            ogTitle.content = seoData.title[lang];
        }

        // Update OG description
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc && seoData.description && seoData.description[lang]) {
            ogDesc.content = seoData.description[lang];
        }

        // Update Twitter title
        const twTitle = document.querySelector('meta[name="twitter:title"]');
        if (twTitle && seoData.title && seoData.title[lang]) {
            twTitle.content = seoData.title[lang];
        }

        // Update Twitter description
        const twDesc = document.querySelector('meta[name="twitter:description"]');
        if (twDesc && seoData.description && seoData.description[lang]) {
            twDesc.content = seoData.description[lang];
        }

        // Update HTML lang attribute
        const langMap = { ja: 'ja', en: 'en', vi: 'vi' };
        document.documentElement.lang = langMap[lang] || 'ja';

        console.log(`[SEO] Updated meta tags for language: ${lang}`);
    }

    /**
     * Auto-detect page type and initialize SEO
     */
    function autoInit() {
        const path = window.location.pathname;

        updateCanonical();
        updateOpenGraph();
        updateMetaTags();

        if (path === '/' || path.endsWith('index.html')) {
            initHomepage();
        } else if (path.includes('products')) {
            initProductsPage();
        } else if (path.includes('company')) {
            initCompanyPage();
        } else if (path.includes('news')) {
            initNewsPage();
        } else if (path.includes('contact')) {
            initContactPage();
        }

        // Listen for language changes
        window.addEventListener('languageChanged', () => {
            updateCanonical();
            updateOpenGraph();
            updateMetaTags();
        });
    }

    // Public API
    return {
        init: autoInit,
        updateMetaTags,
        generateOrganizationSchema,
        generateLocalBusinessSchema,
        generateBreadcrumbSchema,
        generateProductSchema,
        generateArticleSchema,
        generateFAQSchema,
        injectSchema
    };

})();

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', SEOManager.init);
} else {
    SEOManager.init();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SEOManager;
}

window.SEOManager = SEOManager;
