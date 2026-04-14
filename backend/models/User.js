const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  cartData: { type: Object, default: {} },
}, { timestamps: true, minimize: false });

module.exports = mongoose.model('User', userSchema);
