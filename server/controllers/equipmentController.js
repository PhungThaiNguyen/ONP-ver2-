/**
 * Equipment Controller
 * CRUD operations cho thiết bị máy móc
 */

const { getAll, getOne, run } = require('../config/database');

// GET /api/equipment - Lấy danh sách thiết bị
exports.getAll = async (req, res) => {
    try {
        const { category, department_id, active } = req.query;

        let sql = `
            SELECT e.*, d.code as department_code, d.name_ja as department_name_ja, 
                   d.name_en as department_name_en, d.name_vi as department_name_vi
            FROM equipment e
            LEFT JOIN departments d ON e.department_id = d.id
            WHERE 1=1
        `;
        const params = [];

        if (category) {
            sql += ' AND e.category = ?';
            params.push(category);
        }

        if (department_id) {
            sql += ' AND e.department_id = ?';
            params.push(department_id);
        }

        if (active !== undefined) {
            sql += ' AND e.is_active = ?';
            params.push(active === 'true' ? 1 : 0);
        }

        sql += ' ORDER BY e.sort_order ASC, e.id ASC';

        const equipment = await getAll(sql, params);

        res.json({
            success: true,
            data: equipment,
            total: equipment.length
        });
    } catch (err) {
        console.error('Error getting equipment:', err.message);
        res.status(500).json({
            success: false,
            message: 'Error retrieving equipment'
        });
    }
};

// GET /api/equipment/categories - Lấy danh sách categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await getAll(
            'SELECT DISTINCT category FROM equipment WHERE category IS NOT NULL ORDER BY category'
        );

        res.json({
            success: true,
            data: categories.map(c => c.category)
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving categories'
        });
    }
};

// GET /api/equipment/:id - Chi tiết thiết bị
exports.getById = async (req, res) => {
    try {
        const equipment = await getOne(
            'SELECT * FROM equipment WHERE id = ?',
            [req.params.id]
        );

        if (!equipment) {
            return res.status(404).json({
                success: false,
                message: 'Equipment not found'
            });
        }

        res.json({
            success: true,
            data: equipment
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving equipment'
        });
    }
};

// POST /api/equipment - Tạo thiết bị mới
exports.create = async (req, res) => {
    const {
        department_id, name_ja, name_en, name_vi,
        category, brand, model,
        specs_ja, specs_en, specs_vi,
        quantity, year, country,
        image, images, sort_order, is_active
    } = req.body;

    if (!name_ja) {
        return res.status(400).json({
            success: false,
            message: 'name_ja is required'
        });
    }

    try {
        const sql = `
            INSERT INTO equipment (
                department_id, name_ja, name_en, name_vi,
                category, brand, model,
                specs_ja, specs_en, specs_vi,
                quantity, year, country,
                image, images, sort_order, is_active
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const result = await run(sql, [
            department_id || null, name_ja, name_en || '', name_vi || '',
            category || 'machine', brand || '', model || '',
            specs_ja || '', specs_en || '', specs_vi || '',
            quantity || 1, year || null, country || '',
            image || '', images || '', sort_order || 0, is_active !== undefined ? is_active : 1
        ]);

        res.status(201).json({
            success: true,
            message: 'Equipment created successfully',
            data: { id: result.lastID }
        });
    } catch (err) {
        console.error('Error creating equipment:', err.message);
        res.status(500).json({
            success: false,
            message: 'Error creating equipment'
        });
    }
};

// PUT /api/equipment/:id - Cập nhật thiết bị
exports.update = async (req, res) => {
    const { id } = req.params;
    const {
        department_id, name_ja, name_en, name_vi,
        category, brand, model,
        specs_ja, specs_en, specs_vi,
        quantity, year, country,
        image, images, sort_order, is_active
    } = req.body;

    try {
        // Check if exists
        const existing = await getOne('SELECT id FROM equipment WHERE id = ?', [id]);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: 'Equipment not found'
            });
        }

        const sql = `
            UPDATE equipment SET
                department_id = ?, name_ja = ?, name_en = ?, name_vi = ?,
                category = ?, brand = ?, model = ?,
                specs_ja = ?, specs_en = ?, specs_vi = ?,
                quantity = ?, year = ?, country = ?,
                image = ?, images = ?, sort_order = ?, is_active = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;

        await run(sql, [
            department_id || null, name_ja, name_en || '', name_vi || '',
            category || 'machine', brand || '', model || '',
            specs_ja || '', specs_en || '', specs_vi || '',
            quantity || 1, year || null, country || '',
            image || '', images || '', sort_order || 0, is_active !== undefined ? is_active : 1,
            id
        ]);

        res.json({
            success: true,
            message: 'Equipment updated successfully'
        });
    } catch (err) {
        console.error('Error updating equipment:', err.message);
        res.status(500).json({
            success: false,
            message: 'Error updating equipment'
        });
    }
};

// DELETE /api/equipment/:id - Xóa thiết bị
exports.delete = async (req, res) => {
    const { id } = req.params;

    try {
        const existing = await getOne('SELECT id FROM equipment WHERE id = ?', [id]);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: 'Equipment not found'
            });
        }

        await run('DELETE FROM equipment WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Equipment deleted successfully'
        });
    } catch (err) {
        console.error('Error deleting equipment:', err.message);
        res.status(500).json({
            success: false,
            message: 'Error deleting equipment'
        });
    }
};
