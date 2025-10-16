const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middlewares/auth');
const { loginLimiter } = require('../middlewares/rateLimiter');

// Rotas públicas
router.post('/login', loginLimiter, authController.login);

// Rotas protegidas
router.get('/me', auth, authController.me);
router.post('/trocar-senha', auth, authController.trocarSenha);
router.post('/logout', auth, authController.logout);

module.exports = router;

