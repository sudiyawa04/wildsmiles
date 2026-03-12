const db   = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const { sendEmail } = require('../services/emailService');

const generateRef = () => 'WS' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();

// POST /api/bookings/tour
const createTourBooking = async (req, res, next) => {
  try {
    const {
      tour_id, tour_date, adults = 1, children = 0, infants = 0,
      special_requests, traveler_details, promo_code,
    } = req.body;

    // Validate tour exists and is active
    const [tours] = await db.promise().query(
      'SELECT * FROM tours WHERE id = ? AND is_active = 1', [tour_id]
    );
    if (tours.length === 0) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }
    const tour = tours[0];

    // Check availability
    const [avail] = await db.promise().query(
      `SELECT * FROM tour_availability
       WHERE tour_id = ? AND available_date = ? AND is_available = 1`,
      [tour_id, tour_date]
    );
    if (avail.length > 0) {
      const remaining = avail[0].spots_total - avail[0].spots_booked;
      if (remaining < adults + children) {
        return res.status(409).json({ success: false, message: 'Not enough spots available on this date' });
      }
    }

    // Calculate price
    const priceAdult = avail.length > 0 && avail[0].price_override
      ? parseFloat(avail[0].price_override)
      : parseFloat(tour.price_per_person);
    const priceChild  = parseFloat(tour.price_child || priceAdult * 0.7);
    let   total = (priceAdult * parseInt(adults)) + (priceChild * parseInt(children));

    // Apply promo code
    let discount = 0;
    if (promo_code) {
      const [promos] = await db.promise().query(
        `SELECT * FROM promo_codes
         WHERE code = ? AND is_active = 1
           AND valid_from <= CURDATE() AND valid_until >= CURDATE()
           AND (max_uses IS NULL OR used_count < max_uses)`,
        [promo_code]
      );
      if (promos.length > 0) {
        const promo = promos[0];
        if (total >= parseFloat(promo.min_purchase)) {
          discount = promo.discount_type === 'percentage'
            ? total * (parseFloat(promo.discount_value) / 100)
            : parseFloat(promo.discount_value);
          discount = Math.min(discount, total);
          total   -= discount;
          await db.promise().query(
            'UPDATE promo_codes SET used_count = used_count + 1 WHERE id = ?', [promo.id]
          );
        }
      }
    }

    const booking_ref = generateRef();

    const [result] = await db.promise().query(
      `INSERT INTO tour_bookings
         (booking_ref, user_id, tour_id, tour_date, adults, children, infants,
          price_per_adult, price_per_child, total_amount, discount_amount,
          special_requests, traveler_details)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        booking_ref, req.user.id, tour_id, tour_date,
        adults, children, infants,
        priceAdult, priceChild, total.toFixed(2), discount.toFixed(2),
        special_requests || null,
        traveler_details ? JSON.stringify(traveler_details) : null,
      ]
    );

    // Update availability if slot exists
    if (avail.length > 0) {
      await db.promise().query(
        'UPDATE tour_availability SET spots_booked = spots_booked + ? WHERE tour_id = ? AND available_date = ?',
        [parseInt(adults) + parseInt(children), tour_id, tour_date]
      );
    }

    // Send confirmation email (non-blocking)
    const [user] = await db.promise().query(
      'SELECT email, first_name FROM users WHERE id = ?', [req.user.id]
    );
    sendEmail({
      to:       user[0].email,
      subject:  `WildSmiles — Booking Confirmed! Ref: ${booking_ref}`,
      template: 'booking-confirmation',
      data: {
        name:        user[0].first_name,
        booking_ref,
        tour_title:  tour.title,
        tour_date,
        adults, children,
        total:       total.toFixed(2),
      },
    }).catch(console.error);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        booking_ref,
        id:            result.insertId,
        total_amount:  total.toFixed(2),
        discount:      discount.toFixed(2),
        status:        'pending',
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/bookings/my
const getMyBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let where = 'WHERE b.user_id = ?';
    const params = [req.user.id];
    if (status) { where += ' AND b.status = ?'; params.push(status); }

    const [bookings] = await db.promise().query(
      `SELECT b.*, t.title AS tour_title, t.cover_image, t.slug AS tour_slug,
              t.duration_days, d.name AS destination, d.country
       FROM tour_bookings b
       JOIN tours t ON t.id = b.tour_id
       JOIN destinations d ON d.id = t.destination_id
       ${where}
       ORDER BY b.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const [counts] = await db.promise().query(
      `SELECT COUNT(*) AS total FROM tour_bookings b ${where}`, params
    );

    res.json({
      success: true,
      data: bookings,
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

// GET /api/bookings/:ref
const getBookingByRef = async (req, res, next) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT b.*, t.title AS tour_title, t.cover_image, t.slug AS tour_slug,
              t.duration_days, t.meeting_point, t.cancellation_policy,
              d.name AS destination, d.country,
              p.status AS payment_status, p.method AS payment_method, p.payment_ref
       FROM tour_bookings b
       JOIN tours t ON t.id = b.tour_id
       JOIN destinations d ON d.id = t.destination_id
       LEFT JOIN payments p ON p.booking_type = 'tour' AND p.booking_id = b.id
       WHERE b.booking_ref = ? AND b.user_id = ?`,
      [req.params.ref, req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// POST /api/bookings/:ref/cancel
const cancelBooking = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const [rows] = await db.promise().query(
      'SELECT * FROM tour_bookings WHERE booking_ref = ? AND user_id = ?',
      [req.params.ref, req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (['cancelled', 'completed', 'refunded'].includes(rows[0].status)) {
      return res.status(400).json({ success: false, message: `Booking is already ${rows[0].status}` });
    }

    await db.promise().query(
      `UPDATE tour_bookings
       SET status = 'cancelled', cancellation_reason = ?, cancelled_at = NOW()
       WHERE id = ?`,
      [reason || null, rows[0].id]
    );

    // Free up spots
    await db.promise().query(
      `UPDATE tour_availability
       SET spots_booked = GREATEST(spots_booked - ?, 0)
       WHERE tour_id = ? AND available_date = ?`,
      [rows[0].adults + rows[0].children, rows[0].tour_id, rows[0].tour_date]
    );

    res.json({ success: true, message: 'Booking cancelled successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { createTourBooking, getMyBookings, getBookingByRef, cancelBooking };
