/**
 * Auth Controller - Login, Register, Logout
 */

const crypto = require('crypto');
const { getAll, getOne, run } = require('../config/database');

// Hash password with SHA256
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// Generate simple token
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

// POST /api/auth/register
exports.register = async (req, res) => {
    try {
        const { fullname, username, email, password, role } = req.body;

        // Validation
        if (!username || !password || !email) {
            return res.status(400).json({ success: false, message: 'Username, email, and password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
        }

        // Check if username exists
        const existingUser = await getOne('SELECT id FROM users WHERE username = ?', [username]);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Username already exists' });
        }

        // Check if email exists
        const existingEmail = await getOne('SELECT id FROM users WHERE email = ?', [email]);
        if (existingEmail) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        // Hash password
        const hashedPassword = hashPassword(password);

        // Insert user - Mặc định role là 'viewer' (chỉ xem)
        const result = await run(`
            INSERT INTO users (fullname, username, email, password, role)
            VALUES (?, ?, ?, ?, ?)
        `, [fullname || username, username, email, hashedPassword, 'viewer']);

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            userId: result.lastInsertRowid
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ success: false, message: 'Registration failed' });
    }
};

// POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username and password are required' });
        }

        // Find user
        const user = await getOne('SELECT * FROM users WHERE username = ? OR email = ?', [username, username]);

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        // Check password
        const hashedPassword = hashPassword(password);
        if (user.password !== hashedPassword) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        // Check if user is active
        if (!user.is_active) {
            return res.status(401).json({ success: false, message: 'Account is disabled' });
        }

        // Generate token
        const token = generateToken();

        // Update last login and token
        await run('UPDATE users SET token = ?, last_login = CURRENT_TIMESTAMP WHERE id = ?', [token, user.id]);

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                fullname: user.fullname,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Login failed' });
    }
};

// POST /api/auth/logout
exports.logout = async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (token) {
            await run('UPDATE users SET token = NULL WHERE token = ?', [token]);
        }

        res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Logout failed' });
    }
};

// GET /api/auth/me
exports.me = async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        const user = await getOne('SELECT id, fullname, username, email, role FROM users WHERE token = ?', [token]);

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }

        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching user' });
    }
};

// Middleware to check auth
exports.requireAuth = async (req, res, next) => {
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
