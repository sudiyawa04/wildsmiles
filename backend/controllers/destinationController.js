const db = require('../config/database');

// GET /api/destinations
const getDestinations = async (req, res, next) => {
  try {
    const { continent, featured, page = 1, limit = 12, search } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = [];
    let where = 'WHERE is_active = 1';

    if (continent) { where += ' AND continent = ?'; params.push(continent); }
    if (featured === 'true') { where += ' AND is_featured = 1'; }
    if (search) { where += ' AND (name LIKE ? OR country LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }

    const [rows] = await db.promise().query(
      `SELECT id, slug, name, country, continent, short_desc,
              cover_image, is_featured, tour_count, lat, lng
       FROM destinations ${where}
       ORDER BY is_featured DESC, tour_count DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const [counts] = await db.promise().query(
      `SELECT COUNT(*) AS total FROM destinations ${where}`, params
    );

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: counts[0].total,
        page:  parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(counts[0].total / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/destinations/:slug
const getDestinationBySlug = async (req, res, next) => {
  try {
    const [rows] = await db.promise().query(
      'SELECT * FROM destinations WHERE slug = ? AND is_active = 1', [req.params.slug]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    const dest = rows[0];
    ['gallery', 'highlights'].forEach(f => {
      if (dest[f] && typeof dest[f] === 'string') {
        try { dest[f] = JSON.parse(dest[f]); } catch (_) {}
      }
    });

    // Attractions
    const [attractions] = await db.promise().query(
      'SELECT * FROM destination_attractions WHERE destination_id = ?', [dest.id]
    );

    // Tours for this destination
    const [tours] = await db.promise().query(
      `SELECT id, slug, title, category, difficulty, short_desc,
              duration_days, price_per_person, cover_image,
              avg_rating, review_count, is_featured
       FROM tours
       WHERE destination_id = ? AND is_active = 1
       ORDER BY is_featured DESC, avg_rating DESC
       LIMIT 8`,
      [dest.id]
    );

    res.json({ success: true, data: { ...dest, attractions, tours } });
  } catch (err) {
    next(err);
  }
};

// GET /api/destinations/featured
const getFeaturedDestinations = async (req, res, next) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT id, slug, name, country, continent, short_desc,
              cover_image, tour_count, lat, lng
       FROM destinations
       WHERE is_active = 1 AND is_featured = 1
       ORDER BY tour_count DESC
       LIMIT 6`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};

module.exports = { getDestinations, getDestinationBySlug, getFeaturedDestinations };
