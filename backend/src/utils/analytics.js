const geoip = require('geoip-lite');
const UAParser = require('ua-parser-js');
const crypto = require('crypto');

/**
 * Parse User-Agent to extract browser and device info
 * @param {string} userAgent - User-Agent header
 * @returns {object} Parsed browser and device info
 */
const parseUserAgent = (userAgent) => {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  return {
    browser: result.browser.name || 'Unknown',
    device: result.device.type ? capitalizeFirstLetter(result.device.type) : 'Desktop',
    os: result.os.name || 'Unknown'
  };
};

/**
 * Get geolocation from IP address
 * @param {string} ipAddress - IP address
 * @returns {object} Geolocation info
 */
const getGeolocation = (ipAddress) => {
  const isLocal =
    !ipAddress ||
    ipAddress === '127.0.0.1' ||
    ipAddress === '::1' ||
    ipAddress === '::ffff:127.0.0.1' ||
    ipAddress.startsWith('192.168.') ||
    ipAddress.startsWith('10.') ||
    ipAddress.startsWith('172.16.') ||
    ipAddress === 'unknown';

  if (isLocal) {
    return { country: 'IN', city: 'Mumbai' };
  }

  const geo = geoip.lookup(ipAddress);
  
  if (!geo) {
    return { country: 'IN', city: 'Mumbai' };
  }

  return {
    country: geo.country,
    city: geo.city || null
  };
};

/**
 * Hash IP address for privacy (GDPR compliant)
 * @param {string} ipAddress - IP address to hash
 * @returns {string} Hashed IP
 */
const hashIp = (ipAddress) => {
  return crypto
    .createHash('sha256')
    .update(`${ipAddress}-salt-${process.env.JWT_SECRET || 'default'}`)
    .digest('hex');
};

/**
 * Extract real IP from request (handles proxies)
 * @param {object} req - Express request object
 * @returns {string} Real IP address
 */
const getClientIp = (req) => {
  return (
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.socket.remoteAddress ||
    'unknown'
  );
};

/**
 * Helper to capitalize first letter
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
const capitalizeFirstLetter = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

module.exports = {
  parseUserAgent,
  getGeolocation,
  hashIp,
  getClientIp
};
