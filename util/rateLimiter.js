const {RateLimiterMemory} = require('rate-limiter-flexible');
const opts = require('../configs').middlewares.rateLimit;

const rateLimiter = new RateLimiterMemory(opts);

module.exports = (req, res, next) => {
  const remoteAddress = (req.socket && req.socket.remoteAddress)
    || (req.connection.socket && req.connection.socket.remoteAddress)
    || req.connection.remoteAddress
    || '';

  const hostname = req.get('host') || req.header('Host') || req.headers.host || req.hostname;
  const remoteKey = `${hostname}-${remoteAddress || 'undefined'}`;

  rateLimiter
    .consume(remoteKey, 1)
    .then(() => next())
    .catch(() => next({
      status: 429
    }));
};
