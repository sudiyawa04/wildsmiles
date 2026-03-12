const router = require('express').Router();
const ctrl   = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/profile',          ctrl.getProfile);
router.patch('/profile',        ctrl.updateProfile);
router.patch('/change-password',ctrl.changePassword);
router.get('/wishlist',         ctrl.getWishlist);
router.post('/wishlist',        ctrl.toggleWishlist);

module.exports = router;
