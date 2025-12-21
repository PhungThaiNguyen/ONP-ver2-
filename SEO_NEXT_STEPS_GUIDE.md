# 📋 Hướng Dẫn Các Bước Tiếp Theo - SEO O.N.Precision

## Mục lục
1. [Tạo OG Image](#1-tạo-og-image)
2. [Đăng ký Google Search Console](#2-đăng-ký-google-search-console)
3. [Submit Sitemap](#3-submit-sitemap)
4. [Validate Structured Data](#4-validate-structured-data)
5. [Kiểm tra SEO](#5-kiểm-tra-seo)

---

## 1. Tạo OG Image

### OG Image là gì?
OG Image (Open Graph Image) là hình ảnh hiển thị khi link website được chia sẻ trên Facebook, Twitter, LinkedIn, Zalo, v.v.

### Yêu cầu kỹ thuật:
- **Kích thước**: 1200 x 630 pixels (tỉ lệ 1.91:1)
- **Định dạng**: JPG hoặc PNG
- **Dung lượng**: Dưới 1MB (khuyến nghị < 300KB)
- **Tên file**: `og-image.jpg`
- **Đường dẫn**: `public/assets/images/og-image.jpg`

### Nội dung đề xuất:
- Logo O.N.Precision ở giữa
- Tên công ty: "O.N.Precision"
- Tagline: "精密切削加工の専門メーカー" hoặc "Precision Machining Specialist"
- Màu nền: Gradient xanh đậm (#1a365d) đến đỏ đậm (#8b1a1a)
- Có thể thêm hình ảnh máy CNC hoặc linh kiện gia công

### Cách tạo:

#### Cách 1: Dùng Canva (Đơn giản nhất)
1. Truy cập https://www.canva.com
2. Tạo thiết kế mới với kích thước **1200 x 630 px**
3. Chọn template hoặc tự thiết kế
4. Thêm logo, tên công ty, slogan
5. Tải về định dạng JPG
6. Đổi tên file thành `og-image.jpg`
7. Copy vào thư mục `public/assets/images/`

#### Cách 2: Dùng Photoshop/Figma
1. Tạo file mới 1200 x 630 px
2. Thiết kế theo brand guideline
3. Export JPG chất lượng cao
4. Đặt vào `public/assets/images/og-image.jpg`

#### Cách 3: Dùng công cụ online miễn phí
- [Placid.app](https://placid.app/) - Tạo OG image tự động
- [Meta for Developers](https://developers.facebook.com/docs/sharing/best-practices) - Hướng dẫn của Facebook

---

## 2. Đăng ký Google Search Console

### Bước 1: Truy cập Google Search Console
1. Mở trình duyệt, vào https://search.google.com/search-console
2. Đăng nhập bằng tài khoản Google (khuyến nghị dùng email công ty)

### Bước 2: Thêm Property (Website)
1. Click **"Add property"** (Thêm thuộc tính)
2. Chọn loại property:
   - **URL prefix**: `https://www.onprecision.com` (Đơn giản hơn)
   - Hoặc **Domain**: `onprecision.com` (Bao gồm tất cả subdomain)

### Bước 3: Xác minh quyền sở hữu

#### Phương pháp 1: HTML file (Khuyến nghị)
1. Google sẽ cung cấp file HTML, ví dụ: `google1234567890.html`
2. Download file này
3. Upload vào thư mục `public/` của website
4. Đảm bảo file có thể truy cập tại `https://www.onprecision.com/google1234567890.html`
5. Click **Verify** trong Google Search Console

#### Phương pháp 2: HTML tag
1. Google cung cấp một thẻ meta, ví dụ:
```html
<meta name="google-site-verification" content="abc123xyz..." />
```
2. Thêm vào phần `<head>` của `index.html` (sau thẻ `<meta charset>`)
3. Deploy website
4. Click **Verify**

#### Phương pháp 3: DNS (Cho domain verification)
1. Thêm TXT record vào DNS của domain
2. Giá trị do Google cung cấp
3. Chờ DNS propagate (có thể mất 24-48 giờ)
4. Click **Verify**

---

## 3. Submit Sitemap

### Sau khi xác minh thành công:

1. Trong Google Search Console, vào menu **Sitemaps** (bên trái)
2. Trong ô "Add a new sitemap", nhập: `sitemap.xml`
3. Click **Submit**
4. Chờ Google xử lý (thường mất vài phút đến vài giờ)

### Kiểm tra trạng thái:
- **Success**: Sitemap đã được đọc thành công
- **Couldn't fetch**: Kiểm tra lại đường dẫn sitemap
- **Has errors**: Click để xem chi tiết lỗi

### Lưu ý:
- Sitemap của bạn đã sẵn sàng tại: `https://www.onprecision.com/sitemap.xml`
- Sitemap đã bao gồm hreflang cho 3 ngôn ngữ (ja, en, vi)
- Google sẽ tự động crawl lại khi có cập nhật

---

## 4. Validate Structured Data

### Công cụ kiểm tra:

#### 4.1. Google Rich Results Test
**URL**: https://search.google.com/test/rich-results

1. Nhập URL trang cần kiểm tra, ví dụ:
   - `https://www.onprecision.com/`
   - `https://www.onprecision.com/products.html`
   - `https://www.onprecision.com/company.html`
2. Click **Test URL**
3. Chờ kết quả (khoảng 30 giây)
4. Xem các schema được phát hiện:
   - ✅ Organization
   - ✅ LocalBusiness
   - ✅ WebSite
   - ✅ BreadcrumbList

#### 4.2. Schema.org Validator
**URL**: https://validator.schema.org/

1. Chọn **Fetch URL**
2. Nhập URL website
3. Click **Run**
4. Kiểm tra không có lỗi (errors) màu đỏ
5. Warnings (màu vàng) thường có thể chấp nhận được

#### 4.3. Google Search Console - Core Web Vitals
1. Trong Search Console, vào **Core Web Vitals**
2. Kiểm tra các chỉ số:
   - **LCP** (Largest Contentful Paint): < 2.5s
   - **FID** (First Input Delay): < 100ms
   - **CLS** (Cumulative Layout Shift): < 0.1

---

## 5. Kiểm tra SEO

### 5.1. Kiểm tra Meta Tags
Dùng extension browser hoặc công cụ online:

**Extension Chrome khuyến nghị:**
- [SEO META in 1 CLICK](https://chrome.google.com/webstore/detail/seo-meta-in-1-click/)
- [Detailed SEO Extension](https://chrome.google.com/webstore/detail/detailed-seo-extension/)

**Công cụ online:**
- https://metatags.io/ - Preview OG image
- https://cards-dev.twitter.com/validator - Preview Twitter Card

### 5.2. Kiểm tra Hreflang
**URL**: https://technicalseo.com/tools/hreflang/

1. Nhập URL website
2. Kiểm tra các ngôn ngữ được phát hiện:
   - ja (Japanese)
   - en (English)
   - vi (Vietnamese)
   - x-default

### 5.3. Test Social Sharing

#### Facebook Debugger:
1. Vào https://developers.facebook.com/tools/debug/
2. Nhập URL website
3. Click **Debug**
4. Xem preview hình ảnh và nội dung
5. Nếu cần cập nhật, click **Scrape Again**

#### LinkedIn Post Inspector:
1. Vào https://www.linkedin.com/post-inspector/
2. Nhập URL
3. Kiểm tra preview

---

## 📝 Checklist Hoàn Thành

```
SEO Technical Setup:
☐ Tạo OG Image (1200x630px)
☐ Đăng ký Google Search Console
☐ Xác minh quyền sở hữu website
☐ Submit sitemap.xml
☐ Validate structured data (Rich Results Test)
☐ Kiểm tra hreflang tags
☐ Test Facebook/Twitter sharing

Monitoring (Hàng tuần):
☐ Kiểm tra Search Console cho lỗi crawl
☐ Theo dõi impressions và clicks
☐ Kiểm tra Core Web Vitals
```

---

## 🔗 Tài nguyên hữu ích

| Công cụ | URL | Mục đích |
|---------|-----|----------|
| Google Search Console | https://search.google.com/search-console | Monitoring |
| Rich Results Test | https://search.google.com/test/rich-results | Structured Data |
| PageSpeed Insights | https://pagespeed.web.dev/ | Performance |
| Facebook Debugger | https://developers.facebook.com/tools/debug/ | OG Preview |
| Twitter Card Validator | https://cards-dev.twitter.com/validator | Twitter Preview |
| Schema Validator | https://validator.schema.org/ | Schema Check |
| Hreflang Checker | https://technicalseo.com/tools/hreflang/ | Language Tags |

---

## ❓ FAQ

### Q: Mất bao lâu để Google index website?
**A:** Thường từ vài ngày đến 2-4 tuần. Sau khi submit sitemap, Google sẽ tự động crawl.

### Q: Làm sao biết website đã được index?
**A:** Tìm trên Google: `site:onprecision.com` - Nếu thấy kết quả nghĩa là đã được index.

### Q: OG Image không hiển thị đúng trên Facebook?
**A:** Vào Facebook Debugger, nhập URL và click "Scrape Again" để Facebook cập nhật cache.

### Q: Cần cập nhật sitemap khi nào?
**A:** Khi thêm trang mới, thay đổi URL, hoặc cập nhật nội dung quan trọng. Sitemap có `lastmod` để thông báo thay đổi.

---

*Tạo bởi: Antigravity AI*
*Ngày: 2024-12-21*
