const db     = require('../config/database');
const bcrypt = require('bcryptjs');

// GET /api/users/profile
const getProfile = async (req, res, next) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT u.id, u.uuid, u.email, u.first_name, u.last_name, u.phone, u.avatar,
              u.role, u.email_verified, u.created_at, u.last_login,
              p.bio, p.nationality, p.date_of_birth, p.gender, p.address,
              p.city, p.country, p.total_trips, p.travel_preferences,
              p.emergency_contact_name, p.emergency_contact_phone
       FROM users u
       LEFT JOIN user_profiles p ON p.user_id = u.id
       WHERE u.id = ?`,
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });

    const user = rows[0];
    if (user.travel_preferences && typeof user.travel_preferences === 'string') {
      try { user.travel_preferences = JSON.parse(user.travel_preferences); } catch (_) {}
    }
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/users/profile
const updateProfile = async (req, res, next) => {
  try {
    const userFields = ['first_name', 'last_name', 'phone'];
    const profileFields = [
      'bio', 'nationality', 'date_of_birth', 'gender', 'address',
      'city', 'country', 'emergency_contact_name', 'emergency_contact_phone',
      'travel_preferences',
    ];

    const userUpdates    = {};
    const profileUpdates = {};

    userFields.forEach(f => { if (req.body[f] !== undefined) userUpdates[f] = req.body[f]; });
    profileFields.forEach(f => {
      if (req.body[f] !== undefined) {
        profileUpdates[f] = typeof req.body[f] === 'object' ? JSON.stringify(req.body[f]) : req.body[f];
      }
    });

    if (Object.keys(userUpdates).length > 0) {
      const setClause = Object.keys(userUpdates).map(k => `${k} = ?`).join(', ');
      await db.promise().query(
        `UPDATE users SET ${setClause} WHERE id = ?`,
        [...Object.values(userUpdates), req.user.id]
      );
    }

    if (Object.keys(profileUpdates).length > 0) {
      const setClause = Object.keys(profileUpdates).map(k => `${k} = ?`).join(', ');
      await db.promise().query(
        `UPDATE user_profiles SET ${setClause} WHERE user_id = ?`,
        [...Object.values(profileUpdates), req.user.id]
      );
    }

    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/users/change-password
const changePassword = async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body;

    const [rows] = await db.promise().query(
      'SELECT password_hash FROM users WHERE id = ?', [req.user.id]
    );
    const valid = await bcrypt.compare(current_password, rows[0].password_hash);
    if (!valid) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    const hash = await bcrypt.hash(new_password, 12);
    await db.promise().query('UPDATE users SET password_hash = ? WHERE id = ?', [hash, req.user.id]);

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
};

// GET /api/users/wishlist
const getWishlist = async (req, res, next) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT w.id, w.item_type, w.item_id, w.created_at,
              CASE w.item_type
                WHEN 'tour' THEN t.title
                WHEN 'destination' THEN d.name
              END AS title,
              CASE w.item_type
                WHEN 'tour' THEN t.cover_image
                WHEN 'destination' THEN d.cover_image
              END AS cover_image,
              CASE w.item_type
                WHEN 'tour' THEN t.slug
                WHEN 'destination' THEN d.slug
              END AS slug
       FROM wishlists w
       LEFT JOIN tours t ON w.item_type = 'tour' AND t.id = w.item_id
       LEFT JOIN destinations d ON w.item_type = 'destination' AND d.id = w.item_id
       WHERE w.user_id = ?
       ORDER BY w.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};

// POST /api/users/wishlist
const toggleWishlist = async (req, res, next) => {
  try {
    const { item_type, item_id } = req.body;

    const [exists] = await db.promise().query(
      'SELECT id FROM wishlists WHERE user_id = ? AND item_type = ? AND item_id = ?',
      [req.user.id, item_type, item_id]
    );

    if (exists.length > 0) {
      await db.promise().query('DELETE FROM wishlists WHERE id = ?', [exists[0].id]);
      return res.json({ success: true, action: 'removed', message: 'Removed from wishlist' });
    }

    await db.promise().query(
      'INSERT INTO wishlists (user_id, item_type, item_id) VALUES (?, ?, ?)',
      [req.user.id, item_type, item_id]
    );
    res.json({ success: true, action: 'added', message: 'Added to wishlist' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, updateProfile, changePassword, getWishlist, toggleWishlist };
