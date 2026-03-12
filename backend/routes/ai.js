const router = require('express').Router();
const ctrl   = require('../controllers/aiController');
const { optionalAuth } = require('../middleware/auth');

router.post('/trip-planner',   ctrl.generateItinerary);
router.get('/recommendations', optionalAuth, ctrl.getRecommendations);

module.exports = router;
