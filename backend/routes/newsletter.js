const router = require('express').Router();
const db     = require('../config/database');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');

router.post('/subscribe',
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  validate,
  async (req, res, next) => {
    try {
      const { email } = req.body;
      await db.promise().query(
        'INSERT INTO newsletter_subscribers (email) VALUES (?) ON DUPLICATE KEY UPDATE is_active = 1',
        [email]
      );
      res.json({ success: true, message: 'Subscribed! Welcome to WildSmiles updates.' });
    } catch (err) {
      next(err);
    }
  }
);

router.post('/unsubscribe',
  body('email').isEmail().normalizeEmail(),
  validate,
  async (req, res, next) => {
    try {
      await db.promise().query(
        'UPDATE newsletter_subscribers SET is_active = 0 WHERE email = ?', [req.body.email]
      );
      res.json({ success: true, message: 'Unsubscribed successfully.' });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
