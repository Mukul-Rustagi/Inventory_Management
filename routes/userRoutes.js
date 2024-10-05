const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUserProfile, deleteUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware'); // Middleware to protect routes
const router = express.Router();

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
router.post('/register', registerUser);

// @desc    Login user
// @route   POST /api/users/login
// @access  Public

router.post('/login', loginUser);
// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, getUserProfile);

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, updateUserProfile);

// @desc    Delete user profile
// @route   DELETE /api/users/profile
// @access  Private
router.delete('/profile', protect, deleteUserProfile);

module.exports = router;
