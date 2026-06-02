const connectRedis = async () => {
  // Redis support removed. Direct MongoDB queries are used instead.
};

const cacheShortUrl = async () => {};
const invalidateShortUrlCache = async () => {};
const invalidateDashboardSummary = async () => {};

module.exports = {
  redisClient: null,
  connectRedis,
  cacheShortUrl,
  invalidateShortUrlCache,
  invalidateDashboardSummary
};
