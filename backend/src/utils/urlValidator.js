/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} Whether URL is valid
 */
const isValidUrl = (url) => {
  try {
    const urlObj = new URL(url);
    // Only allow http and https
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

/**
 * Normalize URL (add https if no protocol, trim whitespace)
 * @param {string} url - URL to normalize
 * @returns {string} Normalized URL
 */
const normalizeUrl = (url) => {
  let normalized = url.trim();
  
  // Add https if no protocol specified
  if (!normalized.match(/^https?:\/\//)) {
    normalized = `https://${normalized}`;
  }
  
  return normalized;
};

/**
 * Check if URL is in blocklist (phishing, malware, etc.)
 * @param {string} url - URL to check
 * @returns {boolean} Whether URL is blocked
 */
const isUrlBlocked = (url) => {
  // Blocklist of known malicious patterns
  const blockedPatterns = [
    /localhost/i,
    /127\.0\.0\.1/,
    /\.test\//,
    /example\.com/i
  ];

  return blockedPatterns.some((pattern) => pattern.test(url));
};

/**
 * Extract domain from URL
 * @param {string} url - URL to extract from
 * @returns {string} Domain name
 */
const extractDomain = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return '';
  }
};

module.exports = {
  isValidUrl,
  normalizeUrl,
  isUrlBlocked,
  extractDomain
};
