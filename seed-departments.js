/**
 * Script to seed/update departments with images
 */
const { getAll, run, close } = require('./server/config/database');

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

async function seedDepartments() {
    console.log('🌱 Starting department seeding...');

    for (const dept of departments) {
        try {
            // Check if exists
            const existing = await getAll('SELECT id FROM departments WHERE code = ?', [dept.code]);

            if (existing.length > 0) {
                // Update existing
                await run(`
                    UPDATE departments SET
                        name_ja = ?, name_en = ?, name_vi = ?,
                        description_ja = ?, description_en = ?, description_vi = ?,
                        image = ?, icon = ?, color = ?, sort_order = ?
                    WHERE code = ?
                `, [
                    dept.name_ja, dept.name_en, dept.name_vi,
                    dept.description_ja, dept.description_en, dept.description_vi,
                    dept.image, dept.icon, dept.color, dept.sort_order,
                    dept.code
                ]);
                console.log(`  ✅ Updated: ${dept.code}`);
            } else {
                // Insert new
                await run(`
                    INSERT INTO departments (code, name_ja, name_en, name_vi, description_ja, description_en, description_vi, image, icon, color, sort_order)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [
                    dept.code, dept.name_ja, dept.name_en, dept.name_vi,
                    dept.description_ja, dept.description_en, dept.description_vi,
                    dept.image, dept.icon, dept.color, dept.sort_order
                ]);
                console.log(`  ✅ Inserted: ${dept.code}`);
            }
        } catch (error) {
            console.error(`  ❌ Error with ${dept.code}:`, error.message);
        }
    }

    // Delete old/unused departments
    const validCodes = departments.map(d => d.code);
    try {
        await run(`DELETE FROM departments WHERE code NOT IN (${validCodes.map(() => '?').join(',')})`, validCodes);
        console.log('🧹 Cleaned up old departments');
    } catch (e) {
        console.error('Error cleaning up:', e.message);
    }

    console.log('\n✅ Department seeding complete!');

    // Show results
    const result = await getAll('SELECT code, name_vi, image FROM departments ORDER BY sort_order');
    console.log('\n📋 Current departments:');
    result.forEach(d => console.log(`   - ${d.code}: ${d.name_vi} (${d.image})`));

    await close();
}

seedDepartments();
