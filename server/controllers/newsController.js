/**
 * News Controller - Full version with multilingual support
 */

const { getAll, getOne, run } = require('../config/database');

// GET /api/news
exports.getAll = async (req, res) => {
    try {
        const { category, limit = 20, page = 1 } = req.query;
        const offset = (page - 1) * limit;

        let sql = 'SELECT * FROM news WHERE is_published = 1';
        const params = [];

        if (category) {
            sql += ' AND category = ?';
            params.push(category);
        }

        const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as total');
        const totalResult = await getOne(countSql, params);
        const total = totalResult ? totalResult.total : 0;

        sql += ' ORDER BY published_at DESC, id DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), offset);

        const news = await getAll(sql, params);

        res.json({
            success: true,
            data: news,
            pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / limit) }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching news' });
    }
};

// GET /api/news/latest
exports.getLatest = async (req, res) => {
    try {
        const { limit = 3 } = req.query;
        const news = await getAll('SELECT * FROM news WHERE is_published = 1 ORDER BY published_at DESC LIMIT ?', [parseInt(limit)]);
        res.json({ success: true, data: news });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching latest news' });
    }
};

// GET /api/news/:id
exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const news = await getOne('SELECT * FROM news WHERE id = ? AND is_published = 1', [id]);

        if (!news) return res.status(404).json({ success: false, message: 'News not found' });

        // Get prev/next articles
        const prevNews = await getOne(
            'SELECT id, title_ja, title_en, title_vi FROM news WHERE published_at < ? AND is_published = 1 ORDER BY published_at DESC LIMIT 1',
            [news.published_at]
        );

        const nextNews = await getOne(
            'SELECT id, title_ja, title_en, title_vi FROM news WHERE published_at > ? AND is_published = 1 ORDER BY published_at ASC LIMIT 1',
            [news.published_at]
        );

        // Get related news
        const related = await getAll(
            'SELECT id, title_ja, title_en, title_vi, excerpt_ja, excerpt_en, excerpt_vi, date_ja, date_en, date_vi, published_at, image FROM news WHERE id != ? AND is_published = 1 ORDER BY RANDOM() LIMIT 3',
            [id]
        );

        res.json({ success: true, data: news, prev: prevNews, next: nextNews, related });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching news' });
    }
};

// POST /api/news
exports.create = async (req, res) => {
    try {
        const n = req.body;

        if (!n.title_ja) return res.status(400).json({ success: false, message: 'title_ja is required' });

        const result = await run(`
            INSERT INTO news (
                title_ja, title_en, title_vi,
                date_ja, date_en, date_vi,
                excerpt_ja, excerpt_en, excerpt_vi,
                content_ja, content_en, content_vi,
                category, image, published_at, is_published
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            n.title_ja, n.title_en, n.title_vi,
            n.date_ja, n.date_en, n.date_vi,
            n.excerpt_ja, n.excerpt_en, n.excerpt_vi,
            n.content_ja, n.content_en, n.content_vi,
            n.category || 'info', n.image, n.published_at || new Date().toISOString().split('T')[0], n.is_published !== undefined ? n.is_published : 1
        ]);

        const newNews = await getOne('SELECT * FROM news WHERE id = ?', [result.lastInsertRowid]);
        res.status(201).json({ success: true, message: 'News created', data: newNews });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating news', error: error.message });
    }
};

// PUT /api/news/:id
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const existing = await getOne('SELECT * FROM news WHERE id = ?', [id]);
        if (!existing) return res.status(404).json({ success: false, message: 'News not found' });

        const fields = [], values = [];
        const allowedFields = [
            'title_ja', 'title_en', 'title_vi',
            'date_ja', 'date_en', 'date_vi',
            'excerpt_ja', 'excerpt_en', 'excerpt_vi',
            'content_ja', 'content_en', 'content_vi',
            'category', 'image', 'published_at', 'is_published'
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

        await run(`UPDATE news SET ${fields.join(', ')} WHERE id = ?`, values);
        const updated = await getOne('SELECT * FROM news WHERE id = ?', [id]);
        res.json({ success: true, message: 'News updated', data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating news' });
    }
};

// DELETE /api/news/:id
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await getOne('SELECT * FROM news WHERE id = ?', [id]);
        if (!existing) return res.status(404).json({ success: false, message: 'News not found' });

        await run('DELETE FROM news WHERE id = ?', [id]);
        res.json({ success: true, message: 'News deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting news' });
    }
};
