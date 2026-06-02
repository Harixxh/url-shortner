const URL = require('../models/URL');
const { asyncHandler } = require('../middleware/errorHandler');
const { generateUniqueShortCode, isValidAlias, isAliasAvailable } = require('../utils/shortCode');
const { normalizeUrl, isUrlBlocked } = require('../utils/urlValidator');
const QRCode = require('qrcode');
const constants = require('../config/constants');

/**
 * @route POST /api/urls/shorten
 * @desc Create a new shortened URL
 * @access Private
 */
const createShortUrl = asyncHandler(async (req, res) => {
  const { originalUrl, customAlias, expiryDate, metadata } = req.body;

  // Validate and normalize URL
  const normalized = normalizeUrl(originalUrl);
  if (isUrlBlocked(normalized)) {
    return res.status(400).json({
      success: false,
      message: 'This URL is not allowed'
    });
  }

  // Check custom alias if provided
  if (customAlias) {
    if (!isValidAlias(customAlias)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid alias format'
      });
    }

    const aliasAvailable = await isAliasAvailable(customAlias);
    if (!aliasAvailable) {
      return res.status(409).json({
        success: false,
        message: 'Alias already taken'
      });
    }
  }

  // Generate unique short code
  const shortCode = await generateUniqueShortCode();

  // Generate QR code
  const shortUrl = `${constants.SHORT_DOMAIN}/${shortCode}`;
  const qrCodeUrl = await QRCode.toDataURL(shortUrl, {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    width: parseInt(constants.QR_CODE_SIZE, 10),
    margin: 1
  });

  // Create URL document
  const urlDoc = new URL({
    userId: req.user._id,
    originalUrl: normalized,
    shortCode,
    customAlias,
    qrCodeUrl,
    expiryDate: expiryDate ? new Date(expiryDate) : undefined,
    metadata
  });

  await urlDoc.save();

  res.status(201).json({
    success: true,
    message: 'Short URL created successfully',
    data: {
      _id: urlDoc._id,
      originalUrl: urlDoc.originalUrl,
      shortCode: urlDoc.shortCode,
      customAlias: urlDoc.customAlias,
      shortUrl,
      qrCodeUrl: urlDoc.qrCodeUrl,
      expiryDate: urlDoc.expiryDate,
      createdAt: urlDoc.createdAt
    }
  });
});

/**
 * @route GET /api/urls
 * @desc Get all shortened URLs for current user
 * @access Private
 */
const getUserUrls = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, sortBy = 'createdAt' } = req.query;
  const skip = (page - 1) * limit;

  const urls = await URL.find({ userId: req.user._id, isActive: true })
    .sort({ [sortBy]: -1 })
    .skip(skip)
    .limit(parseInt(limit, 10));

  const total = await URL.countDocuments({ userId: req.user._id, isActive: true });

  const formattedUrls = urls.map((url) => ({
    _id: url._id,
    originalUrl: url.originalUrl,
    shortCode: url.shortCode,
    customAlias: url.customAlias,
    shortUrl: url.customAlias ? `${constants.SHORT_DOMAIN}/${url.customAlias}` : `${constants.SHORT_DOMAIN}/${url.shortCode}`,
    clickCount: url.clickCount,
    lastClickedAt: url.lastClickedAt,
    qrCodeUrl: url.qrCodeUrl,
    expiryDate: url.expiryDate,
    createdAt: url.createdAt
  }));

  res.status(200).json({
    success: true,
    data: {
      urls: formattedUrls,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: urls.length,
        totalCount: total
      }
    }
  });
});

/**
 * @route GET /api/urls/:id
 * @desc Get single URL details
 * @access Private
 */
const getUrlById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const url = await URL.findById(id);
  if (!url) {
    return res.status(404).json({
      success: false,
      message: 'URL not found'
    });
  }

  // Check ownership
  if (url.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized'
    });
  }

  res.status(200).json({
    success: true,
    data: {
      _id: url._id,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      customAlias: url.customAlias,
      shortUrl: url.customAlias ? `${constants.SHORT_DOMAIN}/${url.customAlias}` : `${constants.SHORT_DOMAIN}/${url.shortCode}`,
      clickCount: url.clickCount,
      lastClickedAt: url.lastClickedAt,
      qrCodeUrl: url.qrCodeUrl,
      expiryDate: url.expiryDate,
      createdAt: url.createdAt
    }
  });
});

/**
 * @route PUT /api/urls/:id
 * @desc Update URL (destination URL)
 * @access Private
 */
const updateUrl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { originalUrl, expiryDate } = req.body;

  let url = await URL.findById(id);
  if (!url) {
    return res.status(404).json({
      success: false,
      message: 'URL not found'
    });
  }

  // Check ownership
  if (url.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized'
    });
  }

  // Update fields
  if (originalUrl) {
    const normalized = normalizeUrl(originalUrl);
    if (isUrlBlocked(normalized)) {
      return res.status(400).json({
        success: false,
        message: 'This URL is not allowed'
      });
    }
    url.originalUrl = normalized;
  }

  if (expiryDate) {
    url.expiryDate = new Date(expiryDate);
  }

  url.updatedAt = new Date();
  await url.save();

  res.status(200).json({
    success: true,
    message: 'URL updated successfully',
    data: {
      _id: url._id,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      expiryDate: url.expiryDate,
      updatedAt: url.updatedAt
    }
  });
});

/**
 * @route DELETE /api/urls/:id
 * @desc Delete URL (soft delete)
 * @access Private
 */
const deleteUrl = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let url = await URL.findById(id);
  if (!url) {
    return res.status(404).json({
      success: false,
      message: 'URL not found'
    });
  }

  // Check ownership
  if (url.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized'
    });
  }

  // Soft delete
  url.isActive = false;
  await url.save();

  res.status(200).json({
    success: true,
    message: 'URL deleted successfully'
  });
});

module.exports = {
  createShortUrl,
  getUserUrls,
  getUrlById,
  updateUrl,
  deleteUrl
};
