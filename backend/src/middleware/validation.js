const { validationResult, body, param, query } = require('express-validator');

/**
 * Validation result handler
 * Returns validation errors if any
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

/**
 * Auth validation rules
 */
const authValidation = {
  signup: [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Invalid email format')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  login: [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Invalid email format')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('Password is required')
  ],
  updateProfile: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('email')
      .optional()
      .trim()
      .isEmail().withMessage('Invalid email format')
      .normalizeEmail(),
    body('password')
      .optional()
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ]
};

/**
 * URL validation rules
 */
const urlValidation = {
  create: [
    body('originalUrl')
      .trim()
      .notEmpty().withMessage('Original URL is required')
      .isURL({ require_protocol: true }).withMessage('Invalid URL format'),
    body('customAlias')
      .optional()
      .trim()
      .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Alias can only contain alphanumeric characters, dash, and underscore')
      .isLength({ min: 3, max: 20 }).withMessage('Alias must be between 3 and 20 characters'),
    body('expiryDate')
      .optional()
      .isISO8601().withMessage('Invalid date format'),
    body('metadata.title')
      .optional()
      .trim()
      .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
    body('metadata.description')
      .optional()
      .trim()
      .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters')
  ],
  update: [
    body('originalUrl')
      .optional()
      .trim()
      .isURL({ require_protocol: true }).withMessage('Invalid URL format'),
    body('expiryDate')
      .optional()
      .isISO8601().withMessage('Invalid date format')
  ]
};

/**
 * Short code validation rules
 */
const shortCodeValidation = {
  getByShortCode: [
    param('shortCode')
      .trim()
      .notEmpty().withMessage('Short code is required')
      .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Invalid short code format')
  ]
};

module.exports = {
  handleValidationErrors,
  authValidation,
  urlValidation,
  shortCodeValidation
};
