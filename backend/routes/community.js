const router = require('express').Router();
const ctrl   = require('../controllers/communityController');
const { authenticate } = require('../middleware/auth');

router.get('/stories',              ctrl.getStories);
router.get('/stories/:slug',        ctrl.getStoryBySlug);
router.post('/stories',             authenticate, ctrl.createStory);
router.post('/stories/:id/comments',authenticate, ctrl.addComment);

module.exports = router;
