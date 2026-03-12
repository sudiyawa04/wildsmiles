const router = require('express').Router();
const db     = require('../config/database');
const { authenticate } = require('../middleware/auth');

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT id, slug, name, destination_id, star_rating, short_desc,
              cover_image, avg_rating, review_count, check_in_time, check_out_time
       FROM hotels WHERE is_active = 1 ORDER BY star_rating DESC, avg_rating DESC LIMIT 20`
    );
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT h.*, d.name AS destination_name, d.country
       FROM hotels h
       JOIN destinations d ON d.id = h.destination_id
       WHERE h.slug = ? AND h.is_active = 1`,
      [req.params.slug]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Hotel not found' });

    const hotel = rows[0];
    ['gallery', 'amenities'].forEach(f => {
      if (hotel[f] && typeof hotel[f] === 'string') { try { hotel[f] = JSON.parse(hotel[f]); } catch (_) {} }
    });

    const [rooms] = await db.promise().query(
      'SELECT * FROM hotel_rooms WHERE hotel_id = ? AND is_available = 1', [hotel.id]
    );

    res.json({ success: true, data: { ...hotel, rooms } });
  } catch (err) { next(err); }
});

module.exports = router;
