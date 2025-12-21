/**
 * ==============================================
 * Admin Routes - Định tuyến URL cho trang Admin
 * ==============================================
 * 
 * Các URL được clean (không có .html):
 * /admin           -> Dashboard
 * /admin/login     -> Đăng nhập
 * /admin/register  -> Đăng ký
 * /admin/products  -> Quản lý sản phẩm
 * /admin/news      -> Quản lý tin tức
 * /admin/users     -> Quản lý người dùng
 * /admin/contacts  -> Quản lý liên hệ
 */

const express = require('express');
const router = express.Router();
const path = require('path');

const ADMIN_DIR = path.join(__dirname, '../../public/admin');

// ==============================================
// Clean URL Routes - Trang Admin
// ==============================================

// Dashboard
router.get('/', (req, res) => res.sendFile(path.join(ADMIN_DIR, 'index.html')));

// Authentication
router.get('/login', (req, res) => res.sendFile(path.join(ADMIN_DIR, 'login.html')));
router.get('/register', (req, res) => res.sendFile(path.join(ADMIN_DIR, 'register.html')));

// Management Pages
router.get('/products', (req, res) => res.sendFile(path.join(ADMIN_DIR, 'products.html')));
router.get('/news', (req, res) => res.sendFile(path.join(ADMIN_DIR, 'news.html')));
router.get('/users', (req, res) => res.sendFile(path.join(ADMIN_DIR, 'users.html')));
router.get('/contacts', (req, res) => res.sendFile(path.join(ADMIN_DIR, 'contacts.html')));

// ==============================================
// Redirect .html -> Clean URL
// ==============================================

router.get('/index.html', (req, res) => res.redirect('/admin'));
router.get('/login.html', (req, res) => res.redirect('/admin/login'));
router.get('/register.html', (req, res) => res.redirect('/admin/register'));
router.get('/products.html', (req, res) => res.redirect('/admin/products'));
router.get('/news.html', (req, res) => res.redirect('/admin/news'));
router.get('/users.html', (req, res) => res.redirect('/admin/users'));
router.get('/contacts.html', (req, res) => res.redirect('/admin/contacts'));

module.exports = router;
