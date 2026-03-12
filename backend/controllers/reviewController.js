const db = require('../config/database');

// POST /api/reviews
const createReview = async (req, res, next) => {
  try {
    const { review_type, entity_id, rating, title, content } = req.body;

    // Check if user already reviewed this entity
    const [existing] = await db.promise().query(
      'SELECT id FROM reviews WHERE user_id = ? AND review_type = ? AND entity_id = ?',
      [req.user.id, review_type, entity_id]
    );
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'You have already reviewed this.' });
    }

    const [result] = await db.promise().query(
      `INSERT INTO reviews (user_id, review_type, entity_id, rating, title, content)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.id, review_type, entity_id, rating, title || null, content]
    );

    // Update entity avg_rating
    await updateEntityRating(review_type, entity_id);

    res.status(201).json({
      success: true,
      message: 'Review submitted. It will appear after approval.',
      id: result.insertId,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/reviews?type=tour&entity_id=1
const getReviews = async (req, res, next) => {
  try {
    const { type, entity_id, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = [type, parseInt(entity_id)];

    const [rows] = await db.promise().query(
      `SELECT r.id, r.rating, r.title, r.content, r.helpful_count,
              r.reply, r.replied_at, r.created_at,
              u.first_name, u.last_name, u.avatar
       FROM reviews r
       JOIN users u ON u.id = r.user_id
       WHERE r.review_type = ? AND r.entity_id = ? AND r.is_approved = 1
       ORDER BY r.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const [counts] = await db.promise().query(
      `SELECT COUNT(*) AS total,
              AVG(rating) AS avg_rating,
              SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) AS five_star,
              SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) AS four_star,
              SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) AS three_star,
              SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) AS two_star,
              SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) AS one_star
       FROM reviews
       WHERE review_type = ? AND entity_id = ? AND is_approved = 1`,
      params
    );

    res.json({
      success: true,
      data: rows,
      stats: counts[0],
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

// Approve review (admin)
const approveReview = async (req, res, next) => {
  try {
    const [rows] = await db.promise().query(
      'SELECT * FROM reviews WHERE id = ?', [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    await db.promise().query(
      'UPDATE reviews SET is_approved = 1 WHERE id = ?', [req.params.id]
    );
    await updateEntityRating(rows[0].review_type, rows[0].entity_id);

    res.json({ success: true, message: 'Review approved' });
  } catch (err) {
    next(err);
  }
};

// POST /api/reviews/:id/reply (admin)
const replyToReview = async (req, res, next) => {
  try {
    await db.promise().query(
      'UPDATE reviews SET reply = ?, replied_at = NOW() WHERE id = ?',
      [req.body.reply, req.params.id]
    );
    res.json({ success: true, message: 'Reply added' });
  } catch (err) {
    next(err);
  }
};

const updateEntityRating = async (type, entityId) => {
  const tableMap = { tour: 'tours', hotel: 'hotels', destination: 'destinations', guide: 'guide_profiles' };
  const idCol    = type === 'guide' ? 'user_id' : 'id';
  const table    = tableMap[type];
  if (!table) return;

  const [stats] = await db.promise().query(
    'SELECT AVG(rating) AS avg, COUNT(*) AS cnt FROM reviews WHERE review_type = ? AND entity_id = ? AND is_approved = 1',
    [type, entityId]
  );
  await db.promise().query(
    `UPDATE ${table} SET avg_rating = ?, review_count = ? WHERE ${idCol} = ?`,
    [parseFloat(stats[0].avg || 0).toFixed(2), stats[0].cnt, entityId]
  );
};

module.exports = { createReview, getReviews, approveReview, replyToReview };
