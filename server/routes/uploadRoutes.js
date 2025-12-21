/**
 * Upload Routes - Xử lý upload file hình ảnh
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { requireAuth } = require('../middleware/auth');

// Base upload directory
const BASE_UPLOAD_DIR = path.join(__dirname, '../../public/assets/images');

// Ensure directories exist
const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// Create common directories
['uploads', 'departments', 'products', 'equipment', 'news'].forEach(folder => {
    ensureDir(path.join(BASE_UPLOAD_DIR, folder));
});

// Dynamic storage based on type
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Get type from body or query or default to uploads
        const type = req.body.type || req.query.type || 'uploads';
        const validTypes = ['uploads', 'departments', 'products', 'equipment', 'news'];
        const folder = validTypes.includes(type) ? type : 'uploads';
        const uploadDir = path.join(BASE_UPLOAD_DIR, folder);
        ensureDir(uploadDir);
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Create unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname).toLowerCase();
        const type = req.body.type || req.query.type || 'img';
        cb(null, type + '-' + uniqueSuffix + ext);
    }
});

// File filter - only allow images
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (JPG, PNG, GIF, WebP)'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max per file
    }
});

// POST /api/upload - Upload single image (backward compatible)
router.post('/', requireAuth, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const type = req.body.type || 'uploads';
        const imageUrl = '/assets/images/' + type + '/' + req.file.filename;

        res.json({
            success: true,
            message: 'File uploaded successfully',
            url: imageUrl,
            data: {
                filename: req.file.filename,
                url: imageUrl,
                size: req.file.size
            }
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Upload failed'
        });
    }
});

// POST /api/upload/image - Same as above but with different path
router.post('/image', requireAuth, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const type = req.body.type || 'uploads';
        const imageUrl = '/assets/images/' + type + '/' + req.file.filename;

        res.json({
            success: true,
            message: 'File uploaded successfully',
            url: imageUrl,
            data: {
                filename: req.file.filename,
                url: imageUrl,
                size: req.file.size
            }
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Upload failed'
        });
    }
});

// POST /api/upload/multiple - Upload multiple images
router.post('/multiple', requireAuth, upload.array('images', 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files uploaded'
            });
        }

        const type = req.body.type || 'uploads';
        const uploadedFiles = req.files.map(file => {
            const imageUrl = '/assets/images/' + type + '/' + file.filename;
            return {
                filename: file.filename,
                url: imageUrl,
                size: file.size
            };
        });

        res.json({
            success: true,
            message: `${uploadedFiles.length} files uploaded successfully`,
            urls: uploadedFiles.map(f => f.url),
            data: uploadedFiles
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Upload failed'
        });
    }
});

// DELETE /api/upload - Delete an image
router.delete('/', requireAuth, (req, res) => {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({
                success: false,
                message: 'Image URL required'
            });
        }

        // Convert URL to file path
        const relativePath = url.replace(/^\//, '');
        const filePath = path.join(__dirname, '../../public', relativePath);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            res.json({
                success: true,
                message: 'Image deleted successfully'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({
            success: false,
            message: 'Delete failed'
        });
    }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Maximum size is 5MB'
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Too many files. Maximum is 10 files'
            });
        }
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

    next();
});

module.exports = router;

