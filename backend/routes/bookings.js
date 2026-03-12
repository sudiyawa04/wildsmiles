const router = require('express').Router();
const { body } = require('express-validator');
const ctrl   = require('../controllers/bookingController');
const { authenticate } = require('../middleware/auth');
const { validate }     = require('../middleware/validate');

router.use(authenticate);

router.post('/tour',
  body('tour_id').isInt({ gt: 0 }).withMessage('Valid tour_id required'),
  body('tour_date').isDate().withMessage('Valid tour_date required (YYYY-MM-DD)'),
  body('adults').optional().isInt({ min: 1, max: 50 }),
  body('children').optional().isInt({ min: 0, max: 50 }),
  validate,
  ctrl.createTourBooking
);

router.get('/my',           ctrl.getMyBookings);
router.get('/:ref',         ctrl.getBookingByRef);
router.post('/:ref/cancel', ctrl.cancelBooking);

module.exports = router;
