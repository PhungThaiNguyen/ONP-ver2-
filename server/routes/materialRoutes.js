/**
 * Material API Routes
 */

const express = require('express');
const router = express.Router();
const { getAll, getOne, run } = require('../config/database');
const { requireAuth, requireAdmin, requireEditor } = require('../middleware/auth');

// GET /api/materials - Lấy danh sách vật liệu
router.get('/', async (req, res) => {
    try {
        const { active } = req.query;

        let sql = 'SELECT * FROM materials WHERE 1=1';
        const params = [];

        if (active !== undefined) {
            sql += ' AND is_active = ?';
            params.push(active === 'true' ? 1 : 0);
        }

        sql += ' ORDER BY sort_order ASC, name_ja ASC';

        const materials = await getAll(sql, params);

        res.json({
            success: true,
            data: materials,
            total: materials.length
        });
    } catch (err) {
        console.error('Error getting materials:', err.message);
        res.status(500).json({
            success: false,
            message: 'Error retrieving materials'
        });
    }
});

// GET /api/materials/:id - Chi tiết vật liệu
router.get('/:id', async (req, res) => {
    try {
        const material = await getOne(
            'SELECT * FROM materials WHERE id = ?',
            [req.params.id]
        );

        if (!material) {
            return res.status(404).json({
                success: false,
                message: 'Material not found'
            });
        }

        res.json({
            success: true,
            data: material
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving material'
        });
    }
});

// POST /api/materials - Tạo vật liệu mới (Admin/Editor)
router.post('/', requireAuth, requireEditor, async (req, res) => {
    const { code, name_ja, name_en, name_vi, color, icon, sort_order, is_active } = req.body;

    if (!code || !name_ja) {
        return res.status(400).json({
            success: false,
            message: 'Code and Japanese name are required'
        });
    }

    try {
        const sql = `
            INSERT INTO materials (code, name_ja, name_en, name_vi, color, icon, sort_order, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const result = await run(sql, [
            code.toLowerCase(), name_ja, name_en || '', name_vi || '',
            color || '#6b7280', icon || '', sort_order || 0, is_active !== undefined ? is_active : 1
        ]);

        res.status(201).json({
            success: true,
            message: 'Material created successfully',
            data: { id: result.lastID }
        });
    } catch (err) {
        console.error('Error creating material:', err.message);
        res.status(500).json({
            success: false,
            message: err.message.includes('UNIQUE') ? 'Material code already exists' : 'Error creating material'
        });
    }
});

// PUT /api/materials/:id - Cập nhật vật liệu (Admin/Editor)
router.put('/:id', requireAuth, requireEditor, async (req, res) => {
    const { id } = req.params;
    const { code, name_ja, name_en, name_vi, color, icon, sort_order, is_active } = req.body;

    try {
        const existing = await getOne('SELECT id FROM materials WHERE id = ?', [id]);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: 'Material not found'
            });
        }

        const sql = `
            UPDATE materials SET
                code = ?, name_ja = ?, name_en = ?, name_vi = ?,
                color = ?, icon = ?, sort_order = ?, is_active = ?
            WHERE id = ?
        `;

        await run(sql, [
            code.toLowerCase(), name_ja, name_en || '', name_vi || '',
            color || '#6b7280', icon || '', sort_order || 0, is_active !== undefined ? is_active : 1,
            id
        ]);

        res.json({
            success: true,
            message: 'Material updated successfully'
        });
    } catch (err) {
        console.error('Error updating material:', err.message);
        res.status(500).json({
            success: false,
            message: 'Error updating material'
        });
    }
});

// DELETE /api/materials/:id - Xóa vật liệu (Admin only)
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const existing = await getOne('SELECT id, code FROM materials WHERE id = ?', [id]);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: 'Material not found'
            });
        }

        // Check if material is being used by products
        const products = await getAll('SELECT COUNT(*) as count FROM products WHERE material = ?', [existing.code]);
        if (products[0]?.count > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete. ${products[0].count} products are using this material.`
            });
        }

        await run('DELETE FROM materials WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Material deleted successfully'
        });
    } catch (err) {
        console.error('Error deleting material:', err.message);
        res.status(500).json({
            success: false,
            message: 'Error deleting material'
        });
    }
});

module.exports = router;
