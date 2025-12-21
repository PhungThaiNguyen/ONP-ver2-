/**
 * Department API Routes
 */

const express = require('express');
const router = express.Router();
const { getAll, getOne, run } = require('../config/database');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// GET /api/departments - Lấy danh sách bộ phận
router.get('/', async (req, res) => {
    try {
        const { active } = req.query;

        let sql = 'SELECT * FROM departments WHERE 1=1';
        const params = [];

        if (active !== undefined) {
            sql += ' AND is_active = ?';
            params.push(active === 'true' ? 1 : 0);
        }

        sql += ' ORDER BY sort_order ASC';

        const departments = await getAll(sql, params);

        res.json({
            success: true,
            data: departments,
            total: departments.length
        });
    } catch (err) {
        console.error('Error getting departments:', err.message);
        res.status(500).json({
            success: false,
            message: 'Error retrieving departments'
        });
    }
});

// GET /api/departments/:id - Chi tiết bộ phận
router.get('/:id', async (req, res) => {
    try {
        const department = await getOne(
            'SELECT * FROM departments WHERE id = ?',
            [req.params.id]
        );

        if (!department) {
            return res.status(404).json({
                success: false,
                message: 'Department not found'
            });
        }

        res.json({
            success: true,
            data: department
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving department'
        });
    }
});

// GET /api/departments/:id/equipment - Lấy thiết bị theo bộ phận
router.get('/:id/equipment', async (req, res) => {
    try {
        const equipment = await getAll(
            'SELECT * FROM equipment WHERE department_id = ? AND is_active = 1 ORDER BY sort_order ASC',
            [req.params.id]
        );

        res.json({
            success: true,
            data: equipment,
            total: equipment.length
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving equipment'
        });
    }
});

// POST /api/departments - Tạo bộ phận mới (Admin only)
router.post('/', requireAuth, requireAdmin, async (req, res) => {
    const {
        code, name_ja, name_en, name_vi,
        description_ja, description_en, description_vi,
        image, images, icon, color, sort_order, is_active
    } = req.body;

    if (!code || !name_ja) {
        return res.status(400).json({
            success: false,
            message: 'code and name_ja are required'
        });
    }

    try {
        const sql = `
            INSERT INTO departments (code, name_ja, name_en, name_vi, description_ja, description_en, description_vi, image, images, icon, color, sort_order, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const result = await run(sql, [
            code, name_ja, name_en || '', name_vi || '',
            description_ja || '', description_en || '', description_vi || '',
            image || null, images || null, icon || '', color || '#1a365d', sort_order || 0, is_active !== undefined ? is_active : 1
        ]);

        res.status(201).json({
            success: true,
            message: 'Department created successfully',
            data: { id: result.lastID }
        });
    } catch (err) {
        console.error('Error creating department:', err.message);
        res.status(500).json({
            success: false,
            message: err.message.includes('UNIQUE') ? 'Department code already exists' : 'Error creating department'
        });
    }
});

// PUT /api/departments/:id - Cập nhật bộ phận (Admin only)
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const {
        code, name_ja, name_en, name_vi,
        description_ja, description_en, description_vi,
        image, images, icon, color, sort_order, is_active
    } = req.body;

    try {
        const existing = await getOne('SELECT id FROM departments WHERE id = ?', [id]);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: 'Department not found'
            });
        }

        const sql = `
            UPDATE departments SET
                code = ?, name_ja = ?, name_en = ?, name_vi = ?,
                description_ja = ?, description_en = ?, description_vi = ?,
                image = ?, images = ?, icon = ?, color = ?, sort_order = ?, is_active = ?
            WHERE id = ?
        `;

        await run(sql, [
            code, name_ja, name_en || '', name_vi || '',
            description_ja || '', description_en || '', description_vi || '',
            image || null, images || null, icon || '', color || '#1a365d', sort_order || 0, is_active !== undefined ? is_active : 1,
            id
        ]);

        res.json({
            success: true,
            message: 'Department updated successfully'
        });
    } catch (err) {
        console.error('Error updating department:', err.message);
        res.status(500).json({
            success: false,
            message: 'Error updating department'
        });
    }
});

// DELETE /api/departments/:id - Xóa bộ phận (Admin only)
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const existing = await getOne('SELECT id FROM departments WHERE id = ?', [id]);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: 'Department not found'
            });
        }

        // Set equipment department_id to null instead of deleting
        await run('UPDATE equipment SET department_id = NULL WHERE department_id = ?', [id]);
        await run('DELETE FROM departments WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Department deleted successfully'
        });
    } catch (err) {
        console.error('Error deleting department:', err.message);
        res.status(500).json({
            success: false,
            message: 'Error deleting department'
        });
    }
});

module.exports = router;
