/**
 * ==============================================
 * Database Configuration - SQLite (async)
 * ==============================================
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/onp.sqlite');
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('❌ Database connection error:', err.message);
        process.exit(1);
    }
    console.log('✅ Connected to SQLite database');
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// ==============================================
// Khởi tạo các bảng
// ==============================================
db.serialize(() => {
    // Bảng Products
    db.run(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name_ja TEXT NOT NULL,
            name_en TEXT,
            name_vi TEXT,
            description_ja TEXT,
            description_en TEXT,
            description_vi TEXT,
            material TEXT NOT NULL DEFAULT 'brass',
            category TEXT,
            size TEXT,
            tolerance TEXT,
            surface TEXT,
            process TEXT,
            customer TEXT,
            image TEXT,
            images TEXT,
            is_featured INTEGER DEFAULT 0,
            sort_order INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Thêm cột customer nếu chưa có (migration)
    db.run(`ALTER TABLE products ADD COLUMN customer TEXT`, (err) => {
        // Ignore error if column already exists
    });

    // Thêm cột surface_vi nếu chưa có (migration)
    db.run(`ALTER TABLE products ADD COLUMN surface_vi TEXT`, (err) => {
        // Ignore error if column already exists
    });

    // Thêm cột process_vi nếu chưa có (migration)
    db.run(`ALTER TABLE products ADD COLUMN process_vi TEXT`, (err) => {
        // Ignore error if column already exists
    });

    // Bảng News
    db.run(`
        CREATE TABLE IF NOT EXISTS news (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title_ja TEXT NOT NULL,
            title_en TEXT,
            title_vi TEXT,
            excerpt_ja TEXT,
            excerpt_en TEXT,
            excerpt_vi TEXT,
            content_ja TEXT,
            content_en TEXT,
            content_vi TEXT,
            category TEXT DEFAULT 'info',
            image TEXT,
            published_at DATE,
            is_published INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Bảng Users (Admin)
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fullname TEXT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'editor',
            token TEXT,
            is_active INTEGER DEFAULT 1,
            last_login DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Bảng Contacts (Liên hệ)
    db.run(`
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            company TEXT,
            subject TEXT,
            message TEXT NOT NULL,
            attachments TEXT,
            is_read INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Thêm cột attachments nếu chưa có (migration)
    db.run(`ALTER TABLE contacts ADD COLUMN attachments TEXT`, (err) => {
        // Ignore error if column already exists
    });

    // Bảng Departments (Bộ phận)
    db.run(`
        CREATE TABLE IF NOT EXISTS departments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT UNIQUE NOT NULL,
            name_ja TEXT NOT NULL,
            name_en TEXT,
            name_vi TEXT,
            description_ja TEXT,
            description_en TEXT,
            description_vi TEXT,
            image TEXT,
            icon TEXT,
            color TEXT DEFAULT '#1a365d',
            sort_order INTEGER DEFAULT 0,
            is_active INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Migration: Thêm cột image nếu chưa có
    db.run(`ALTER TABLE departments ADD COLUMN image TEXT`, (err) => {
        // Ignore error if column already exists
    });

    // Migration: Thêm cột images (JSON array) nếu chưa có
    db.run(`ALTER TABLE departments ADD COLUMN images TEXT`, (err) => {
        // Ignore error if column already exists
    });

    // Seed Data - Departments
    db.get("SELECT COUNT(*) as count FROM departments", (err, row) => {
        if (err || row.count > 0) return;

        console.log('🌱 Seeding departments...');

        const departments = [
            { code: 'cnc', name_ja: 'CNC加工室', name_en: 'CNC Machining Room', name_vi: 'Phòng CNC', description_ja: 'NC自動旋盤による精密切削加工を行う主力部門', description_en: 'Main department for precision cutting with NC automatic lathes', description_vi: 'Bộ phận chính cho gia công cắt gọt chính xác bằng máy tiện NC tự động', image: '/assets/images/departments/cnc.png', icon: '⚙️', color: '#8b1a1a', sort_order: 1 },
            { code: 'cam', name_ja: 'CAMプログラミング室', name_en: 'CAM Programming Room', name_vi: 'Phòng CAM', description_ja: 'CAD/CAMソフトウェアによる加工プログラム作成', description_en: 'Machining program creation with CAD/CAM software', description_vi: 'Tạo chương trình gia công bằng phần mềm CAD/CAM', image: '/assets/images/departments/cam.png', icon: '💻', color: '#2563eb', sort_order: 2 },
            { code: 'kcs', name_ja: 'KCS検査室', name_en: 'KCS Inspection Room', name_vi: 'Phòng KCS', description_ja: '製品検査・外観検査を行う部門', description_en: 'Product and visual inspection department', description_vi: 'Bộ phận kiểm tra sản phẩm và kiểm tra ngoại quan', image: '/assets/images/departments/kcs.png', icon: '🔍', color: '#16a34a', sort_order: 3 },
            { code: 'qc', name_ja: 'QC品質管理室', name_en: 'QC Quality Control Room', name_vi: 'Phòng QC', description_ja: '三次元測定機による精密検査と品質保証', description_en: 'Precision inspection and quality assurance with CMM', description_vi: 'Kiểm tra chính xác và đảm bảo chất lượng bằng CMM', image: '/assets/images/departments/qc.png', icon: '📏', color: '#7c3aed', sort_order: 4 },
            { code: 'washing', name_ja: '洗浄室', name_en: 'Washing Room', name_vi: 'Phòng Rửa', description_ja: '超音波洗浄機による部品洗浄工程', description_en: 'Parts cleaning process with ultrasonic cleaning machines', description_vi: 'Quy trình rửa linh kiện bằng máy rửa siêu âm', image: '/assets/images/departments/washing.png', icon: '🧹', color: '#0891b2', sort_order: 5 },
            { code: 'packing', name_ja: '梱包室', name_en: 'Packing Room', name_vi: 'Phòng Đóng gói', description_ja: '製品の梱包・出荷準備を行う部門', description_en: 'Department for product packaging and shipping preparation', description_vi: 'Bộ phận đóng gói và chuẩn bị giao hàng', image: '/assets/images/departments/packing.png', icon: '📦', color: '#ea580c', sort_order: 6 },
            { code: 'support', name_ja: '補助部門', name_en: 'Support Department', name_vi: 'Phòng Phụ trợ', description_ja: '工具管理・保守メンテナンスを行う部門', description_en: 'Tool management and maintenance department', description_vi: 'Bộ phận quản lý công cụ và bảo trì', image: '/assets/images/departments/support.png', icon: '🔧', color: '#64748b', sort_order: 7 },
            { code: 'assembly', name_ja: '組立室', name_en: 'Assembly Room', name_vi: 'Phòng Lắp ráp', description_ja: '精密部品の組立・検品を行う部門', description_en: 'Department for precision parts assembly and inspection', description_vi: 'Bộ phận lắp ráp và kiểm tra linh kiện chính xác', image: '/assets/images/departments/assembly.png', icon: '🔩', color: '#b91c1c', sort_order: 8 },
            { code: 'office', name_ja: '事務所', name_en: 'Office', name_vi: 'Văn phòng', description_ja: '営業・管理業務を行う事務所', description_en: 'Office for sales and administrative operations', description_vi: 'Văn phòng quản lý và kinh doanh', image: '/assets/images/departments/office.png', icon: '🏢', color: '#1e40af', sort_order: 9 }
        ];

        const insertStmt = db.prepare(`
            INSERT INTO departments (code, name_ja, name_en, name_vi, description_ja, description_en, description_vi, image, icon, color, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        departments.forEach((d) => {
            insertStmt.run(d.code, d.name_ja, d.name_en, d.name_vi, d.description_ja, d.description_en, d.description_vi, d.image, d.icon, d.color, d.sort_order);
        });

        insertStmt.finalize();
        console.log('✅ Seeded ' + departments.length + ' departments');
    });

    // Bảng Equipment (Thiết bị máy móc)
    db.run(`
        CREATE TABLE IF NOT EXISTS equipment (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            department_id INTEGER,
            name_ja TEXT NOT NULL,
            name_en TEXT,
            name_vi TEXT,
            category TEXT DEFAULT 'machine',
            brand TEXT,
            model TEXT,
            specs_ja TEXT,
            specs_en TEXT,
            specs_vi TEXT,
            quantity INTEGER DEFAULT 1,
            year INTEGER,
            country TEXT,
            image TEXT,
            images TEXT,
            sort_order INTEGER DEFAULT 0,
            is_active INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (department_id) REFERENCES departments(id)
        )
    `);

    // Migration: Thêm department_id nếu chưa có
    db.run(`ALTER TABLE equipment ADD COLUMN department_id INTEGER`, (err) => {
        // Ignore if column exists
    });

    // Bảng Materials (Vật liệu)
    db.run(`
        CREATE TABLE IF NOT EXISTS materials (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT NOT NULL UNIQUE,
            name_ja TEXT NOT NULL,
            name_en TEXT,
            name_vi TEXT,
            color TEXT DEFAULT '#6b7280',
            icon TEXT,
            sort_order INTEGER DEFAULT 0,
            is_active INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // ==============================================
    // Seed Data - Sản phẩm mẫu với các khách hàng
    // ==============================================
    db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
        if (err || row.count > 0) return; // Bỏ qua nếu đã có data

        console.log('🌱 Seeding sample products with customers...');

        const sampleProducts = [
            // Toyota - Brass parts
            { name_ja: '精密黄銅シャフト', name_en: 'Precision Brass Shaft', name_vi: 'Trục đồng thau chính xác', material: 'brass', customer: 'Toyota Motor', size: 'φ8.0 × L50.0mm', tolerance: '±0.01mm', is_featured: 1 },
            { name_ja: '黄銅コネクタピン', name_en: 'Brass Connector Pin', name_vi: 'Chốt kết nối đồng thau', material: 'brass', customer: 'Toyota Motor', size: 'φ2.0 × L15.0mm', tolerance: '±0.005mm', is_featured: 0 },

            // Honda - Stainless parts
            { name_ja: 'ステンレスバルブ', name_en: 'Stainless Valve', name_vi: 'Van inox', material: 'stainless', customer: 'Honda Vietnam', size: 'φ12.0 × L30.0mm', tolerance: '±0.02mm', is_featured: 1 },
            { name_ja: 'ステンレスボルト', name_en: 'Stainless Bolt', name_vi: 'Bu lông inox', material: 'stainless', customer: 'Honda Vietnam', size: 'M8 × L25.0mm', tolerance: '±0.03mm', is_featured: 0 },

            // Samsung - Aluminum parts
            { name_ja: 'アルミ放熱板', name_en: 'Aluminum Heatsink', name_vi: 'Tản nhiệt nhôm', material: 'aluminum', customer: 'Samsung Electronics', size: '50 × 50 × 10mm', tolerance: '±0.05mm', is_featured: 1 },
            { name_ja: 'アルミフレーム', name_en: 'Aluminum Frame', name_vi: 'Khung nhôm', material: 'aluminum', customer: 'Samsung Electronics', size: '100 × 80 × 5mm', tolerance: '±0.1mm', is_featured: 0 },

            // Panasonic - Mixed parts
            { name_ja: '精密電子部品', name_en: 'Precision Electronic Parts', name_vi: 'Linh kiện điện tử chính xác', material: 'brass', customer: 'Panasonic', size: 'φ3.0 × L10.0mm', tolerance: '±0.002mm', is_featured: 1 },
            { name_ja: 'ステンレスケース', name_en: 'Stainless Case', name_vi: 'Vỏ inox', material: 'stainless', customer: 'Panasonic', size: '30 × 20 × 15mm', tolerance: '±0.02mm', is_featured: 0 },

            // Canon - Precision parts
            { name_ja: 'レンズマウント', name_en: 'Lens Mount', name_vi: 'Đế gắn ống kính', material: 'aluminum', customer: 'Canon Inc.', size: 'φ60.0mm', tolerance: '±0.005mm', is_featured: 1 },
            { name_ja: '精密歯車', name_en: 'Precision Gear', name_vi: 'Bánh răng chính xác', material: 'steel', customer: 'Canon Inc.', size: 'φ25.0mm', tolerance: '±0.01mm', is_featured: 0 },

            // Denso - Automotive parts
            { name_ja: '燃料噴射ノズル', name_en: 'Fuel Injection Nozzle', name_vi: 'Vòi phun nhiên liệu', material: 'stainless', customer: 'Denso Vietnam', size: 'φ6.0 × L20.0mm', tolerance: '±0.003mm', is_featured: 1 },
            { name_ja: 'センサーハウジング', name_en: 'Sensor Housing', name_vi: 'Vỏ cảm biến', material: 'aluminum', customer: 'Denso Vietnam', size: 'φ18.0 × L35.0mm', tolerance: '±0.02mm', is_featured: 0 }
        ];

        const insertStmt = db.prepare(`
            INSERT INTO products (name_ja, name_en, name_vi, material, customer, size, tolerance, is_featured, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        sampleProducts.forEach((p, idx) => {
            insertStmt.run(p.name_ja, p.name_en, p.name_vi, p.material, p.customer, p.size, p.tolerance, p.is_featured, idx + 1);
        });

        insertStmt.finalize();
        console.log('✅ Seeded ' + sampleProducts.length + ' sample products');
    });

    // ==============================================
    // Seed Data - Thiết bị máy móc mẫu
    // ==============================================
    db.get("SELECT COUNT(*) as count FROM equipment", (err, row) => {
        if (err || row.count > 0) return;

        console.log('🌱 Seeding sample equipment...');

        const sampleEquipment = [
            // CNC Machines
            { name_ja: 'CNC複合加工機', name_en: 'CNC Multi-tasking Machine', name_vi: 'Máy gia công đa năng CNC', category: 'cnc', brand: 'MAZAK', model: 'INTEGREX i-200', specs_ja: '主軸回転数: 4,000rpm / ストローク X600×Y500×Z500', specs_en: 'Spindle Speed: 4,000rpm / Stroke X600×Y500×Z500', specs_vi: 'Tốc độ trục chính: 4,000rpm / Hành trình X600×Y500×Z500', quantity: 2, year: 2020, country: 'Japan' },
            { name_ja: 'NC自動旋盤', name_en: 'NC Automatic Lathe', name_vi: 'Máy tiện tự động NC', category: 'cnc', brand: 'CITIZEN', model: 'L20-VIII', specs_ja: '加工径: φ20mm / 主軸回転数: 10,000rpm', specs_en: 'Max Diameter: φ20mm / Spindle Speed: 10,000rpm', specs_vi: 'Đường kính max: φ20mm / Tốc độ trục chính: 10,000rpm', quantity: 5, year: 2019, country: 'Japan' },
            { name_ja: 'CNC旋盤', name_en: 'CNC Lathe', name_vi: 'Máy tiện CNC', category: 'cnc', brand: 'OKUMA', model: 'LB3000 EX II', specs_ja: '加工径: φ300mm / 加工長: 500mm', specs_en: 'Max Diameter: φ300mm / Max Length: 500mm', specs_vi: 'Đường kính max: φ300mm / Chiều dài max: 500mm', quantity: 3, year: 2021, country: 'Japan' },

            // Milling Machines
            { name_ja: 'マシニングセンター', name_en: 'Machining Center', name_vi: 'Trung tâm gia công', category: 'milling', brand: 'MAKINO', model: 'PS95', specs_ja: 'テーブルサイズ: 900×500mm / 主軸回転数: 14,000rpm', specs_en: 'Table Size: 900×500mm / Spindle Speed: 14,000rpm', specs_vi: 'Kích thước bàn: 900×500mm / Tốc độ trục chính: 14,000rpm', quantity: 2, year: 2020, country: 'Japan' },
            { name_ja: '5軸マシニングセンター', name_en: '5-Axis Machining Center', name_vi: 'Trung tâm gia công 5 trục', category: 'milling', brand: 'DMG MORI', model: 'DMU 50', specs_ja: '5軸同時加工 / 主軸回転数: 20,000rpm', specs_en: '5-Axis Simultaneous / Spindle Speed: 20,000rpm', specs_vi: 'Gia công đồng thời 5 trục / Tốc độ: 20,000rpm', quantity: 1, year: 2022, country: 'Germany' },

            // Grinding Machines  
            { name_ja: '円筒研削盤', name_en: 'Cylindrical Grinder', name_vi: 'Máy mài trụ', category: 'grinding', brand: 'TOYODA', model: 'GL4Pn-100', specs_ja: '加工径: φ300mm / 砥石径: φ405mm', specs_en: 'Max Diameter: φ300mm / Wheel Diameter: φ405mm', specs_vi: 'Đường kính max: φ300mm / Đường kính đá mài: φ405mm', quantity: 2, year: 2018, country: 'Japan' },
            { name_ja: '平面研削盤', name_en: 'Surface Grinder', name_vi: 'Máy mài phẳng', category: 'grinding', brand: 'OKAMOTO', model: 'PSG-64DX', specs_ja: 'テーブルサイズ: 600×400mm', specs_en: 'Table Size: 600×400mm', specs_vi: 'Kích thước bàn: 600×400mm', quantity: 1, year: 2019, country: 'Japan' },

            // Quality Control Equipment
            { name_ja: '三次元測定機', name_en: '3D Coordinate Measuring Machine', name_vi: 'Máy đo 3D CMM', category: 'qc', brand: 'ZEISS', model: 'CONTURA G2', specs_ja: '測定範囲: 700×1000×600mm / 精度: 1.8+L/300 μm', specs_en: 'Range: 700×1000×600mm / Accuracy: 1.8+L/300 μm', specs_vi: 'Phạm vi đo: 700×1000×600mm / Độ chính xác: 1.8+L/300 μm', quantity: 1, year: 2021, country: 'Germany' },
            { name_ja: '画像測定機', name_en: 'Vision Measuring System', name_vi: 'Hệ thống đo hình ảnh', category: 'qc', brand: 'KEYENCE', model: 'IM-7020', specs_ja: '測定範囲: 200×100mm / 倍率: 0.35~7x', specs_en: 'Range: 200×100mm / Magnification: 0.35~7x', specs_vi: 'Phạm vi: 200×100mm / Độ phóng đại: 0.35~7x', quantity: 2, year: 2020, country: 'Japan' },
            { name_ja: '表面粗さ測定機', name_en: 'Surface Roughness Tester', name_vi: 'Máy đo độ nhám bề mặt', category: 'qc', brand: 'MITUTOYO', model: 'SJ-410', specs_ja: '測定範囲: 800μm / 分解能: 0.000125μm', specs_en: 'Range: 800μm / Resolution: 0.000125μm', specs_vi: 'Phạm vi: 800μm / Độ phân giải: 0.000125μm', quantity: 3, year: 2019, country: 'Japan' },
            { name_ja: '硬度計', name_en: 'Hardness Tester', name_vi: 'Máy đo độ cứng', category: 'qc', brand: 'MITUTOYO', model: 'HR-530', specs_ja: 'ロックウェル/ビッカース/ブリネル対応', specs_en: 'Rockwell/Vickers/Brinell Compatible', specs_vi: 'Tương thích Rockwell/Vickers/Brinell', quantity: 1, year: 2018, country: 'Japan' }
        ];

        const insertStmt = db.prepare(`
            INSERT INTO equipment (name_ja, name_en, name_vi, category, brand, model, specs_ja, specs_en, specs_vi, quantity, year, country, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        sampleEquipment.forEach((e, idx) => {
            insertStmt.run(e.name_ja, e.name_en, e.name_vi, e.category, e.brand, e.model, e.specs_ja, e.specs_en, e.specs_vi, e.quantity, e.year, e.country, idx + 1);
        });

        insertStmt.finalize();
        console.log('✅ Seeded ' + sampleEquipment.length + ' sample equipment');
    });
});

// ==============================================
// Promise Wrappers
// ==============================================

const getAll = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows || []);
        });
    });
};

const getOne = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

const run = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve({ lastInsertRowid: this.lastID, changes: this.changes });
        });
    });
};

const close = () => {
    return new Promise((resolve, reject) => {
        db.close((err) => {
            if (err) reject(err);
            else {
                console.log('Database connection closed');
                resolve();
            }
        });
    });
};

process.on('SIGINT', async () => {
    await close();
    process.exit(0);
});

module.exports = { db, getAll, getOne, run, close };
