# ONPrecision Website

## 📁 Project Structure

```
ONP-Website/
├── index.html                    # Trang chủ
├── company.html                  # Giới thiệu công ty
├── works.html                    # Dịch vụ/Sự nghiệp
├── products.html                 # Sản phẩm gia công
├── product-detail.html           # Chi tiết sản phẩm
├── equipment.html                # Thiết bị máy móc
├── recruit.html                  # Tuyển dụng
├── news.html                     # Tin tức
├── contact.html                  # Liên hệ
├── thank-you.html                # Trang cảm ơn sau submit form
├── 404.html                      # Trang lỗi 404
├── README.md                     # File hướng dẫn
│
├── assets/                       # Thư mục tài nguyên
│   ├── css/                      # Stylesheets
│   │   ├── main.css              # File CSS chính (import tất cả modules)
│   │   │
│   │   ├── base/                 # Base styles
│   │   │   ├── variables.css     # CSS Variables (colors, fonts, spacing...)
│   │   │   └── reset.css         # CSS Reset & Utilities
│   │   │
│   │   ├── components/           # Component styles
│   │   │   ├── header.css        # Header & Navigation
│   │   │   ├── footer.css        # Footer & Back-to-top
│   │   │   ├── buttons.css       # Button styles
│   │   │   ├── forms.css         # Form elements
│   │   │   ├── cards.css         # Card components
│   │   │   └── sections.css      # Page banners & sections
│   │   │
│   │   ├── layouts/              # Layout styles
│   │   │   └── grid.css          # Grid systems
│   │   │
│   │   └── pages/                # Page-specific styles
│   │       ├── company.css       # Company page
│   │       ├── works.css         # Works page
│   │       ├── equipment.css     # Equipment page
│   │       ├── recruit.css       # Recruit page
│   │       └── news.css          # News page
│   │
│   ├── js/                       # JavaScript
│   │   ├── main.js               # Main JavaScript file
│   │   ├── translations.js       # All translations (JP/VN)
│   │   │
│   │   ├── modules/              # Reusable modules
│   │   │   ├── language-switcher.js  # Language switching
│   │   │   ├── form-validation.js    # Form validation
│   │   │   └── ui-components.js      # UI components (tabs, modal...)
│   │   │
│   │   └── data/                 # Data files
│   │       └── translations.js   # Translations data
│   │
│   ├── images/                   # Images
│   │   ├── logo/                 # Logo files
│   │   ├── hero/                 # Hero images
│   │   ├── products/             # Product images
│   │   ├── equipment/            # Equipment images
│   │   └── company/              # Company images
│   │
│   └── fonts/                    # Custom fonts (if any)
│
└── includes/                     # Reusable HTML components
    ├── header.html               # Header template
    ├── footer.html               # Footer template
    └── meta.html                 # Meta tags template
```

## 🎨 CSS Architecture

### Variables (`base/variables.css`)
```css
/* Colors */
--color-primary: #1a365d;
--color-accent: #8b1a1a;

/* Typography */
--font-size-base: 1rem;
--font-weight-bold: 700;

/* Spacing */
--spacing-md: 1rem;
--spacing-xl: 2rem;

/* Shadows */
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);

/* Transitions */
--transition-base: 0.3s ease;
```

### Usage
```html
<!-- Import main.css để có tất cả styles -->
<link rel="stylesheet" href="./assets/css/main.css">

<!-- Hoặc import từng file -->
<link rel="stylesheet" href="./assets/css/base/variables.css">
<link rel="stylesheet" href="./assets/css/base/reset.css">
<link rel="stylesheet" href="./assets/css/components/header.css">
```

## 📝 JavaScript Modules

### Language Switcher
```javascript
// Initialize với translations object
LanguageSwitcher.init(translations);

// Get current language
const lang = LanguageSwitcher.getCurrent();

// Apply translations manually
LanguageSwitcher.apply('vi', translations);
```

### Form Validation
```javascript
// Initialize form validation
FormValidation.init();

// Validate entire form
const isValid = FormValidation.validate(formElement);

// Validate individual fields
FormValidation.validateEmail(emailInput);
FormValidation.validatePhone(phoneInput);
```

### UI Components
```javascript
// Initialize all components
UIComponents.init();

// Or initialize individually
UIComponents.initBackToTop();
UIComponents.initTabs();
UIComponents.initModal();
```

## 🌐 Bilingual Support

The website supports **Japanese (JP)** and **Vietnamese (VN)**.

### HTML
```html
<span data-i18n="nav_contact">お問い合わせ</span>
```

### Translations Object
```javascript
const translations = {
    ja: {
        nav_contact: "お問い合わせ",
        // ...
    },
    vi: {
        nav_contact: "Liên hệ",
        // ...
    }
};
```

## 📱 Responsive Breakpoints

- **Desktop:** > 992px
- **Tablet:** 768px - 992px
- **Mobile:** < 768px
- **Small Mobile:** < 480px

## 🔧 Development

### Local Development
1. Clone repository
2. Open `index.html` in browser
3. Use Live Server extension for hot reload

### File Naming Convention
- HTML files: lowercase, hyphen-separated (e.g., `product-detail.html`)
- CSS files: lowercase, hyphen-separated (e.g., `form-validation.css`)
- JS files: lowercase, hyphen-separated (e.g., `language-switcher.js`)
- Images: lowercase, hyphen-separated (e.g., `hero-image.jpg`)

## 📧 Contact Form

Uses **FormSubmit** for form handling:
- AJAX submission
- Auto redirect to `thank-you.html`
- Email validation
- Phone validation
- Honeypot spam protection

## 🎯 Key Features

- ✅ Fully responsive design
- ✅ Bilingual (Japanese/Vietnamese)
- ✅ CSS Variables for easy theming
- ✅ Modular CSS & JS architecture
- ✅ Form validation
- ✅ Smooth animations
- ✅ SEO optimized
- ✅ Accessibility features

## 📄 License

© 2024 ONPrecision CO.,LTD. All rights reserved.
