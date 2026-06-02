const mongoose = require('mongoose');
const URL = require('../models/URL');
const Visit = require('../models/Visit');
const { asyncHandler } = require('../middleware/errorHandler');
const { parseUserAgent, getGeolocation, hashIp, getClientIp } = require('../utils/analytics');
const constants = require('../config/constants');

/**
 * @route GET /s/:shortCode
 * @desc Redirect to original URL and track visit
 * @access Public
 */
const redirectToUrl = asyncHandler(async (req, res) => {
  const { shortCode } = req.params;

  // Find URL by shortCode or customAlias
  const url = await URL.findOne({
    $or: [
      { shortCode },
      { customAlias: shortCode }
    ],
    isActive: true
  });

  if (!url) {
    return res.status(404).json({
      success: false,
      message: 'Short URL not found'
    });
  }

  // Check if expired
  const expired = url.expiryDate ? new Date(url.expiryDate) < new Date() : false;
  if (typeof url.isExpired === 'function' ? url.isExpired() : expired) {
    return res.status(410).json({
      success: false,
      message: 'URL has expired'
    });
  }

  // Track visit
  try {
    const userAgent = req.headers['user-agent'] || '';
    let { browser, device, os } = parseUserAgent(userAgent);
    // Normalize browser/device to allowed enum values to avoid validation errors
    const allowedBrowsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera', 'IE', 'Mobile Safari', 'Chrome Mobile', 'Samsung Internet', 'Unknown'];
    const allowedDevices = ['Desktop', 'Tablet', 'Mobile', 'Unknown'];
    if (!allowedBrowsers.includes(browser)) browser = 'Unknown';
    if (!allowedDevices.includes(device)) device = 'Unknown';
    const clientIp = getClientIp(req);
    const { country, city } = getGeolocation(clientIp);
    const referrer = req.headers.referer || null;

    // Create visit document
    await Visit.create({
      urlId: url._id,
      browser,
      device,
      os,
      country,
      city,
      ipHash: hashIp(clientIp),
      referrer,
      userAgent
    });

    // Update click count and last clicked time (atomic)
    await URL.findByIdAndUpdate(
      url._id,
      {
        $inc: { clickCount: 1 },
        $set: { lastClickedAt: new Date() }
      },
      { new: true }
    );
  } catch (error) {
    console.error('Error tracking visit:', error);
    // Don't fail redirect if tracking fails
  }

  // Prevent browser redirect caching so every click hits the backend
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.redirect(302, url.originalUrl);
});

/**
 * @route GET /api/analytics/:urlId
 * @desc Get analytics for a shortened URL
 * @access Private
 */
const getUrlAnalytics = asyncHandler(async (req, res) => {
  const { urlId } = req.params;
  const { days = 7 } = req.query;

  // Get URL and check ownership
  const url = await URL.findById(urlId);
  if (!url) {
    return res.status(404).json({
      success: false,
      message: 'URL not found'
    });
  }

  if (url.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized'
    });
  }

  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - parseInt(days, 10));
  const urlObjectId = new mongoose.Types.ObjectId(urlId);

  // Get analytics data
  const [
    totalClicksAllTime,
    totalClicksPeriod,
    deviceAnalytics,
    browserAnalytics,
    osAnalytics,
    countryAnalytics,
    dailyTrend,
    recentVisits
  ] = await Promise.all([
    // All-time total clicks from visit records
    Visit.countDocuments({ urlId: urlObjectId }),

    // Period clicks
    Visit.countDocuments({ urlId: urlObjectId, visitedAt: { $gte: daysAgo } }),

    // Device analytics
    Visit.aggregate([
      { $match: { urlId: urlObjectId, visitedAt: { $gte: daysAgo } } },
      { $group: { _id: '$device', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]),

    // Browser analytics
    Visit.aggregate([
      { $match: { urlId: urlObjectId, visitedAt: { $gte: daysAgo } } },
      { $group: { _id: '$browser', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]),

    // OS analytics
    Visit.aggregate([
      { $match: { urlId: urlObjectId, visitedAt: { $gte: daysAgo } } },
      { $group: { _id: '$os', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]),

    // Country analytics (top 10)
    Visit.aggregate([
      { $match: { urlId: urlObjectId, visitedAt: { $gte: daysAgo } } },
      { $group: { _id: '$country', clicks: { $sum: 1 }, cities: { $addToSet: '$city' } } },
      { $sort: { clicks: -1 } },
      { $limit: 10 }
    ]),

    // Daily trend
    Visit.aggregate([
      { $match: { urlId: urlObjectId, visitedAt: { $gte: daysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$visitedAt' } },
          clicks: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]),

    // Recent 20 visits
    Visit.find({ urlId: urlObjectId, visitedAt: { $gte: daysAgo } })
      .sort({ visitedAt: -1 })
      .limit(20)
      .lean()
  ]);

  res.status(200).json({
    success: true,
    data: {
      urlId,
      shortCode: url.shortCode,
      shortUrl: url.customAlias
        ? `${constants.SHORT_DOMAIN}/${url.customAlias}`
        : `${constants.SHORT_DOMAIN}/${url.shortCode}`,
      originalUrl: url.originalUrl,
      totalClicks: totalClicksAllTime,
      period: {
        days: parseInt(days, 10),
        clicksInPeriod: totalClicksPeriod
      },
      analytics: {
        byDevice: deviceAnalytics,
        byBrowser: browserAnalytics,
        byOS: osAnalytics,
        byCountry: countryAnalytics,
        dailyTrend,
        recentVisits: recentVisits.map((v) => ({
          visitedAt: v.visitedAt,
          device: v.device,
          browser: v.browser,
          os: v.os || 'Unknown',
          country: v.country,
          city: v.city,
          referrer: v.referrer
        }))
      },
      createdAt: url.createdAt
    }
  });
});

/**
 * @route GET /api/analytics/dashboard/summary
 * @desc Get summary analytics for user dashboard
 * @access Private
 */
const getDashboardSummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const urls = await URL.find({ userId, isActive: true })
    .select('_id shortCode customAlias createdAt clickCount lastClickedAt')
    .lean();

  const urlIds = urls.map((url) => url._id);
  const totalUrls = urls.length;

  const visitStats = urlIds.length ? await Visit.aggregate([
    { $match: { urlId: { $in: urlIds } } },
    {
      $group: {
        _id: null,
        totalClicks: { $sum: 1 }
      }
    }
  ]) : [];

  const totalClicks = visitStats[0]?.totalClicks || 0;
  const averageClicksPerUrl = totalUrls > 0 ? totalClicks / totalUrls : 0;

  const mostRecentVisit = urlIds.length
    ? await Visit.findOne({ urlId: { $in: urlIds } }).sort({ visitedAt: -1 }).select('visitedAt').lean()
    : null;

  const stats = {
    totalUrls,
    totalClicks,
    averageClicksPerUrl,
    mostRecentClick: mostRecentVisit?.visitedAt || null
  };

  // Get top 5 performing URLs based on actual visit records
  const topVisitUrls = urlIds.length ? await Visit.aggregate([
    { $match: { urlId: { $in: urlIds } } },
    { $group: { _id: '$urlId', clickCount: { $sum: 1 } } },
    { $sort: { clickCount: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'urls',
        localField: '_id',
        foreignField: '_id',
        as: 'url'
      }
    },
    { $unwind: '$url' }
  ]) : [];

  let topUrlsFormatted = topVisitUrls.map((entry) => ({
    _id: entry._id,
    shortCode: entry.url.shortCode,
    customAlias: entry.url.customAlias,
    shortUrl: entry.url.customAlias
      ? `${constants.SHORT_DOMAIN}/${entry.url.customAlias}`
      : `${constants.SHORT_DOMAIN}/${entry.url.shortCode}`,
    clickCount: entry.clickCount,
    createdAt: entry.url.createdAt
  }));

  if (topUrlsFormatted.length < 5) {
    const topVisitIds = new Set(topUrlsFormatted.map((url) => url._id.toString()));
    const fallbackUrls = urls
      .filter((url) => !topVisitIds.has(url._id.toString()))
      .slice(0, 5 - topUrlsFormatted.length)
      .map((url) => ({
        _id: url._id,
        shortCode: url.shortCode,
        customAlias: url.customAlias,
        shortUrl: url.customAlias
          ? `${constants.SHORT_DOMAIN}/${url.customAlias}`
          : `${constants.SHORT_DOMAIN}/${url.shortCode}`,
        clickCount: url.clickCount || 0,
        createdAt: url.createdAt
      }));

    topUrlsFormatted = [...topUrlsFormatted, ...fallbackUrls];
  }

  const responsePayload = {
    success: true,
    data: {
      summary: stats,
      topPerforming: topUrlsFormatted
    }
  };

  res.status(200).json(responsePayload);
});

module.exports = {
  redirectToUrl,
  getUrlAnalytics,
  getDashboardSummary
};
