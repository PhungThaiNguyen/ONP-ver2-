/**
 * Auth Middleware - Authentication & Authorization
 */

const { getOne } = require('../config/database');
const { hasPermission } = require('../controllers/userController');

// Middleware: Yêu cầu đăng nhập
const requireAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }

        const user = await getOne('SELECT * FROM users WHERE token = ? AND is_active = 1', [token]);

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid or expired token' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ success: false, message: 'Authentication error' });
    }
};

// Middleware: Yêu cầu quyền Admin
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    next();
};

// Middleware: Kiểm tra permission cụ thể
const requirePermission = (resource, action) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }

        if (!hasPermission(req.user.role, resource, action)) {
            return res.status(403).json({
                success: false,
                message: `Permission denied: ${action} ${resource}`
            });
        }

        next();
    };
};

// Middleware: Chỉ editor trở lên (editor + admin)
const requireEditor = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (req.user.role !== 'admin' && req.user.role !== 'editor') {
        return res.status(403).json({ success: false, message: 'Editor access required' });
    }

    next();
};

module.exports = {
    requireAuth,
    requireAdmin,
    requireEditor,
    requirePermission
};
