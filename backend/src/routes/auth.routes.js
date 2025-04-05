const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validateRegister, validateLogin } = require('../middleware/validation');

// Register a new user
router.post('/register', validateRegister, authController.register);

// Login user
router.post('/login', validateLogin, authController.login);

// Get current user (protected route)
router.get('/me', authController.protect, authController.getCurrentUser);

// Logout user
router.post('/logout', authController.logout);

module.exports = router; 