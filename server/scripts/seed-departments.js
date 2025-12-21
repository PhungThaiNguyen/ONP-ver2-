/**
 * Script seed departments và cập nhật equipment
 * Chạy: node server/scripts/seed-departments.js
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

// Seed Departments
const departments = [
    { code: 'cnc', name_ja: 'CNC加工', name_en: 'CNC Machining', name_vi: 'Gia công CNC', description_ja: 'CNC加工部門', description_en: 'CNC Machining Department', description_vi: 'Bộ phận gia công CNC với máy tiện, phay tự động', icon: '⚙️', color: '#1a365d', sort_order: 1 },
    { code: 'cam', name_ja: 'CAM/CAD', name_en: 'CAM/CAD', name_vi: 'CAM/CAD', description_ja: 'CAM/CAD設計部門', description_en: 'CAM/CAD Design Department', description_vi: 'Bộ phận lập trình CAM và thiết kế CAD', icon: '💻', color: '#2c5282', sort_order: 2 },
    { code: 'grinding', name_ja: '研削加工', name_en: 'Grinding', name_vi: 'Mài', description_ja: '研削加工部門', description_en: 'Grinding Department', description_vi: 'Bộ phận mài bao gồm mài trụ, mài phẳng', icon: '🔧', color: '#4a5568', sort_order: 3 },
    { code: 'qc', name_ja: '品質管理', name_en: 'Quality Control', name_vi: 'Kiểm tra chất lượng (QC)', description_ja: '品質管理部門', description_en: 'Quality Control Department', description_vi: 'Bộ phận kiểm tra chất lượng sản phẩm', icon: '✅', color: '#38a169', sort_order: 4 },
    { code: 'washing', name_ja: '洗浄', name_en: 'Washing', name_vi: 'Rửa', description_ja: '洗浄部門', description_en: 'Washing Department', description_vi: 'Bộ phận rửa và làm sạch sản phẩm', icon: '💧', color: '#3182ce', sort_order: 5 },
    { code: 'packaging', name_ja: '梱包', name_en: 'Packaging', name_vi: 'Đóng gói', description_ja: '梱包・出荷部門', description_en: 'Packaging & Shipping', description_vi: 'Bộ phận đóng gói và xuất hàng', icon: '📦', color: '#805ad5', sort_order: 6 },
    { code: 'warehouse', name_ja: '倉庫', name_en: 'Warehouse', name_vi: 'Kho', description_ja: '倉庫管理', description_en: 'Warehouse Management', description_vi: 'Kho nguyên liệu và thành phẩm', icon: '🏭', color: '#d69e2e', sort_order: 7 },
    { code: 'maintenance', name_ja: 'メンテナンス', name_en: 'Maintenance', name_vi: 'Bảo trì', description_ja: '設備メンテナンス', description_en: 'Equipment Maintenance', description_vi: 'Bộ phận bảo trì và sửa chữa thiết bị', icon: '🔨', color: '#e53e3e', sort_order: 8 }
];

// Thêm thiết bị mới cho các bộ phận
const additionalEquipment = [
    // Washing Department
    { dept: 'washing', name_ja: '超音波洗浄機', name_en: 'Ultrasonic Cleaner', name_vi: 'Máy rửa siêu âm', category: 'cleaning', brand: 'BRANSON', model: 'CPX8800H', specs_ja: '容量: 20L / 周波数: 40kHz', specs_en: 'Capacity: 20L / Frequency: 40kHz', specs_vi: 'Dung tích: 20L / Tần số: 40kHz', quantity: 3, year: 2020, country: 'USA' },
    { dept: 'washing', name_ja: '乾燥機', name_en: 'Drying Machine', name_vi: 'Máy sấy', category: 'cleaning', brand: 'DESPATCH', model: 'LCC1-54', specs_ja: '温度範囲: 38~260°C', specs_en: 'Temp Range: 38~260°C', specs_vi: 'Nhiệt độ: 38~260°C', quantity: 2, year: 2019, country: 'USA' },

    // Packaging Department
    { dept: 'packaging', name_ja: '真空包装機', name_en: 'Vacuum Packaging Machine', name_vi: 'Máy đóng gói chân không', category: 'packaging', brand: 'HENKELMAN', model: 'BOXER 42', specs_ja: 'シール長: 420mm', specs_en: 'Seal Length: 420mm', specs_vi: 'Chiều dài seal: 420mm', quantity: 2, year: 2021, country: 'Netherlands' },
    { dept: 'packaging', name_ja: 'ラベルプリンター', name_en: 'Label Printer', name_vi: 'Máy in nhãn', category: 'packaging', brand: 'ZEBRA', model: 'ZT411', specs_ja: '印字幅: 104mm', specs_en: 'Print Width: 104mm', specs_vi: 'Chiều rộng in: 104mm', quantity: 3, year: 2022, country: 'USA' },

    // CAM Department
    { dept: 'cam', name_ja: 'CAMワークステーション', name_en: 'CAM Workstation', name_vi: 'Máy trạm CAM', category: 'computer', brand: 'HP', model: 'Z8 G4', specs_ja: 'Intel Xeon / 64GB RAM', specs_en: 'Intel Xeon / 64GB RAM', specs_vi: 'Intel Xeon / 64GB RAM', quantity: 5, year: 2021, country: 'USA' }
];

// Mapping category cũ sang department code
const categoryToDept = {
    'cnc': 'cnc',
    'milling': 'cnc',
    'grinding': 'grinding',
    'qc': 'qc'
};

async function seedDepartments() {
    return new Promise((resolve, reject) => {
        console.log('🌱 Seeding departments...');

        const insertStmt = db.prepare(`
            INSERT OR IGNORE INTO departments (code, name_ja, name_en, name_vi, description_ja, description_en, description_vi, icon, color, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        departments.forEach((d) => {
            insertStmt.run(d.code, d.name_ja, d.name_en, d.name_vi, d.description_ja, d.description_en, d.description_vi, d.icon, d.color, d.sort_order);
        });

        insertStmt.finalize((err) => {
            if (err) reject(err);
            else {
                console.log('✅ Seeded ' + departments.length + ' departments');
                resolve();
            }
        });
    });
}

async function updateEquipmentDepartments() {
    return new Promise((resolve, reject) => {
        console.log('🔄 Updating equipment with department_id...');

        // Get all departments
        db.all("SELECT id, code FROM departments", (err, depts) => {
            if (err) {
                reject(err);
                return;
            }

            const deptMap = {};
            depts.forEach(d => deptMap[d.code] = d.id);

            // Update existing equipment based on category
            Object.entries(categoryToDept).forEach(([category, deptCode]) => {
                const deptId = deptMap[deptCode];
                if (deptId) {
                    db.run(
                        "UPDATE equipment SET department_id = ? WHERE category = ? AND department_id IS NULL",
                        [deptId, category],
                        function (err) {
                            if (!err && this.changes > 0) {
                                console.log(`  ✅ Updated ${this.changes} equipment in ${category} -> ${deptCode}`);
                            }
                        }
                    );
                }
            });

            resolve(deptMap);
        });
    });
}

async function addNewEquipment(deptMap) {
    return new Promise((resolve, reject) => {
        console.log('➕ Adding new equipment for departments...');

        const insertStmt = db.prepare(`
            INSERT INTO equipment (department_id, name_ja, name_en, name_vi, category, brand, model, specs_ja, specs_en, specs_vi, quantity, year, country, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        additionalEquipment.forEach((e, idx) => {
            const deptId = deptMap[e.dept];
            insertStmt.run(deptId, e.name_ja, e.name_en, e.name_vi, e.category, e.brand, e.model, e.specs_ja, e.specs_en, e.specs_vi, e.quantity, e.year, e.country, 100 + idx);
        });

        insertStmt.finalize((err) => {
            if (err) reject(err);
            else {
                console.log('✅ Added ' + additionalEquipment.length + ' new equipment');
                resolve();
            }
        });
    });
}

async function run() {
    try {
        await seedDepartments();
        const deptMap = await updateEquipmentDepartments();
        await addNewEquipment(deptMap);

        console.log('\n🎉 Done! Departments and equipment updated successfully.');

        // Show summary
        db.all("SELECT d.name_vi, COUNT(e.id) as count FROM departments d LEFT JOIN equipment e ON d.id = e.department_id GROUP BY d.id ORDER BY d.sort_order", (err, rows) => {
            if (!err && rows) {
                console.log('\n📊 Equipment by Department:');
                rows.forEach(r => {
                    console.log(`   ${r.name_vi}: ${r.count} thiết bị`);
                });
            }
            db.close();
        });
    } catch (err) {
        console.error('❌ Error:', err.message);
        db.close();
    }
}

run();
