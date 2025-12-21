# Hướng dẫn SEO Đa ngôn ngữ - O.N.Precision

## 📊 Tổng quan

Website O.N.Precision hỗ trợ SEO cho **3 ngôn ngữ**:
- 🇯🇵 **Tiếng Nhật (ja)** - Mặc định
- 🇬🇧 **Tiếng Anh (en)**
- 🇻🇳 **Tiếng Việt (vi)**

---

## ✅ Các tính năng SEO đa ngôn ngữ đã triển khai

### 1. Dynamic Meta Tags (SEO Manager)
File: `public/assets/js/modules/seo-manager.js`

Tự động cập nhật các thẻ meta theo ngôn ngữ được chọn:
- `<title>` - Tiêu đề trang
- `<meta name="description">` - Mô tả trang
- `<meta name="keywords">` - Từ khóa
- `<meta property="og:title">` - Open Graph title
- `<meta property="og:description">` - Open Graph description
- `<meta name="twitter:title">` - Twitter Card title
- `<meta name="twitter:description">` - Twitter Card description
- `<html lang="">` - Thuộc tính ngôn ngữ

### 2. Hreflang Tags
Mỗi trang có các thẻ hreflang để Google biết các phiên bản ngôn ngữ:

```html
<link rel="alternate" hreflang="ja" href="https://www.onprecision.com/index.html">
<link rel="alternate" hreflang="en" href="https://www.onprecision.com/index.html?lang=en">
<link rel="alternate" hreflang="vi" href="https://www.onprecision.com/index.html?lang=vi">
<link rel="alternate" hreflang="x-default" href="https://www.onprecision.com/index.html">
```

### 3. Sitemap.xml với Hreflang
File: `public/sitemap.xml`

Sitemap bao gồm tất cả các phiên bản ngôn ngữ với xhtml:link

### 4. Structured Data (JSON-LD) Đa ngôn ngữ
- Organization schema với mô tả đa ngôn ngữ
- LocalBusiness schema
- WebSite schema với `inLanguage: ['ja-JP', 'en-US', 'vi-VN']`
- BreadcrumbList schema tự động theo ngôn ngữ

---

## 📄 Trạng thái SEO từng trang

| Trang | Meta Tags | Hreflang | OG Tags | Twitter | Schema | SEO Manager |
|-------|-----------|----------|---------|---------|--------|-------------|
| index.html | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| works.html | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| products.html | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| equipment.html | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| company.html | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| contact.html | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| recruit.html | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| news.html | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| news-detail.html | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| product-detail.html | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

**Chú thích:** ✅ Hoàn thành | Tất cả 10 trang đã được tối ưu SEO đầy đủ!

---

## 🔧 Cách SEO Manager hoạt động

### 1. Tự động phát hiện trang
```javascript
function getPageKey() {
    const path = window.location.pathname;
    if (path.includes('products')) return 'products';
    if (path.includes('news')) return 'news';
    // ...
}
```

### 2. Cập nhật meta tags theo ngôn ngữ
```javascript
function updateMetaTags() {
    const lang = getLang(); // 'ja', 'en', or 'vi'
    const seoData = PAGE_SEO[pageKey];
    
    document.title = seoData.title[lang];
    document.querySelector('meta[name="description"]').content = seoData.description[lang];
    // ...
}
```

### 3. Lắng nghe sự kiện thay đổi ngôn ngữ
```javascript
window.addEventListener('languageChanged', () => {
    updateMetaTags();
});
```

---

## 📝 Cách thêm SEO Manager vào trang mới

1. Thêm script trước `</body>`:
```html
<script src="./assets/js/modules/seo-manager.js"></script>
```

2. Đảm bảo có các meta tags cơ bản trong `<head>`:
```html
<meta name="description" content="">
<meta property="og:title" content="">
<meta property="og:description" content="">
<meta name="twitter:title" content="">
<meta name="twitter:description" content="">
```

3. Thêm data vào `PAGE_SEO` trong `seo-manager.js` nếu là trang mới

---

## 🌐 Nội dung SEO cho từng ngôn ngữ

### Homepage (index)

**Tiếng Nhật:**
- Title: O.N.Precision | 精密切削加工の専門メーカー
- Description: O.N.Precisionは精密切削加工の専門メーカーです。自動車部品・電子部品・医療機器部品の高精度加工を承ります。

**Tiếng Anh:**
- Title: O.N.Precision | Precision Machining Specialist
- Description: O.N.Precision is a professional precision machining manufacturer. We handle high-precision machining for automotive, electronic, and medical device components.

**Tiếng Việt:**
- Title: O.N.Precision | Chuyên Gia Gia Công Chính Xác
- Description: O.N.Precision là nhà sản xuất gia công chính xác chuyên nghiệp. Chúng tôi chuyên gia công độ chính xác cao cho linh kiện ô tô, điện tử và thiết bị y tế.

---

## 🚀 Các bước tiếp theo

1. ✅ ~~Fix encoding news.html~~ - Đã hoàn thành
2. ✅ ~~Thêm SEO Manager~~ - Đã thêm vào tất cả 10 trang
3. **Tạo OG Image**: Tạo file `assets/images/og-image.jpg` (1200x630px)
4. **Đăng ký Google Search Console**: Submit sitemap.xml
5. **Test Structured Data**: Validate với Google Rich Results Test

---

## 📈 Công cụ kiểm tra SEO

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)
- [Open Graph Debugger (Facebook)](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Google Search Console](https://search.google.com/search-console)

---

*Cập nhật: 2024-12-21*
