const db = require('../config/database');

// GET /api/tours
const getTours = async (req, res, next) => {
  try {
    const {
      destination, category, difficulty, min_price, max_price,
      min_duration, max_duration, min_rating, featured,
      sort = 'created_at', order = 'DESC',
      page = 1, limit = 12, search,
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = [];
    let where = 'WHERE t.is_active = 1';

    if (destination) {
      where += ' AND d.slug = ?';
      params.push(destination);
    }
    if (category) {
      where += ' AND t.category = ?';
      params.push(category);
    }
    if (difficulty) {
      where += ' AND t.difficulty = ?';
      params.push(difficulty);
    }
    if (min_price) {
      where += ' AND t.price_per_person >= ?';
      params.push(parseFloat(min_price));
    }
    if (max_price) {
      where += ' AND t.price_per_person <= ?';
      params.push(parseFloat(max_price));
    }
    if (min_duration) {
      where += ' AND t.duration_days >= ?';
      params.push(parseInt(min_duration));
    }
    if (max_duration) {
      where += ' AND t.duration_days <= ?';
      params.push(parseInt(max_duration));
    }
    if (min_rating) {
      where += ' AND t.avg_rating >= ?';
      params.push(parseFloat(min_rating));
    }
    if (featured === 'true') {
      where += ' AND t.is_featured = 1';
    }
    if (search) {
      where += ' AND MATCH(t.title, t.description) AGAINST(? IN BOOLEAN MODE)';
      params.push(search + '*');
    }

    const allowedSort = ['price_per_person', 'avg_rating', 'review_count', 'duration_days', 'created_at', 'booking_count'];
    const sortCol = allowedSort.includes(sort) ? sort : 'created_at';
    const sortDir = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const sql = `
      SELECT t.id, t.slug, t.title, t.category, t.difficulty,
             t.short_desc, t.duration_days, t.price_per_person,
             t.cover_image, t.avg_rating, t.review_count,
             t.booking_count, t.is_featured, t.group_size_max,
             d.name AS destination_name, d.country, d.slug AS destination_slug
      FROM tours t
      JOIN destinations d ON d.id = t.destination_id
      ${where}
      ORDER BY t.${sortCol} ${sortDir}
      LIMIT ? OFFSET ?
    `;

    const countSql = `
      SELECT COUNT(*) AS total
      FROM tours t
      JOIN destinations d ON d.id = t.destination_id
      ${where}
    `;

    const [tours]  = await db.promise().query(sql, [...params, parseInt(limit), offset]);
    const [counts] = await db.promise().query(countSql, params);

    res.json({
      success: true,
      data:  tours,
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

// GET /api/tours/:slug
const getTourBySlug = async (req, res, next) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT t.*, d.name AS destination_name, d.country, d.slug AS destination_slug,
              d.lat AS dest_lat, d.lng AS dest_lng,
              u.first_name AS guide_first_name, u.last_name AS guide_last_name,
              u.avatar AS guide_avatar, gp.bio AS guide_bio,
              gp.years_experience, gp.avg_rating AS guide_rating
       FROM tours t
       JOIN destinations d ON d.id = t.destination_id
       LEFT JOIN users u ON u.id = t.guide_id
       LEFT JOIN guide_profiles gp ON gp.user_id = t.guide_id
       WHERE t.slug = ? AND t.is_active = 1`,
      [req.params.slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }

    const tour = rows[0];

    // Parse JSON fields
    ['gallery', 'highlights', 'inclusions', 'exclusions', 'languages', 'what_to_bring'].forEach(f => {
      if (tour[f] && typeof tour[f] === 'string') {
        try { tour[f] = JSON.parse(tour[f]); } catch (_) {}
      }
    });

    // Get itinerary
    const [itinerary] = await db.promise().query(
      'SELECT * FROM tour_itineraries WHERE tour_id = ? ORDER BY day_number',
      [tour.id]
    );
    itinerary.forEach(day => {
      ['activities', 'meals'].forEach(f => {
        if (day[f] && typeof day[f] === 'string') {
          try { day[f] = JSON.parse(day[f]); } catch (_) {}
        }
      });
    });

    // Get availability (next 90 days)
    const [availability] = await db.promise().query(
      `SELECT available_date, spots_total, spots_booked, price_override, is_available
       FROM tour_availability
       WHERE tour_id = ? AND available_date >= CURDATE()
         AND available_date <= DATE_ADD(CURDATE(), INTERVAL 90 DAY)
       ORDER BY available_date`,
      [tour.id]
    );

    // Get reviews (latest 5)
    const [reviews] = await db.promise().query(
      `SELECT r.*, u.first_name, u.last_name, u.avatar
       FROM reviews r
       JOIN users u ON u.id = r.user_id
       WHERE r.review_type = 'tour' AND r.entity_id = ? AND r.is_approved = 1
       ORDER BY r.created_at DESC LIMIT 5`,
      [tour.id]
    );

    res.json({
      success: true,
      data: { ...tour, itinerary, availability, reviews },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/tours/featured
const getFeaturedTours = async (req, res, next) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT t.id, t.slug, t.title, t.category, t.difficulty,
              t.short_desc, t.duration_days, t.price_per_person,
              t.cover_image, t.avg_rating, t.review_count, t.highlights,
              d.name AS destination_name, d.country, d.slug AS destination_slug
       FROM tours t
       JOIN destinations d ON d.id = t.destination_id
       WHERE t.is_active = 1 AND t.is_featured = 1
       ORDER BY t.booking_count DESC
       LIMIT 6`
    );
    rows.forEach(t => {
      if (t.highlights && typeof t.highlights === 'string') {
        try { t.highlights = JSON.parse(t.highlights); } catch (_) {}
      }
    });
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};

// GET /api/tours/:slug/availability
const getTourAvailability = async (req, res, next) => {
  try {
    const [tour] = await db.promise().query(
      'SELECT id FROM tours WHERE slug = ? AND is_active = 1', [req.params.slug]
    );
    if (tour.length === 0) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }

    const [availability] = await db.promise().query(
      `SELECT available_date, spots_total, spots_booked,
              (spots_total - spots_booked) AS spots_remaining,
              price_override, is_available
       FROM tour_availability
       WHERE tour_id = ? AND available_date >= CURDATE()
       ORDER BY available_date
       LIMIT 90`,
      [tour[0].id]
    );

    res.json({ success: true, data: availability });
  } catch (err) {
    next(err);
  }
};

// POST /api/tours (admin)
const createTour = async (req, res, next) => {
  try {
    const slugify = require('slugify');
    const slug = slugify(req.body.title, { lower: true, strict: true });

    const fields = [
      'title', 'destination_id', 'guide_id', 'category', 'difficulty',
      'description', 'short_desc', 'duration_days', 'group_size_min',
      'group_size_max', 'price_per_person', 'price_child', 'price_private',
      'cover_image', 'gallery', 'highlights', 'inclusions', 'exclusions',
      'meeting_point', 'meeting_lat', 'meeting_lng', 'languages',
      'what_to_bring', 'cancellation_policy', 'is_featured', 'is_instant_book',
      'meta_title', 'meta_description',
    ];

    const validBody = {};
    fields.forEach(f => {
      if (req.body[f] !== undefined) {
        validBody[f] = Array.isArray(req.body[f]) || typeof req.body[f] === 'object'
          ? JSON.stringify(req.body[f])
          : req.body[f];
      }
    });

    const cols   = Object.keys(validBody);
    const vals   = Object.values(validBody);
    const placeholders = cols.map(() => '?').join(', ');

    const [result] = await db.promise().query(
      `INSERT INTO tours (slug, ${cols.join(', ')}) VALUES (?, ${placeholders})`,
      [slug, ...vals]
    );

    res.status(201).json({ success: true, message: 'Tour created', id: result.insertId, slug });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/tours/:id (admin)
const updateTour = async (req, res, next) => {
  try {
    const allowed = [
      'title', 'category', 'difficulty', 'description', 'short_desc',
      'duration_days', 'group_size_min', 'group_size_max', 'price_per_person',
      'price_child', 'price_private', 'cover_image', 'gallery', 'highlights',
      'inclusions', 'exclusions', 'meeting_point', 'cancellation_policy',
      'is_featured', 'is_active', 'meta_title', 'meta_description',
    ];
    const updates = {};
    allowed.forEach(f => {
      if (req.body[f] !== undefined) {
        updates[f] = Array.isArray(req.body[f]) || (typeof req.body[f] === 'object' && req.body[f] !== null)
          ? JSON.stringify(req.body[f])
          : req.body[f];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields to update' });
    }

    const setClause = Object.keys(updates).map(k => `${k} = ?`).join(', ');
    await db.promise().query(
      `UPDATE tours SET ${setClause} WHERE id = ?`,
      [...Object.values(updates), req.params.id]
    );

    res.json({ success: true, message: 'Tour updated' });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/tours/:id (admin — soft delete)
const deleteTour = async (req, res, next) => {
  try {
    await db.promise().query(
      'UPDATE tours SET is_active = 0 WHERE id = ?', [req.params.id]
    );
    res.json({ success: true, message: 'Tour deactivated' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTours, getTourBySlug, getFeaturedTours,
  getTourAvailability, createTour, updateTour, deleteTour,
};
