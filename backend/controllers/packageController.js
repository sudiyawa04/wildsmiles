const db = require('../config/database');

// GET /api/packages
const getPackages = async (req, res, next) => {
  try {
    const { featured, destination, page = 1, limit = 9 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = [];
    let where = 'WHERE p.is_active = 1';

    if (featured === 'true') { where += ' AND p.is_featured = 1'; }
    if (destination) { where += ' AND d.slug = ?'; params.push(destination); }

    const [rows] = await db.promise().query(
      `SELECT p.id, p.slug, p.title, p.short_desc, p.duration_days,
              p.price_per_person, p.original_price, p.cover_image, p.is_featured,
              d.name AS destination_name, d.country, d.slug AS destination_slug
       FROM packages p
       JOIN destinations d ON d.id = p.destination_id
       ${where}
       ORDER BY p.is_featured DESC, p.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const [counts] = await db.promise().query(
      `SELECT COUNT(*) AS total FROM packages p JOIN destinations d ON d.id = p.destination_id ${where}`,
      params
    );

    res.json({
      success: true,
      data: rows,
      pagination: { total: counts[0].total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(counts[0].total / parseInt(limit)) },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/packages/:slug
const getPackageBySlug = async (req, res, next) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT p.*, d.name AS destination_name, d.country, d.slug AS destination_slug
       FROM packages p
       JOIN destinations d ON d.id = p.destination_id
       WHERE p.slug = ? AND p.is_active = 1`,
      [req.params.slug]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    const pkg = rows[0];
    ['gallery', 'highlights', 'inclusions', 'exclusions'].forEach(f => {
      if (pkg[f] && typeof pkg[f] === 'string') { try { pkg[f] = JSON.parse(pkg[f]); } catch (_) {} }
    });

    const [items] = await db.promise().query(
      'SELECT * FROM package_items WHERE package_id = ?', [pkg.id]
    );

    res.json({ success: true, data: { ...pkg, items } });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPackages, getPackageBySlug };
