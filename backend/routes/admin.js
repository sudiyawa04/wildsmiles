const router = require('express').Router();
const ctrl   = require('../controllers/adminController');
const { authenticate, requireRole } = require('../middleware/auth');

router.use(authenticate, requireRole('admin', 'super_admin'));

router.get('/analytics/overview', ctrl.getOverview);
router.get('/analytics/revenue',  ctrl.getRevenueAnalytics);
router.get('/bookings',           ctrl.getAllBookings);
router.patch('/bookings/:id/status', ctrl.updateBookingStatus);
router.get('/users',              ctrl.getAllUsers);
router.patch('/users/:id/status', ctrl.updateUserStatus);
router.get('/reviews/pending',    ctrl.getPendingReviews);

module.exports = router;
