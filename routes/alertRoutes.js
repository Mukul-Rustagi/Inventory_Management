const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  createAlert,
  getAllAlerts,
  getAlertsByProduct,
} = require('../controllers/alertController');

const router = express.Router();

router.post('/', protect, createAlert); // Create new alert with email notification
router.get('/', protect, getAllAlerts); // Get all alerts
router.get('/product/:productId', protect, getAlertsByProduct); // Get alerts by product

module.exports = router;
