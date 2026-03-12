const router = require('express').Router();
const ctrl   = require('../controllers/packageController');

router.get('/',      ctrl.getPackages);
router.get('/:slug', ctrl.getPackageBySlug);

module.exports = router;
