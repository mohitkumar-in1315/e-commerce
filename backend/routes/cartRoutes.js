const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get cart
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json({ success: true, cartData: user.cartData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Add to cart
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { itemId } = req.body;
    const user = await User.findById(req.userId);
    const cart = { ...user.cartData };
    cart[itemId] = (cart[itemId] || 0) + 1;
    await User.findByIdAndUpdate(req.userId, { cartData: cart });
    res.json({ success: true, message: 'Added to cart' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Remove from cart
router.post('/remove', authMiddleware, async (req, res) => {
  try {
    const { itemId } = req.body;
    const user = await User.findById(req.userId);
    const cart = { ...user.cartData };
    if (cart[itemId] > 1) cart[itemId] -= 1;
    else delete cart[itemId];
    await User.findByIdAndUpdate(req.userId, { cartData: cart });
    res.json({ success: true, message: 'Removed from cart' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
