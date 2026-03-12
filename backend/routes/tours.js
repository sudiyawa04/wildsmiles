const router = require('express').Router();
const ctrl   = require('../controllers/tourController');
const { authenticate, requireRole } = require('../middleware/auth');

router.get('/',                       ctrl.getTours);
router.get('/featured',               ctrl.getFeaturedTours);
router.get('/:slug',                  ctrl.getTourBySlug);
router.get('/:slug/availability',     ctrl.getTourAvailability);

// Admin only
router.post('/',     authenticate, requireRole('admin','super_admin'), ctrl.createTour);
router.patch('/:id', authenticate, requireRole('admin','super_admin'), ctrl.updateTour);
router.delete('/:id',authenticate, requireRole('admin','super_admin'), ctrl.deleteTour);

module.exports = router;
