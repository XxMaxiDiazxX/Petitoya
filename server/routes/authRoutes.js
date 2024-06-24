const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/registerSu', authController.registerSu);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/verify-code-and-reset-password', authController.verifyCodeAndResetPassword)


module.exports = router;
