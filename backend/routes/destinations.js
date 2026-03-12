const router = require('express').Router();
const ctrl   = require('../controllers/destinationController');

router.get('/',         ctrl.getDestinations);
router.get('/featured', ctrl.getFeaturedDestinations);
router.get('/:slug',    ctrl.getDestinationBySlug);

module.exports = router;
