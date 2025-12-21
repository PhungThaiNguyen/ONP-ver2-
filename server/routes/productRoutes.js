/**
 * Product API Routes với Authorization
 */

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { requireAuth, requireEditor, requireAdmin, requirePermission } = require('../middleware/auth');

// ==============================================
// PUBLIC Routes (không cần đăng nhập)
// ==============================================

// GET /api/products - Lấy danh sách sản phẩm
router.get('/', productController.getAll);

// GET /api/products/featured - Lấy sản phẩm nổi bật
router.get('/featured', productController.getFeatured);

// GET /api/products/customers - Lấy danh sách khách hàng unique
router.get('/customers', productController.getCustomers);

// GET /api/products/:id - Chi tiết sản phẩm
router.get('/:id', productController.getById);

// ==============================================
// PROTECTED Routes (cần đăng nhập + quyền)
// ==============================================

// POST /api/products - Tạo sản phẩm (editor trở lên)
router.post('/', requireAuth, requirePermission('products', 'create'), productController.create);

// PUT /api/products/:id - Sửa sản phẩm (editor trở lên)
router.put('/:id', requireAuth, requirePermission('products', 'update'), productController.update);

// DELETE /api/products/:id - Xóa sản phẩm (chỉ admin)
router.delete('/:id', requireAuth, requirePermission('products', 'delete'), productController.delete);

module.exports = router;
