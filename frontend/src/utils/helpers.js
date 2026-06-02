/**
 * Format number with commas and decimals
 */
export const formatNumber = (num) => {
  if (!num) return '0';
  return num.toLocaleString();
};

/**
 * Format date to readable format
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format date with time
 */
export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Truncate string to specified length
 */
export const truncate = (str, length = 50) => {
  return str.length > length ? `${str.substring(0, length)}...` : str;
};

/**
 * Check if URL is valid
 */
export const isValidUrl = (urlString) => {
  try {
    new URL(urlString);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Get domain from URL
 */
export const getDomain = (url) => {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

/**
 * Delay execution (for loading states)
 */
export const delay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));
