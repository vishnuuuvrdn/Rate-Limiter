const express = require('express');
const { rateLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.get('/list', rateLimiter('read'), (req, res) => {
 res.status(200).json({ ok: true });
});

router.get('/export', rateLimiter('read'), (req, res) => {
 res.status(200).json({ ok: true });
});

module.exports = router;
