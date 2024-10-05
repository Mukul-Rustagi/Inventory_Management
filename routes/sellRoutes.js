const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  createSell,
  getAllSells,
  getSellByProduct
} = require('../controllers/sellController');

const router = express.Router();

router.post('/', protect, createSell); // Create a new sale
router.get('/', protect, getAllSells); // Get all sales with pagination and filtering
router.get('/product/:productId', protect, getSellByProduct); // Get sales by product with pagination and filtering

module.exports = router;
