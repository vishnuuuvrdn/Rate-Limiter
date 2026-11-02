const express = require('express');
const { rateLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/generate', rateLimiter('ai'), (req, res) => {
 res.status(200).json({ ok: true });
});

router.post('/summarise', rateLimiter('ai'), (req, res) => {
 res.status(200).json({ ok: true });
});

module.exports = router;
