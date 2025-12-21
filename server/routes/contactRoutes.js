const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { db, getAll, getOne, run } = require('../config/database');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// Tạo thư mục uploads nếu chưa có
const uploadDir = path.join(__dirname, '../../public/uploads/contacts');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Hàm chuẩn hoá tên file (loại bỏ ký tự đặc biệt, dấu)
function sanitizeFileName(name) {
    return name
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Bỏ dấu
        .replace(/[^a-zA-Z0-9]/g, '_') // Thay ký tự đặc biệt bằng _
        .replace(/_+/g, '_') // Loại bỏ _ liên tiếp
        .substring(0, 30); // Giới hạn 30 ký tự
}

// Cấu hình multer - lưu file tạm với tên ngẫu nhiên
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Tạo tên tạm, sẽ đổi lại sau khi có thông tin form
        const tempName = 'temp_' + Date.now() + '_' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        // Lưu tên file gốc để dùng sau
        file.originalNameClean = file.originalname;
        cb(null, tempName);
    }
});

const fileFilter = (req, file, cb) => {
    // Chỉ cho phép file PDF
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max per file
        files: 5 // Max 5 files
    }
});

// Submit contact form với file upload (Public)
router.post('/', upload.array('attachments', 5), async (req, res) => {
    const { name, email, phone, company, subject, message } = req.body;

    // Validation
    if (!name || !email || !message) {
        // Xóa file đã upload nếu validation thất bại
        if (req.files) {
            req.files.forEach(f => {
                fs.unlinkSync(path.join(uploadDir, f.filename));
            });
        }
        return res.status(400).json({
            success: false,
            message: 'Name, email and message are required'
        });
    }

    try {
        // Đổi tên file với format chuẩn: TenNguoiGui_NgayThang_TenFileGoc.pdf
        let attachments = '';
        if (req.files && req.files.length > 0) {
            const now = new Date();
            const dateStr = now.getFullYear() +
                String(now.getMonth() + 1).padStart(2, '0') +
                String(now.getDate()).padStart(2, '0') + '_' +
                String(now.getHours()).padStart(2, '0') +
                String(now.getMinutes()).padStart(2, '0');

            const senderName = sanitizeFileName(name);

            const renamedFiles = req.files.map((f, index) => {
                const originalName = sanitizeFileName(path.basename(f.originalNameClean || f.originalname, '.pdf'));
                const newFileName = `${senderName}_${dateStr}_${originalName}.pdf`;
                const oldPath = path.join(uploadDir, f.filename);
                const newPath = path.join(uploadDir, newFileName);

                // Đổi tên file
                fs.renameSync(oldPath, newPath);

                return '/uploads/contacts/' + newFileName;
            });

            attachments = renamedFiles.join(',');
        }

        // Lưu với thời gian local (format: YYYY-MM-DD HH:MM:SS)
        const now = new Date();
        const createdAt = now.getFullYear() + '-' +
            String(now.getMonth() + 1).padStart(2, '0') + '-' +
            String(now.getDate()).padStart(2, '0') + ' ' +
            String(now.getHours()).padStart(2, '0') + ':' +
            String(now.getMinutes()).padStart(2, '0') + ':' +
            String(now.getSeconds()).padStart(2, '0');

        const sql = `INSERT INTO contacts (name, email, phone, company, subject, message, attachments, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const result = await run(sql, [name, email, phone || '', company || '', subject || '', message, attachments, createdAt]);

        res.json({
            success: true,
            message: 'Contact submitted successfully',
            data: { id: result.lastInsertRowid }
        });
    } catch (err) {
        console.error('Error saving contact:', err.message);
        res.status(500).json({
            success: false,
            message: 'Error saving contact'
        });
    }
});

// Get all contacts (Public - ai cũng xem được)
router.get('/', async (req, res) => {
    try {
        const sql = `SELECT * FROM contacts ORDER BY created_at DESC`;
        const rows = await getAll(sql);

        res.json({
            success: true,
            data: rows
        });
    } catch (err) {
        console.error('Error fetching contacts:', err.message);
        res.status(500).json({
            success: false,
            message: 'Error fetching contacts'
        });
    }
});

// Get single contact (Public - ai cũng xem chi tiết được)
router.get('/:id', async (req, res) => {
    try {
        const sql = `SELECT * FROM contacts WHERE id = ?`;
        const row = await getOne(sql, [req.params.id]);

        if (!row) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        // Mark as read
        await run(`UPDATE contacts SET is_read = 1 WHERE id = ?`, [req.params.id]);

        res.json({
            success: true,
            data: row
        });
    } catch (err) {
        console.error('Error fetching contact:', err.message);
        res.status(500).json({
            success: false,
            message: 'Error fetching contact'
        });
    }
});

// Delete contact (Admin only - chỉ admin mới xóa được)
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        // Lấy thông tin contact để xóa file đính kèm
        const contact = await getOne(`SELECT attachments FROM contacts WHERE id = ?`, [req.params.id]);

        if (contact && contact.attachments) {
            const files = contact.attachments.split(',');
            files.forEach(filePath => {
                const fullPath = path.join(__dirname, '../../public', filePath);
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            });
        }

        const sql = `DELETE FROM contacts WHERE id = ?`;
        await run(sql, [req.params.id]);

        res.json({
            success: true,
            message: 'Contact deleted'
        });
    } catch (err) {
        console.error('Error deleting contact:', err.message);
        res.status(500).json({
            success: false,
            message: 'Error deleting contact'
        });
    }
});

module.exports = router;
