/**
 * ==============================================
 * O.N.Precision Server - Express + SQLite
 * ==============================================
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const pageRoutes = require('./routes/pageRoutes');
const productRoutes = require('./routes/productRoutes');
const newsRoutes = require('./routes/newsRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const contactRoutes = require('./routes/contactRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const materialRoutes = require('./routes/materialRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ==============================================
// Đường dẫn thư mục public
// ==============================================
const PUBLIC_DIR = path.join(__dirname, '../public');

// ==============================================
// Middleware
// ==============================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files từ thư mục public
app.use(express.static(PUBLIC_DIR));

// ==============================================
// API Routes
// ==============================================
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/materials', materialRoutes);

// ==============================================
// Page Routes
// ==============================================
app.use('/admin', adminRoutes);
app.use('/', pageRoutes);

// ==============================================
// Error Handling
// ==============================================
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(PUBLIC_DIR, '404.html'));
});

app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    });
});

// ==============================================
// Start Server
// ==============================================
app.listen(PORT, () => {
    console.log('==============================================');
    console.log('   O.N.Precision Server Started');
    console.log('==============================================');
    console.log(`   🚀 Server: http://localhost:${PORT}`);
    console.log(`   📁 Public: ${PUBLIC_DIR}`);
    console.log(`   🔌 API: /api/products, /api/news`);
    console.log('==============================================');
});

module.exports = app;
