const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Food = require('../models/Food');
const Order = require('../models/Order');
const User = require('../models/User');
const adminAuth = require('../middleware/adminAuth');
const router = express.Router();

// Ensure uploads dir exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// ── Admin Login ──────────────────────────────────────────────
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@tomato.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  if (email !== adminEmail || password !== adminPassword)
    return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
  const token = jwt.sign({ id: 'admin', isAdmin: true }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ success: true, token });
});

// ── Dashboard Stats ──────────────────────────────────────────
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const [totalOrders, totalUsers, totalFoods, orders] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments(),
      Food.countDocuments(),
      Order.find(),
    ]);
    const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
    const pending = orders.filter(o => o.status === 'Pending').length;
    const delivered = orders.filter(o => o.status === 'Delivered').length;
    res.json({ success: true, data: { totalOrders, totalUsers, totalFoods, totalRevenue, pending, delivered } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Food CRUD ────────────────────────────────────────────────
router.get('/foods', adminAuth, async (req, res) => {
  try {
    const foods = await Food.find().sort({ createdAt: -1 });
    res.json({ success: true, data: foods });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/foods', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const image = req.file ? req.file.filename : req.body.image;
    const food = await Food.create({ name, description, price: Number(price), category, image });
    res.status(201).json({ success: true, data: food });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/foods/:id', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const update = { name, description, price: Number(price), category };
    if (req.file) update.image = req.file.filename;
    const food = await Food.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!food) return res.status(404).json({ success: false, message: 'Food not found' });
    res.json({ success: true, data: food });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/foods/:id', adminAuth, async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) return res.status(404).json({ success: false, message: 'Food not found' });
    // Remove uploaded file if exists
    const filePath = path.join(uploadDir, food.image);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.json({ success: true, message: 'Food deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Orders ───────────────────────────────────────────────────
router.get('/orders', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/orders/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Users ────────────────────────────────────────────────────
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
