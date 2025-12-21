# O.N.Precision Website - Node.js + Express + SQLite

## 📁 Cấu trúc Project

```
ONP-Website/
├── server/                          # 🆕 Backend Node.js
│   ├── app.js                       # Entry point Express
│   ├── config/
│   │   └── database.js              # SQLite configuration
│   ├── controllers/                 # Controllers
│   ├── routes/                      # API & Page Routes
│   ├── scripts/                     # Utility scripts
│   └── data/
│       └── onp.sqlite               # SQLite database file
├── public/                          # 🆕 Frontend (Static Files)
│   ├── assets/                      # CSS, JS, Images
│   │   ├── js/
│   │   │   ├── api.js               # API Client
│   │   │   └── ...
│   ├── includes/                    # HTML Partials
│   ├── index.html                   # Main pages
│   ├── products.html
│   └── ...
├── package.json                     # NPM config
└── BACKEND_README.md                # Documentation
```

## 🚀 Hướng dẫn chạy nhanh

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Khởi tạo Database với dữ liệu mẫu
```bash
npm run init-db
```

### 3. Chạy server
```bash
npm start
```
Server sẽ chạy tại: **http://localhost:3000**

## 🔌 API Endpoints

### Products API

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/products` | Lấy danh sách sản phẩm |
| GET | `/api/products?material=brass` | Filter theo material |
| GET | `/api/products?limit=10&page=1` | Pagination |
| GET | `/api/products/featured` | Sản phẩm nổi bật |
| GET | `/api/products/:id` | Chi tiết sản phẩm |
| POST | `/api/products` | Tạo sản phẩm mới |
| PUT | `/api/products/:id` | Cập nhật sản phẩm |
| DELETE | `/api/products/:id` | Xóa sản phẩm |

### News API

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/news` | Lấy danh sách tin tức |
| GET | `/api/news/latest?limit=3` | Tin mới nhất |
| GET | `/api/news/:id` | Chi tiết tin tức |
| POST | `/api/news` | Tạo tin mới |
| PUT | `/api/news/:id` | Cập nhật tin |
| DELETE | `/api/news/:id` | Xóa tin |

## 🌐 Page Routes (Clean URLs)

| URL | HTML File |
|-----|-----------|
| `/` | index.html |
| `/products` | products.html |
| `/product/:id` | product-detail.html |
| `/news` | news.html |
| `/news/:id` | news-detail.html |
| `/company` | company.html |
| `/works` | works.html |
| `/equipment` | equipment.html |
| `/contact` | contact.html |

## 📝 Sử dụng API trong Frontend

### Fetch products
```javascript
// Lấy tất cả products
const result = await API.products.getAll();
console.log(result.data);

// Filter theo material
const brass = await API.products.getAll({ material: 'brass' });

// Lấy chi tiết
const product = await API.products.getById(1);
```

### Render products
```javascript
// Render vào container
await ProductRenderer.renderList('productsGrid', { material: 'brass' });

// Render featured cho trang chủ
await ProductRenderer.renderFeatured('featuredProducts', 6);
```

## 🗃️ Database Schema

### Products Table
```sql
CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name_ja TEXT NOT NULL,
    name_en TEXT,
    name_vi TEXT,
    material TEXT DEFAULT 'brass',  -- brass, stainless, aluminum
    size TEXT,
    tolerance TEXT,
    surface TEXT,
    process TEXT,
    image TEXT,
    is_featured INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0
);
```

### News Table
```sql
CREATE TABLE news (
    id INTEGER PRIMARY KEY,
    title_ja TEXT NOT NULL,
    title_en TEXT,
    title_vi TEXT,
    excerpt_ja TEXT,
    content_ja TEXT,
    image TEXT,
    published_at DATE,
    is_published INTEGER DEFAULT 1
);
```

## 📦 Deploy lên cPanel

1. **Upload files** qua File Manager hoặc FTP
2. **Setup Node.js App** trong cPanel:
   - Application root: `/home/username/onp-website`
   - Application URL: `O.N.Precision.com`
   - Application startup file: `server/app.js`
3. **Run NPM Install** trong terminal
4. **Start Application**

## 📄 Files mới tạo

| File | Mô tả |
|------|-------|
| `package.json` | NPM configuration |
| `server/app.js` | Express entry point |
| `server/config/database.js` | SQLite config & helpers |
| `server/routes/pageRoutes.js` | Serve HTML pages |
| `server/routes/productRoutes.js` | Products API routes |
| `server/routes/newsRoutes.js` | News API routes |
| `server/controllers/productController.js` | Products CRUD logic |
| `server/controllers/newsController.js` | News CRUD logic |
| `server/scripts/initDb.js` | Database init script |
| `assets/js/api.js` | API client for frontend |
| `assets/js/productRenderer.js` | Product rendering |
| `assets/js/newsRenderer.js` | News rendering |

## ✏️ Files đã sửa

| File | Thay đổi |
|------|----------|
| `index.html` | Thêm scripts: api.js, productRenderer.js, newsRenderer.js |

---
*Generated for O.N.Precision - Node.js + Express + SQLite Backend*
