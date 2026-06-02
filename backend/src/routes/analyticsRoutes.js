const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const { auth, authOptional } = require('../middleware/auth');

const router = express.Router();

/**
 * @route GET /api/analytics/:urlId
 * @desc Get analytics for a URL
 * @access Private
 */
/**
 * @route GET /api/analytics/dashboard/summary
 * @desc Get dashboard summary
 * @access Private
 */
router.get('/dashboard/summary', auth, analyticsController.getDashboardSummary);

/**
 * @route GET /api/analytics/:urlId
 * @desc Get analytics for a URL
 * @access Private
 */
router.get('/:urlId', auth, analyticsController.getUrlAnalytics);

module.exports = router;
