/**
 * Script to seed default materials
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../data/onp.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Database path:', dbPath);

// Default materials
const defaultMaterials = [
    { code: 'brass', name_ja: '真鍮', name_en: 'Brass', name_vi: 'Đồng thau', color: '#d4a574' },
    { code: 'stainless', name_ja: 'ステンレス', name_en: 'Stainless Steel', name_vi: 'Inox', color: '#9ca3af' },
    { code: 'aluminum', name_ja: 'アルミ', name_en: 'Aluminum', name_vi: 'Nhôm', color: '#a8d5e5' },
    { code: 'steel', name_ja: '鋼鉄', name_en: 'Steel', name_vi: 'Thép', color: '#6b7280' },
    { code: 'plastic', name_ja: 'プラスチック', name_en: 'Plastic', name_vi: 'Nhựa', color: '#fbbf24' }
];

console.log('Seeding default materials...');

let completed = 0;
defaultMaterials.forEach((m, index) => {
    db.run(
        'INSERT OR IGNORE INTO materials (code, name_ja, name_en, name_vi, color, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
        [m.code, m.name_ja, m.name_en, m.name_vi, m.color, index],
        function (err) {
            completed++;
            if (!err && this.changes > 0) {
                console.log('Inserted:', m.name_en);
            } else if (!err) {
                console.log('Already exists:', m.name_en);
            }

            if (completed === defaultMaterials.length) {
                console.log('\n✅ Materials seeding completed!');
                db.close();
            }
        }
    );
});
