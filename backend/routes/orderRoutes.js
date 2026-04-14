const express = require('express');
const Order = require('../models/Order');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

const DELIVERY_FEE = 2;

// Place order
router.post('/place', authMiddleware, async (req, res) => {
  try {
    const { items, address, amount } = req.body;
    const order = await Order.create({
      userId: req.userId,
      items,
      address,
      amount: amount + DELIVERY_FEE,
      payment: false,
    });
    // Clear cart after order
    await User.findByIdAndUpdate(req.userId, { cartData: {} });
    res.status(201).json({ success: true, message: 'Order placed', orderId: order._id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get user orders
router.get('/myorders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
