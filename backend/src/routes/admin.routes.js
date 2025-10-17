const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');
const tenantValidation = require('../middlewares/tenantValidation');
const equipeController = require('../controllers/admin/equipeController');
const usuarioController = require('../controllers/admin/usuarioController');
const usuarioWidgetController = require('../controllers/admin/usuarioWidgetController');

// Todas as rotas requerem autenticação, role admin_cliente e validação de tenant
router.use(auth);
router.use(roleCheck('admin_cliente', 'super_admin')); // Super admin também pode acessar
router.use(tenantValidation);

// Rotas de Equipes
router.get('/equipes', equipeController.listar);
router.get('/equipes/:id', equipeController.buscarPorId);
router.post('/equipes', equipeController.criar);
router.put('/equipes/:id', equipeController.atualizar);
router.delete('/equipes/:id', equipeController.deletar);
router.get('/equipes/:id/estatisticas', equipeController.estatisticas);

// Rotas de Usuários
router.get('/usuarios/hierarquia', usuarioController.hierarquia);
router.get('/usuarios/estatisticas', usuarioController.estatisticas);
router.get('/usuarios', usuarioController.listar);
router.get('/usuarios/:id', usuarioController.buscarPorId);
router.post('/usuarios', usuarioController.criar);
router.put('/usuarios/:id', usuarioController.atualizar);
router.delete('/usuarios/:id', usuarioController.deletar);

// Rotas de Token de Widget para Usuários
router.post('/usuarios/:id/gerar-token-widget', usuarioWidgetController.gerarToken);
router.get('/usuarios/:id/token-widget', usuarioWidgetController.obterToken);
router.delete('/usuarios/:id/token-widget', usuarioWidgetController.revogarToken);

module.exports = router;

