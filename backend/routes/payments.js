const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db     = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// POST /api/payments/create-intent
router.post('/create-intent', authenticate, async (req, res, next) => {
  try {
    const { booking_ref, booking_type = 'tour' } = req.body;

    const [bookings] = await db.promise().query(
      'SELECT * FROM tour_bookings WHERE booking_ref = ? AND user_id = ?',
      [booking_ref, req.user.id]
    );

    if (bookings.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const booking = bookings[0];
    if (booking.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Booking is already ${booking.status}` });
    }

    const amountCents = Math.round(parseFloat(booking.total_amount) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount:   amountCents,
      currency: 'usd',
      metadata: { booking_ref, user_id: String(req.user.id), booking_type },
    });

    // Record pending payment
    const payment_ref = 'PAY-' + uuidv4().substr(0, 8).toUpperCase();
    await db.promise().query(
      `INSERT INTO payments (payment_ref, user_id, booking_type, booking_id, amount, method, status, gateway_payment_id)
       VALUES (?, ?, ?, ?, ?, 'stripe', 'pending', ?)`,
      [payment_ref, req.user.id, booking_type, booking.id, booking.total_amount, paymentIntent.id]
    );

    res.json({
      success:      true,
      clientSecret: paymentIntent.client_secret,
      payment_ref,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/payments/webhook (Stripe webhook)
router.post('/webhook', require('express').raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object;
    const { booking_ref, booking_type } = pi.metadata;

    await db.promise().query(
      `UPDATE payments SET status = 'completed', gateway_response = ?
       WHERE gateway_payment_id = ?`,
      [JSON.stringify(pi), pi.id]
    );

    if (booking_type === 'tour') {
      await db.promise().query(
        `UPDATE tour_bookings SET status = 'confirmed', confirmed_at = NOW() WHERE booking_ref = ?`,
        [booking_ref]
      );
    }
  }

  if (event.type === 'payment_intent.payment_failed') {
    const pi = event.data.object;
    await db.promise().query(
      `UPDATE payments SET status = 'failed' WHERE gateway_payment_id = ?`, [pi.id]
    );
  }

  res.json({ received: true });
});

module.exports = router;
