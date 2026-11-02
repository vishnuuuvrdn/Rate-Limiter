const { performance } = require('node:perf_hooks');
const rateLimitRules = require('../config/rateLimitRules');

const rateLimitStore = new Map();

function getUserTier(req) {
    const tier = req.get('X-User-Tier');

    if (tier === 'paid') {
        return 'paid';
    }

    return 'free';
}

function getUserId(req) {
    const userId = req.get('X-User-ID');

    if (userId && userId.trim()) {
        return userId.trim();
    }

    return req.ip;
}

function createKey(userId, tier, category) {
    return JSON.stringify([userId, tier, category]);
}

function rateLimiter(category, now = () => performance.now()) {
    return (req, res, next) => {
        const tier = getUserTier(req);
        const userId = getUserId(req);
        const rule = rateLimitRules[tier][category];
        const currentTime = now();
        const windowMilliseconds = rule.windowSeconds * 1000;
        const key = createKey(userId, tier, category);
        let entry = rateLimitStore.get(key);

        if (!entry || currentTime - entry.windowStart >= windowMilliseconds) {
            entry = {
                count: 0,
                windowStart: currentTime
            };

            rateLimitStore.set(key, entry);
        }

        if (entry.count >= rule.limit) {
            const elapsedMilliseconds = currentTime - entry.windowStart;
            const remainingMilliseconds = Math.max(
                0,
                windowMilliseconds - elapsedMilliseconds
            );
            const retryAfterSeconds = Math.ceil(remainingMilliseconds / 1000);

            res.set('Retry-After', String(retryAfterSeconds));

            return res.status(429).json({
                error: 'rate_limit_exceeded',
                limit: rule.limit,
                window_seconds: rule.windowSeconds,
                retry_after_seconds: retryAfterSeconds
            });
        }

        entry.count += 1;

        return next();
    };
}

function clearRateLimitStore() {
    rateLimitStore.clear();
}

module.exports = {
    rateLimiter,
    clearRateLimitStore
};
