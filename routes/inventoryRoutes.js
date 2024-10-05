const express = require('express');
const {
  createInventory,
  getUserInventories,
} = require('../controllers/inventoryController'); // Import the inventory controller
const { protect } = require('../middleware/authMiddleware'); // Protect middleware

const router = express.Router();

// Route to create a new inventory
router.post('/', protect, createInventory); // Protected route

// Route to get all inventories for the logged-in user
router.get('/', protect, getUserInventories); // Protected route

module.exports = router;
