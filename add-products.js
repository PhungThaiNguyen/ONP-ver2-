/**
 * Script thêm sản phẩm Steel và Plastic
 */

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./server/data/onp.sqlite');

const products = [
    // Steel products
    {
        name_ja: '鋼鉄製 高精度シャフト',
        name_en: 'Steel High Precision Shaft',
        name_vi: 'Trục thép độ chính xác cao',
        material: 'steel',
        material_ja: '鋼鉄 (S45C)',
        material_en: 'Steel (S45C)',
        size: 'φ12.0 × L80.0mm',
        tolerance: '±0.005mm',
        surface_ja: '研磨仕上げ',
        surface_en: 'Polished Finish',
        process_ja: 'NC旋盤加工 + 研磨',
        process_en: 'NC Lathe + Polishing',
        image: './assets/images/products/product-01.png',
        is_featured: 1
    },
    {
        name_ja: '鋼鉄製 ベアリングブッシュ',
        name_en: 'Steel Bearing Bush',
        name_vi: 'Bạc đạn thép',
        material: 'steel',
        material_ja: '鋼鉄 (SCM435)',
        material_en: 'Steel (SCM435)',
        size: 'φ25.0 × φ15.0 × L20.0mm',
        tolerance: '±0.01mm',
        surface_ja: '焼入れ処理',
        surface_en: 'Heat Treatment',
        process_ja: 'CNC加工 + 熱処理',
        process_en: 'CNC Machining + Heat Treatment',
        image: './assets/images/products/product-02.png',
        is_featured: 0
    },
    // Plastic products
    {
        name_ja: 'プラスチック製 絶縁スペーサー',
        name_en: 'Plastic Insulation Spacer',
        name_vi: 'Miếng cách điện nhựa',
        material: 'plastic',
        material_ja: 'POM樹脂',
        material_en: 'POM Resin',
        size: 'φ8.0 × φ4.0 × L5.0mm',
        tolerance: '±0.05mm',
        surface_ja: '切削仕上げ',
        surface_en: 'Machined Finish',
        process_ja: 'NC旋盤加工',
        process_en: 'NC Lathe Machining',
        image: './assets/images/products/product-03.png',
        is_featured: 1
    },
    {
        name_ja: 'プラスチック製 精密ギア',
        name_en: 'Plastic Precision Gear',
        name_vi: 'Bánh răng nhựa chính xác',
        material: 'plastic',
        material_ja: 'MC Nylon',
        material_en: 'MC Nylon',
        size: 'φ30.0 × L10.0mm',
        tolerance: '±0.02mm',
        surface_ja: '切削仕上げ',
        surface_en: 'Machined Finish',
        process_ja: 'CNC加工',
        process_en: 'CNC Machining',
        image: './assets/images/products/product-04.png',
        is_featured: 0
    },
    {
        name_ja: 'プラスチック製 コネクタハウジング',
        name_en: 'Plastic Connector Housing',
        name_vi: 'Vỏ connector nhựa',
        material: 'plastic',
        material_ja: 'PBT樹脂',
        material_en: 'PBT Resin',
        size: '15.0 × 10.0 × 8.0mm',
        tolerance: '±0.03mm',
        surface_ja: '切削仕上げ',
        surface_en: 'Machined Finish',
        process_ja: 'マシニングセンタ',
        process_en: 'Machining Center',
        image: './assets/images/products/product-05.png',
        is_featured: 0
    }
];

let count = 0;

products.forEach(p => {
    const sql = `INSERT INTO products (name_ja, name_en, name_vi, material, material_ja, material_en, size, tolerance, surface_ja, surface_en, process_ja, process_en, image, is_featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`;

    db.run(sql, [p.name_ja, p.name_en, p.name_vi, p.material, p.material_ja, p.material_en, p.size, p.tolerance, p.surface_ja, p.surface_en, p.process_ja, p.process_en, p.image, p.is_featured], function (err) {
        count++;
        if (err) {
            console.log('Error:', err.message);
        } else {
            console.log(`✅ Created: ${p.name_ja} (${p.material})`);
        }

        if (count === products.length) {
            console.log('\n========================================');
            console.log('✅ Done! Created ' + products.length + ' products:');
            console.log('   - 2 Steel products (鋼鉄)');
            console.log('   - 3 Plastic products (プラスチック)');
            console.log('========================================');
            db.close();
        }
    });
});
