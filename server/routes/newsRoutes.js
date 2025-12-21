/**
 * News API Routes với Authorization
 */

const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { requireAuth, requirePermission } = require('../middleware/auth');

// ==============================================
// PUBLIC Routes
// ==============================================

// GET /api/news - Lấy danh sách tin tức
router.get('/', newsController.getAll);

// GET /api/news/latest - Tin mới nhất
router.get('/latest', newsController.getLatest);

// GET /api/news/:id - Chi tiết tin tức
router.get('/:id', newsController.getById);

// ==============================================
// PROTECTED Routes
// ==============================================

// POST /api/news - Tạo tin tức (editor trở lên)
router.post('/', requireAuth, requirePermission('news', 'create'), newsController.create);

// PUT /api/news/:id - Sửa tin tức (editor trở lên)
router.put('/:id', requireAuth, requirePermission('news', 'update'), newsController.update);

// DELETE /api/news/:id - Xóa tin tức (chỉ admin)
router.delete('/:id', requireAuth, requirePermission('news', 'delete'), newsController.delete);

module.exports = router;
