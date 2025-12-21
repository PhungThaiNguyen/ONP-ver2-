/**
 * User Controller - CRUD + Role Management
 */

const crypto = require('crypto');
const { getAll, getOne, run } = require('../config/database');

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// GET /api/users - Lấy danh sách users (chỉ admin)
exports.getAll = async (req, res) => {
    try {
        const users = await getAll(`
            SELECT id, fullname, username, email, role, is_active, last_login, created_at 
            FROM users ORDER BY id DESC
        `);
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching users' });
    }
};

// GET /api/users/:id
exports.getById = async (req, res) => {
    try {
        const user = await getOne(`
            SELECT id, fullname, username, email, role, is_active, last_login, created_at 
            FROM users WHERE id = ?
        `, [req.params.id]);

        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching user' });
    }
};

// POST /api/users - Tạo user mới (chỉ admin)
exports.create = async (req, res) => {
    try {
        const { fullname, username, email, password, role } = req.body;

        if (!username || !password || !email) {
            return res.status(400).json({ success: false, message: 'Required fields: username, email, password' });
        }

        // Check duplicates
        const existing = await getOne('SELECT id FROM users WHERE username = ? OR email = ?', [username, email]);
        if (existing) {
            return res.status(400).json({ success: false, message: 'Username or email already exists' });
        }

        const hashedPassword = hashPassword(password);
        const result = await run(`
            INSERT INTO users (fullname, username, email, password, role, is_active)
            VALUES (?, ?, ?, ?, ?, 1)
        `, [fullname || username, username, email, hashedPassword, role || 'editor']);

        const newUser = await getOne('SELECT id, fullname, username, email, role FROM users WHERE id = ?', [result.lastInsertRowid]);
        res.status(201).json({ success: true, message: 'User created', data: newUser });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating user' });
    }
};

// PUT /api/users/:id - Cập nhật user
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullname, email, role, is_active, password } = req.body;

        const existing = await getOne('SELECT * FROM users WHERE id = ?', [id]);
        if (!existing) return res.status(404).json({ success: false, message: 'User not found' });

        // Check email duplicate
        if (email && email !== existing.email) {
            const emailExists = await getOne('SELECT id FROM users WHERE email = ? AND id != ?', [email, id]);
            if (emailExists) return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        let sql = 'UPDATE users SET updated_at = CURRENT_TIMESTAMP';
        const params = [];

        if (fullname !== undefined) { sql += ', fullname = ?'; params.push(fullname); }
        if (email !== undefined) { sql += ', email = ?'; params.push(email); }
        if (role !== undefined) { sql += ', role = ?'; params.push(role); }
        if (is_active !== undefined) { sql += ', is_active = ?'; params.push(is_active); }
        if (password) { sql += ', password = ?'; params.push(hashPassword(password)); }

        sql += ' WHERE id = ?';
        params.push(id);

        await run(sql, params);
        const updated = await getOne('SELECT id, fullname, username, email, role, is_active FROM users WHERE id = ?', [id]);
        res.json({ success: true, message: 'User updated', data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating user' });
    }
};

// DELETE /api/users/:id
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        // Không cho xóa chính mình
        if (req.user && req.user.id == id) {
            return res.status(400).json({ success: false, message: 'Cannot delete yourself' });
        }

        const existing = await getOne('SELECT * FROM users WHERE id = ?', [id]);
        if (!existing) return res.status(404).json({ success: false, message: 'User not found' });

        await run('DELETE FROM users WHERE id = ?', [id]);
        res.json({ success: true, message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting user' });
    }
};

// ============================================
// PERMISSION DEFINITIONS
// ============================================
const PERMISSIONS = {
    admin: {
        users: ['read', 'create', 'update', 'delete'],
        products: ['read', 'create', 'update', 'delete'],
        news: ['read', 'create', 'update', 'delete']
    },
    editor: {
        users: ['read'],
        products: ['read', 'create', 'update'],
        news: ['read', 'create', 'update']
    },
    viewer: {
        users: [],
        products: ['read'],
        news: ['read']
    }
};

// Check permission helper
exports.hasPermission = (role, resource, action) => {
    const rolePerms = PERMISSIONS[role];
    if (!rolePerms) return false;
    const resourcePerms = rolePerms[resource];
    if (!resourcePerms) return false;
    return resourcePerms.includes(action);
};

// GET /api/users/permissions - Lấy permissions của user hiện tại
exports.getPermissions = async (req, res) => {
    const role = req.user?.role || 'viewer';
    res.json({
        success: true,
        role,
        permissions: PERMISSIONS[role] || PERMISSIONS.viewer
    });
};
