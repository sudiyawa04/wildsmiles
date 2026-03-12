const db = require('../config/database');

// GET /api/community/stories
const getStories = async (req, res, next) => {
  try {
    const { page = 1, limit = 9 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const [rows] = await db.promise().query(
      `SELECT s.id, s.slug, s.title, s.cover_image, s.like_count,
              s.comment_count, s.view_count, s.created_at,
              u.first_name, u.last_name, u.avatar,
              d.name AS destination_name, d.slug AS destination_slug
       FROM travel_stories s
       JOIN users u ON u.id = s.user_id
       LEFT JOIN destinations d ON d.id = s.destination_id
       WHERE s.is_published = 1
       ORDER BY s.created_at DESC
       LIMIT ? OFFSET ?`,
      [parseInt(limit), offset]
    );

    const [counts] = await db.promise().query(
      'SELECT COUNT(*) AS total FROM travel_stories WHERE is_published = 1'
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

// GET /api/community/stories/:slug
const getStoryBySlug = async (req, res, next) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT s.*, u.first_name, u.last_name, u.avatar,
              d.name AS destination_name
       FROM travel_stories s
       JOIN users u ON u.id = s.user_id
       LEFT JOIN destinations d ON d.id = s.destination_id
       WHERE s.slug = ? AND s.is_published = 1`,
      [req.params.slug]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }

    // Increment view count
    await db.promise().query(
      'UPDATE travel_stories SET view_count = view_count + 1 WHERE id = ?', [rows[0].id]
    );

    const [comments] = await db.promise().query(
      `SELECT c.id, c.content, c.created_at, u.first_name, u.last_name, u.avatar
       FROM story_comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.story_id = ?
       ORDER BY c.created_at ASC`,
      [rows[0].id]
    );

    res.json({ success: true, data: { ...rows[0], comments } });
  } catch (err) {
    next(err);
  }
};

// POST /api/community/stories
const createStory = async (req, res, next) => {
  try {
    const slugify = require('slugify');
    const { title, content, destination_id, tags } = req.body;
    const slug = slugify(title, { lower: true, strict: true }) + '-' + Date.now();

    const [result] = await db.promise().query(
      `INSERT INTO travel_stories (user_id, title, slug, content, destination_id, tags, is_published)
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [req.user.id, title, slug, content, destination_id || null, tags ? JSON.stringify(tags) : null]
    );

    res.status(201).json({ success: true, message: 'Story published!', id: result.insertId, slug });
  } catch (err) {
    next(err);
  }
};

// POST /api/community/stories/:id/comments
const addComment = async (req, res, next) => {
  try {
    await db.promise().query(
      'INSERT INTO story_comments (story_id, user_id, content) VALUES (?, ?, ?)',
      [req.params.id, req.user.id, req.body.content]
    );
    await db.promise().query(
      'UPDATE travel_stories SET comment_count = comment_count + 1 WHERE id = ?', [req.params.id]
    );
    res.status(201).json({ success: true, message: 'Comment added' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStories, getStoryBySlug, createStory, addComment };
