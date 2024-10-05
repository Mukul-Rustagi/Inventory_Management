const mongoose = require('mongoose');

const alertSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  emailSent: {
    type: Boolean,
    default: false, // Track whether email has been sent
  },
  alertType: {
    type: String, // e.g., 'low stock', 'expiry'
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Alert = mongoose.model('Alert', alertSchema);

module.exports = Alert;
