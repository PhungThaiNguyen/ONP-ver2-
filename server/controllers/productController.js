/**
 * Product Controller - Full version with multilingual support
 */

const { getAll, getOne, run } = require('../config/database');

// GET /api/products
exports.getAll = async (req, res) => {
    try {
        const { material, customer, limit = 50, page = 1 } = req.query;
        const offset = (page - 1) * limit;

        let sql = 'SELECT * FROM products WHERE 1=1';
        const params = [];

        if (material && material !== 'all') {
            sql += ' AND material = ?';
            params.push(material);
        }

        if (customer && customer !== 'all') {
            sql += ' AND customer = ?';
            params.push(customer);
        }

        // Count total
        const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as total');
        const totalResult = await getOne(countSql, params);
        const total = totalResult ? totalResult.total : 0;

        // Add pagination
        sql += ' ORDER BY sort_order ASC, id ASC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), offset);

        const products = await getAll(sql, params);

        res.json({
            success: true,
            data: products,
            pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / limit) }
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ success: false, message: 'Error fetching products' });
    }
};

// GET /api/products/customers - Lấy danh sách khách hàng unique
exports.getCustomers = async (req, res) => {
    try {
        const customers = await getAll(
            "SELECT DISTINCT customer FROM products WHERE customer IS NOT NULL AND customer != '' ORDER BY customer ASC"
        );
        res.json({ success: true, data: customers.map(c => c.customer) });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching customers' });
    }
};

// GET /api/products/featured
exports.getFeatured = async (req, res) => {
    try {
        const { limit = 6 } = req.query;
        const products = await getAll('SELECT * FROM products WHERE is_featured = 1 ORDER BY sort_order ASC LIMIT ?', [parseInt(limit)]);
        res.json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching featured products' });
    }
};

// GET /api/products/:id
exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await getOne('SELECT * FROM products WHERE id = ?', [id]);

        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

        // Get related products (same material, exclude current)
        const related = await getAll(
            'SELECT * FROM products WHERE material = ? AND id != ? ORDER BY RANDOM() LIMIT 4',
            [product.material, id]
        );

        res.json({ success: true, data: product, related });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching product' });
    }
};

// POST /api/products
exports.create = async (req, res) => {
    try {
        const p = req.body;

        if (!p.name_ja) return res.status(400).json({ success: false, message: 'name_ja is required' });

        const result = await run(`
            INSERT INTO products (
                name_ja, name_en, name_vi, material,
                material_ja, material_en, material_vi,
                size, tolerance,
                surface_ja, surface_en, surface_vi,
                process_ja, process_en, process_vi,
                customer, image, is_featured, sort_order
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            p.name_ja, p.name_en, p.name_vi, p.material || 'brass',
            p.material_ja, p.material_en, p.material_vi,
            p.size, p.tolerance,
            p.surface_ja, p.surface_en, p.surface_vi,
            p.process_ja, p.process_en, p.process_vi,
            p.customer, p.image, p.is_featured || 0, p.sort_order || 0
        ]);

        const newProduct = await getOne('SELECT * FROM products WHERE id = ?', [result.lastInsertRowid]);
        res.status(201).json({ success: true, message: 'Product created', data: newProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating product', error: error.message });
    }
};

// PUT /api/products/:id
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const existing = await getOne('SELECT * FROM products WHERE id = ?', [id]);
        if (!existing) return res.status(404).json({ success: false, message: 'Product not found' });

        const fields = [], values = [];
        const allowedFields = [
            'name_ja', 'name_en', 'name_vi', 'material',
            'material_ja', 'material_en', 'material_vi',
            'size', 'tolerance',
            'surface_ja', 'surface_en', 'surface_vi',
            'process_ja', 'process_en', 'process_vi',
            'customer', 'image', 'is_featured', 'sort_order'
        ];

        for (const field of allowedFields) {
            if (updates[field] !== undefined) {
                fields.push(`${field} = ?`);
                values.push(updates[field]);
            }
        }

        if (fields.length === 0) return res.status(400).json({ success: false, message: 'No valid fields' });

        fields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(id);

        await run(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`, values);
        const updated = await getOne('SELECT * FROM products WHERE id = ?', [id]);
        res.json({ success: true, message: 'Product updated', data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating product' });
    }
};

// DELETE /api/products/:id
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await getOne('SELECT * FROM products WHERE id = ?', [id]);
        if (!existing) return res.status(404).json({ success: false, message: 'Product not found' });

        await run('DELETE FROM products WHERE id = ?', [id]);
        res.json({ success: true, message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting product' });
    }
};
