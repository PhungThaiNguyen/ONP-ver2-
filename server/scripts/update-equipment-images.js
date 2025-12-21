/**
 * Script cập nhật hình ảnh cho Equipment
 * Chạy: node server/scripts/update-equipment-images.js
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Correct database path
const dbPath = path.join(__dirname, '../data/onp.sqlite');
console.log('Database path:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
    }
    console.log('Connected to database\n');
});

// First, list all equipment
db.all('SELECT id, name_ja, name_vi FROM equipment ORDER BY id', (err, rows) => {
    if (err) {
        console.error('Error:', err.message);
        db.close();
        return;
    }

    console.log('Current equipment:');
    rows.forEach(r => {
        console.log(`  ID ${r.id}: ${r.name_vi || r.name_ja}`);
    });

    // Update each equipment with images
    console.log('\n🖼️ Updating images...');

    const imageUrls = [
        'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=800',
        'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800',
        'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800'
    ];

    let completed = 0;

    rows.forEach((eq, index) => {
        const mainImage = imageUrls[index % imageUrls.length];
        const extraImages = [
            imageUrls[(index + 1) % imageUrls.length],
            imageUrls[(index + 2) % imageUrls.length]
        ];

        db.run(
            'UPDATE equipment SET image = ?, images = ? WHERE id = ?',
            [mainImage, JSON.stringify(extraImages), eq.id],
            function (err) {
                completed++;
                if (err) {
                    console.error(`❌ Error updating ID ${eq.id}:`, err.message);
                } else {
                    console.log(`✅ Updated ID ${eq.id}: ${eq.name_vi || eq.name_ja}`);
                }

                if (completed === rows.length) {
                    console.log('\n✅ Done! All equipment now have images.');
                    db.close();
                }
            }
        );
    });
});
