const express = require('express');
const router = express.Router();
const { createProduct, getProducts, updateProduct, deleteProduct } = require('../controllers/productController');
// const upload = require('../middleware/multerMiddleware'); // Import the multer middleware

// Create a new product (with image upload)
router.post('/',  createProduct); // Use multer middleware for single file upload

// Get all products for a specific inventory
router.get('/', getProducts);

// Update a product by ID (with optional image upload)
router.put('/:id', updateProduct); // Use multer middleware for single file upload

// Delete a product by ID
router.delete('/:id', deleteProduct);

module.exports = router;
