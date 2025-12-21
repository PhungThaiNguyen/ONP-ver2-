/**
 * Update Departments with Multiple Images
 * Chạy: node update-dept-images.js
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'server', 'data', 'onp.sqlite');
const db = new sqlite3.Database(DB_PATH);

console.log('🖼️ Updating department images...\n');

const departmentImages = {
    'cnc': [
        '/assets/images/departments/cnc.png',
        '/assets/images/departments/cnc-1.png',
        '/assets/images/departments/cnc-2.png',
        '/assets/images/departments/cnc-3.png'
    ],
    'cam': [
        '/assets/images/departments/cam.png',
        '/assets/images/departments/cam-1.png',
        '/assets/images/departments/cam-2.png'
    ],
    'kcs': [
        '/assets/images/departments/kcs.png',
        '/assets/images/departments/kcs-1.png',
        '/assets/images/departments/kcs-2.png'
    ],
    'qc': [
        '/assets/images/departments/qc.png',
        '/assets/images/departments/qc-1.png',
        '/assets/images/departments/qc-2.png'
    ],
    'washing': [
        '/assets/images/departments/washing.png',
        '/assets/images/departments/washing-1.png',
        '/assets/images/departments/washing-2.png'
    ],
    'packing': [
        '/assets/images/departments/packing.png',
        '/assets/images/departments/packing-1.png',
        '/assets/images/departments/packing-2.png'
    ],
    'support': [
        '/assets/images/departments/support.png',
        '/assets/images/departments/support-1.png'
    ],
    'assembly': [
        '/assets/images/departments/assembly.png',
        '/assets/images/departments/assembly-1.png',
        '/assets/images/departments/assembly-2.png'
    ],
    'office': [
        '/assets/images/departments/office.png',
        '/assets/images/departments/office-1.png'
    ]
};

const updateDepartment = (code, images) => {
    return new Promise((resolve, reject) => {
        const imagesJson = JSON.stringify(images);
        const mainImage = images[0];

        db.run(
            `UPDATE departments SET image = ?, images = ? WHERE code = ?`,
            [mainImage, imagesJson, code],
            function (err) {
                if (err) {
                    console.error(`  ❌ Error updating ${code}:`, err.message);
                    reject(err);
                } else if (this.changes > 0) {
                    console.log(`  ✅ ${code}: ${images.length} images`);
                    resolve();
                } else {
                    console.log(`  ⚠️ ${code}: Not found in database`);
                    resolve();
                }
            }
        );
    });
};

async function main() {
    try {
        for (const [code, images] of Object.entries(departmentImages)) {
            await updateDepartment(code, images);
        }

        console.log('\n✅ All department images updated!');

        // Show summary
        db.all('SELECT code, image, images FROM departments ORDER BY sort_order', (err, rows) => {
            if (err) {
                console.error('Error fetching:', err);
            } else {
                console.log('\n📋 Current department images:');
                rows.forEach(row => {
                    const count = row.images ? JSON.parse(row.images).length : 0;
                    console.log(`   - ${row.code}: ${count} image(s)`);
                });
            }
            db.close();
        });
    } catch (err) {
        console.error('Error:', err);
        db.close();
    }
}

main();
