const express = require('express');
const urlController = require('../controllers/urlController');
const { auth } = require('../middleware/auth');
const { urlValidation, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

/**
 * @route POST /api/urls/shorten
 * @desc Create a new shortened URL
 * @access Private
 */
router.post('/shorten', auth, urlValidation.create, handleValidationErrors, urlController.createShortUrl);

/**
 * @route GET /api/urls
 * @desc Get all URLs for current user
 * @access Private
 */
router.get('/', auth, urlController.getUserUrls);

/**
 * @route GET /api/urls/:id
 * @desc Get single URL
 * @access Private
 */
router.get('/:id', auth, urlController.getUrlById);

/**
 * @route PUT /api/urls/:id
 * @desc Update URL
 * @access Private
 */
router.put('/:id', auth, urlValidation.update, handleValidationErrors, urlController.updateUrl);

/**
 * @route DELETE /api/urls/:id
 * @desc Delete URL
 * @access Private
 */
router.delete('/:id', auth, urlController.deleteUrl);

module.exports = router;
