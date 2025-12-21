/**
 * User Routes với Authorization Middleware
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth, requireAdmin, requirePermission } = require('../middleware/auth');

// GET /api/users - Lấy danh sách users (cần login)
router.get('/', requireAuth, userController.getAll);

// GET /api/users/permissions - Lấy permissions của user hiện tại
router.get('/permissions', requireAuth, userController.getPermissions);

// GET /api/users/:id - Lấy user theo ID
router.get('/:id', requireAuth, userController.getById);

// POST /api/users - Tạo user mới (chỉ admin)
router.post('/', requireAuth, requireAdmin, userController.create);

// PUT /api/users/:id - Cập nhật user (chỉ admin)
router.put('/:id', requireAuth, requireAdmin, userController.update);

// DELETE /api/users/:id - Xóa user (chỉ admin)
router.delete('/:id', requireAuth, requireAdmin, userController.delete);

module.exports = router;
