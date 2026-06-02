const express = require('express');
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { authValidation, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

/**
 * @route POST /api/auth/signup
 * @desc Register a new user
 * @access Public
 */
router.post('/signup', authValidation.signup, handleValidationErrors, authController.signup);

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
router.post('/login', authValidation.login, handleValidationErrors, authController.login);

/**
 * @route GET /api/auth/me
 * @desc Get current user
 * @access Private
 */
router.get('/me', auth, authController.me);

/**
 * @route PUT /api/auth/me
 * @desc Update current user profile
 * @access Private
 */
router.put('/me', auth, authValidation.updateProfile, handleValidationErrors, authController.updateProfile);

/**
 * @route POST /api/auth/logout
 * @desc Logout user
 * @access Private
 */
router.post('/logout', auth, authController.logout);

module.exports = router;
