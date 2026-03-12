const router = require('express').Router();
const db     = require('../config/database');
const { authenticate } = require('../middleware/auth');

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT gp.*, u.first_name, u.last_name, u.avatar, u.email,
              d.name AS location_name
       FROM guide_profiles gp
       JOIN users u ON u.id = gp.user_id
       LEFT JOIN destinations d ON d.name = gp.location
       WHERE gp.is_approved = 1
       ORDER BY gp.avg_rating DESC
       LIMIT 20`
    );
    rows.forEach(g => {
      ['languages', 'specializations', 'certifications'].forEach(f => {
        if (g[f] && typeof g[f] === 'string') { try { g[f] = JSON.parse(g[f]); } catch (_) {} }
      });
    });
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
});

// Apply to be a guide
router.post('/apply', authenticate, async (req, res, next) => {
  try {
    const { bio, languages, specializations, location, years_experience } = req.body;

    const [exists] = await db.promise().query(
      'SELECT id FROM guide_profiles WHERE user_id = ?', [req.user.id]
    );
    if (exists.length > 0) {
      return res.status(409).json({ success: false, message: 'Guide application already submitted' });
    }

    await db.promise().query(
      `INSERT INTO guide_profiles (user_id, bio, languages, specializations, location, years_experience)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.id, bio, JSON.stringify(languages), JSON.stringify(specializations), location, years_experience]
    );

    res.status(201).json({ success: true, message: 'Application submitted. We will review and contact you within 48 hours.' });
  } catch (err) { next(err); }
});

module.exports = router;
