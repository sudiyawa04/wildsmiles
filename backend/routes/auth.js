const router = require('express').Router();
const { body } = require('express-validator');
const ctrl   = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validate }     = require('../middleware/validate');

const passwordRules = body('password')
  .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
  .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
  .matches(/[0-9]/).withMessage('Password must contain a number');

router.post('/register',
  body('first_name').trim().notEmpty().withMessage('First name required'),
  body('last_name').trim().notEmpty().withMessage('Last name required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  passwordRules,
  validate,
  ctrl.register
);

router.post('/login',
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  validate,
  ctrl.login
);

router.post('/refresh',          ctrl.refresh);
router.get('/verify-email',      ctrl.verifyEmail);
router.post('/forgot-password',  body('email').isEmail().normalizeEmail(), validate, ctrl.forgotPassword);
router.post('/reset-password',
  body('token').notEmpty(),
  passwordRules,
  validate,
  ctrl.resetPassword
);
router.get('/me', authenticate, ctrl.getMe);

module.exports = router;
