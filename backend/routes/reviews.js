const router = require('express').Router();
const { body } = require('express-validator');
const ctrl   = require('../controllers/reviewController');
const { authenticate, requireRole } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

router.get('/', ctrl.getReviews);

router.post('/',
  authenticate,
  body('review_type').isIn(['tour','hotel','destination','guide']),
  body('entity_id').isInt({ gt: 0 }),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1–5'),
  body('content').trim().isLength({ min: 10 }).withMessage('Review must be at least 10 characters'),
  validate,
  ctrl.createReview
);

// Admin
router.patch('/:id/approve', authenticate, requireRole('admin','super_admin'), ctrl.approveReview);
router.post('/:id/reply',    authenticate, requireRole('admin','super_admin'), ctrl.replyToReview);

module.exports = router;
