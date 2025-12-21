/**
 * Equipment API Routes
 */

const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');
const { requireAuth, requireEditor, requireAdmin, requirePermission } = require('../middleware/auth');

// ==============================================
// PUBLIC Routes (không cần đăng nhập)
// ==============================================

// GET /api/equipment - Lấy danh sách thiết bị
router.get('/', equipmentController.getAll);

// GET /api/equipment/categories - Lấy danh sách categories
router.get('/categories', equipmentController.getCategories);

// GET /api/equipment/:id - Chi tiết thiết bị
router.get('/:id', equipmentController.getById);

// ==============================================
// PROTECTED Routes (cần đăng nhập + quyền)
// ==============================================

// POST /api/equipment - Tạo thiết bị (editor trở lên)
router.post('/', requireAuth, requireEditor, equipmentController.create);

// PUT /api/equipment/:id - Sửa thiết bị (editor trở lên)
router.put('/:id', requireAuth, requireEditor, equipmentController.update);

// DELETE /api/equipment/:id - Xóa thiết bị (chỉ admin)
router.delete('/:id', requireAuth, requireAdmin, equipmentController.delete);

// ==============================================
// UPLOAD Route
// ==============================================
const multer = require('multer');
const path = require('path');

// Configure multer for equipment images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/uploads/equipment'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'equipment-' + uniqueSuffix + ext);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed'));
    }
});

// POST /api/equipment/upload - Upload hình ảnh
router.post('/upload', requireAuth, requireEditor, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const imageUrl = '/uploads/equipment/' + req.file.filename;
    res.json({
        success: true,
        message: 'Image uploaded successfully',
        url: imageUrl
    });
});

module.exports = router;
