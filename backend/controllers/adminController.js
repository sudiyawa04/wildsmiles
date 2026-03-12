const db = require('../config/database');

// GET /api/admin/analytics/overview
const getOverview = async (req, res, next) => {
  try {
    const [[userStats]]    = await db.promise().query('SELECT COUNT(*) AS total, SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) AS today FROM users WHERE role = "user"');
    const [[bookingStats]] = await db.promise().query('SELECT COUNT(*) AS total, SUM(total_amount) AS revenue, SUM(CASE WHEN status = "confirmed" THEN 1 ELSE 0 END) AS confirmed, SUM(CASE WHEN status = "pending" THEN 1 ELSE 0 END) AS pending FROM tour_bookings');
    const [[tourStats]]    = await db.promise().query('SELECT COUNT(*) AS total, SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) AS active FROM tours');
    const [[reviewStats]]  = await db.promise().query('SELECT COUNT(*) AS total, SUM(CASE WHEN is_approved = 0 THEN 1 ELSE 0 END) AS pending FROM reviews');

    res.json({
      success: true,
      data: {
        users:    userStats,
        bookings: bookingStats,
        tours:    tourStats,
        reviews:  reviewStats,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/analytics/revenue
const getRevenueAnalytics = async (req, res, next) => {
  try {
    const { period = '30' } = req.query;

    const [monthly] = await db.promise().query(
      `SELECT DATE_FORMAT(created_at, '%Y-%m') AS month,
              COUNT(*) AS bookings,
              SUM(total_amount) AS revenue
       FROM tour_bookings
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
         AND status IN ('confirmed','completed')
       GROUP BY month
       ORDER BY month ASC`,
      [parseInt(period)]
    );

    const [byCategory] = await db.promise().query(
      `SELECT t.category,
              COUNT(b.id) AS bookings,
              SUM(b.total_amount) AS revenue
       FROM tour_bookings b
       JOIN tours t ON t.id = b.tour_id
       WHERE b.status IN ('confirmed','completed')
       GROUP BY t.category
       ORDER BY revenue DESC`
    );

    const [topTours] = await db.promise().query(
      `SELECT t.title, t.slug, COUNT(b.id) AS bookings, SUM(b.total_amount) AS revenue
       FROM tour_bookings b
       JOIN tours t ON t.id = b.tour_id
       WHERE b.status IN ('confirmed','completed')
       GROUP BY t.id
       ORDER BY revenue DESC
       LIMIT 10`
    );

    res.json({ success: true, data: { monthly, byCategory, topTours } });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/bookings
const getAllBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = [];
    let where = 'WHERE 1=1';

    if (status) { where += ' AND b.status = ?'; params.push(status); }
    if (search) { where += ' AND (b.booking_ref LIKE ? OR u.email LIKE ? OR u.first_name LIKE ?)'; params.push(`%${search}%`, `%${search}%`, `%${search}%`); }

    const [rows] = await db.promise().query(
      `SELECT b.id, b.booking_ref, b.tour_date, b.adults, b.children,
              b.total_amount, b.status, b.created_at,
              u.first_name, u.last_name, u.email,
              t.title AS tour_title, d.name AS destination
       FROM tour_bookings b
       JOIN users u ON u.id = b.user_id
       JOIN tours t ON t.id = b.tour_id
       JOIN destinations d ON d.id = t.destination_id
       ${where}
       ORDER BY b.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const [counts] = await db.promise().query(
      `SELECT COUNT(*) AS total FROM tour_bookings b JOIN users u ON u.id = b.user_id ${where}`, params
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

// PATCH /api/admin/bookings/:id/status
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'confirmed', 'cancelled', 'completed', 'refunded'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    await db.promise().query(
      `UPDATE tour_bookings SET status = ?, ${status === 'confirmed' ? 'confirmed_at = NOW(),' : ''} updated_at = NOW() WHERE id = ?`,
      [status, req.params.id]
    );
    res.json({ success: true, message: `Booking ${status}` });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/users
const getAllUsers = async (req, res, next) => {
  try {
    const { role, page = 1, limit = 20, search } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = [];
    let where = 'WHERE 1=1';

    if (role) { where += ' AND u.role = ?'; params.push(role); }
    if (search) { where += ' AND (u.email LIKE ? OR u.first_name LIKE ? OR u.last_name LIKE ?)'; params.push(`%${search}%`, `%${search}%`, `%${search}%`); }

    const [rows] = await db.promise().query(
      `SELECT u.id, u.uuid, u.email, u.first_name, u.last_name, u.role,
              u.is_active, u.email_verified, u.created_at, u.last_login,
              p.total_trips
       FROM users u
       LEFT JOIN user_profiles p ON p.user_id = u.id
       ${where}
       ORDER BY u.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const [counts] = await db.promise().query(
      `SELECT COUNT(*) AS total FROM users u ${where}`, params
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

// PATCH /api/admin/users/:id/status
const updateUserStatus = async (req, res, next) => {
  try {
    const { is_active } = req.body;
    await db.promise().query('UPDATE users SET is_active = ? WHERE id = ?', [is_active ? 1 : 0, req.params.id]);
    res.json({ success: true, message: `User ${is_active ? 'activated' : 'deactivated'}` });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/reviews/pending
const getPendingReviews = async (req, res, next) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT r.*, u.first_name, u.last_name, u.email
       FROM reviews r
       JOIN users u ON u.id = r.user_id
       WHERE r.is_approved = 0
       ORDER BY r.created_at DESC
       LIMIT 50`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getOverview, getRevenueAnalytics, getAllBookings, updateBookingStatus,
  getAllUsers, updateUserStatus, getPendingReviews,
};
