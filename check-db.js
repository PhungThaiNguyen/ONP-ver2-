// Check database tables
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./server/data/onp.sqlite');

db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
    console.log('=== DATABASE TABLES ===');
    console.log(tables.map(t => t.name).join(', '));

    db.all("SELECT id, fullname, username, email, role, is_active FROM users", (e, users) => {
        console.log('\n=== USERS TABLE ===');
        if (e) {
            console.log('Error:', e.message);
        } else if (!users || users.length === 0) {
            console.log('No users found. Register first at /admin/register.html');
        } else {
            console.log('Users count:', users.length);
            users.forEach(u => {
                console.log(`  - ID: ${u.id}, ${u.username} (${u.email}) - ${u.role}`);
            });
        }
        db.close();
    });
});
