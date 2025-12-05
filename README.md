# ONP-Website - ONPrecision

## 📁 Project Structure

```
ONP-Website/
├── index.html                    # Trang chủ
├── pages/                        # Các trang HTML
│   ├── works.html               # Trang dịch vụ
│   ├── equipment.html           # Trang thiết bị
│   ├── company.html             # Trang giới thiệu công ty
│   └── recruit.html             # Trang tuyển dụng
│
├── assets/                       # Tài nguyên tĩnh
│   ├── css/
│   │   ├── base/                # CSS nền tảng
│   │   │   ├── reset.css        # Reset CSS
│   │   │   ├── variables.css    # CSS Variables (màu sắc, fonts)
│   │   │   └── typography.css   # Typography styles
│   │   │
│   │   ├── components/          # CSS cho components tái sử dụng
│   │   │   ├── header.css       # Header/Navigation
│   │   │   ├── footer.css       # Footer
│   │   │   ├── buttons.css      # Buttons
│   │   │   ├── cards.css        # Cards
│   │   │   ├── tables.css       # Tables
│   │   │   └── forms.css        # Forms
│   │   │
│   │   ├── layouts/             # CSS cho layouts
│   │   │   ├── container.css    # Container/Grid
│   │   │   └── sections.css     # Common sections
│   │   │
│   │   ├── pages/               # CSS riêng cho từng trang
│   │   │   ├── home.css         # Trang chủ
│   │   │   ├── works.css        # Trang dịch vụ
│   │   │   ├── equipment.css    # Trang thiết bị
│   │   │   ├── company.css      # Trang công ty
│   │   │   └── recruit.css      # Trang tuyển dụng
│   │   │
│   │   └── main.css             # Import tất cả CSS files
│   │
│   ├── js/
│   │   ├── modules/             # JavaScript modules
│   │   │   ├── navigation.js    # Navigation functionality
│   │   │   ├── language.js      # Language switcher
│   │   │   ├── animations.js    # Scroll animations
│   │   │   └── utils.js         # Utility functions
│   │   │
│   │   ├── data/
│   │   │   └── translations.js  # Translations data
│   │   │
│   │   └── main.js              # Main JavaScript entry
│   │
│   ├── images/
│   │   ├── backgrounds/         # Background images
│   │   ├── products/            # Product images
│   │   ├── equipment/           # Equipment images
│   │   ├── company/             # Company images
│   │   ├── works/               # Works/Process images
│   │   └── icons/               # Icons & logos
│   │
│   └── fonts/                   # Custom fonts (nếu có)
│
├── includes/                     # HTML partials (cho tương lai)
│   ├── header.html              # Header partial
│   ├── footer.html              # Footer partial
│   └── meta.html                # Meta tags partial
│
└── docs/                        # Documentation
    └── README.md                # Hướng dẫn sử dụng
```

## 🎨 CSS Architecture (ITCSS + BEM)

### CSS Variables
Tất cả màu sắc, fonts, spacing được định nghĩa trong `variables.css`

### Naming Convention (BEM)
- Block: `.card`
- Element: `.card__title`
- Modifier: `.card--featured`

## 🌐 Supported Languages
- 🇯🇵 Japanese (ja) - Mặc định
- 🇻🇳 Vietnamese (vi)

## 🚀 Getting Started

1. Mở file `index.html` trong trình duyệt
2. Hoặc sử dụng local server:
   ```bash
   # Python
   python -m http.server 8080
   
   # Node.js
   npx serve
   ```

## 📝 Development Guidelines

### Thêm trang mới:
1. Tạo file HTML trong thư mục `pages/`
2. Tạo CSS riêng trong `assets/css/pages/`
3. Thêm translations trong `translations.js`
4. Cập nhật navigation

### Thêm component:
1. Tạo CSS trong `assets/css/components/`
2. Import vào `main.css`

## 📦 Dependencies
- Google Fonts (Noto Sans JP, Noto Sans)
- Không có framework CSS/JS external
