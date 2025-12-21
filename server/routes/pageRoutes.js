/**
 * Page Routes - Serve HTML Pages từ public/
 */

const express = require('express');
const router = express.Router();
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '../../public');

// ==============================================
// Routes
// ==============================================

router.get('/', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'index.html')));
router.get('/products', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'products.html')));
router.get('/product/:id', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'product-detail.html')));
router.get('/news', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'news.html')));
router.get('/news/:id', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'news-detail.html')));
router.get('/company', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'company.html')));
router.get('/works', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'works.html')));
router.get('/equipment', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'equipment.html')));
router.get('/contact', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'contact.html')));
router.get('/recruit', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'recruit.html')));
router.get('/thank-you', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'thank-you.html')));
router.get('/3d-tour', (req, res) => res.sendFile(path.join(PUBLIC_DIR, '3d-tour.html')));

// Redirect .html -> clean URL
router.get('/index.html', (req, res) => res.redirect('/'));
router.get('/products.html', (req, res) => res.redirect('/products'));
router.get('/product-detail.html', (req, res) => res.redirect(`/product/${req.query.id || 1}`));
router.get('/news.html', (req, res) => res.redirect('/news'));
router.get('/news-detail.html', (req, res) => res.redirect(`/news/${req.query.id || 1}`));
router.get('/company.html', (req, res) => res.redirect('/company'));
router.get('/works.html', (req, res) => res.redirect('/works'));
router.get('/equipment.html', (req, res) => res.redirect('/equipment'));
router.get('/contact.html', (req, res) => res.redirect('/contact'));
router.get('/recruit.html', (req, res) => res.redirect('/recruit'));
router.get('/thank-you.html', (req, res) => res.redirect('/thank-you'));
router.get('/3d-tour.html', (req, res) => res.redirect('/3d-tour'));

module.exports = router;
