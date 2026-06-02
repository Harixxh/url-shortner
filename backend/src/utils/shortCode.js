const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const constants = require('../config/constants');
const URL = require('../models/URL');

/**
 * Generate a cryptographically secure random short code
 * @param {number} length - Length of short code (default: 7)
 * @returns {string} Random short code
 */
const generateShortCode = (length = constants.SHORT_CODE_LENGTH) => {
  const randomBytes = crypto.randomBytes(Math.ceil((length * 6) / 8));
  const code = randomBytes
    .toString('base64')
    .replace(/[+/=]/g, '') // Remove URL-unsafe chars
    .substring(0, length);
  return code;
};

/**
 * Generate unique short code with collision detection
 * Retries up to 5 times if collision detected
 * @returns {string} Unique short code
 */
const generateUniqueShortCode = async (maxRetries = 5) => {
  for (let i = 0; i < maxRetries; i++) {
    const shortCode = generateShortCode();
    
    // Check if short code already exists
    const existing = await URL.findOne({ shortCode });
    if (!existing) {
      return shortCode;
    }
    
    console.log(`Short code collision detected, retrying... (${i + 1}/${maxRetries})`);
  }
  
  // Fallback: UUID-based code (extremely low collision probability)
  return `${uuidv4().substring(0, 8)}`.toLowerCase();
};

/**
 * Validate custom alias format
 * @param {string} alias - Custom alias to validate
 * @returns {boolean} Whether alias is valid
 */
const isValidAlias = (alias) => {
  if (!alias) return false;
  if (alias.length < 3 || alias.length > 20) return false;
  return /^[a-zA-Z0-9_-]+$/.test(alias);
};

/**
 * Check if custom alias is already taken
 * @param {string} alias - Alias to check
 * @returns {boolean} Whether alias is available
 */
const isAliasAvailable = async (alias) => {
  const existing = await URL.findOne({ customAlias: alias });
  return !existing;
};

module.exports = {
  generateShortCode,
  generateUniqueShortCode,
  isValidAlias,
  isAliasAvailable
};
