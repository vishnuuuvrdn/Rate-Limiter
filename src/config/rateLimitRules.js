const rateLimitRules = {
    free: {
        ai: {
            limit: 5,
            windowSeconds: 60
        },
        read: {
            limit: 30,
            windowSeconds: 60
        }
    },
    paid: {
        ai: {
            limit: 30,
            windowSeconds: 60
        },
        read: {
            limit: 120,
            windowSeconds: 60
        }
    }
};

module.exports = rateLimitRules;
