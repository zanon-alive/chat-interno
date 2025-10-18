const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');
const tenantValidation = require('../middlewares/tenantValidation');
const equipeController = require('../controllers/admin/equipeController');
const usuarioController = require('../controllers/admin/usuarioController');
const usuarioWidgetController = require('../controllers/admin/usuarioWidgetController');
const temaController = require('../controllers/admin/temaController');
const estatisticasController = require('../controllers/admin/estatisticasController');

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

// Rotas de Tema (White-Label)
router.get('/tema', temaController.obter);
router.put('/tema', temaController.atualizar);
router.put('/tema/logo', temaController.atualizarLogo);
router.post('/tema/resetar', temaController.resetar);
router.get('/tema/logs', temaController.listarLogs);
router.get('/tema/preview', temaController.preview);

// Rotas de Estatísticas
router.get('/estatisticas/geral', estatisticasController.obterGeral);
router.get('/estatisticas/usuarios-online', estatisticasController.usuariosOnlinePorHora);
router.get('/estatisticas/conversas', estatisticasController.conversasPorHora);
router.get('/estatisticas/mensagens', estatisticasController.mensagensPorHora);
router.get('/estatisticas/equipes', estatisticasController.equipesAtividade);

// Rotas de Relatórios
router.get('/relatorios/acessos-conversas', estatisticasController.acessosConversas);
router.get('/relatorios/horarios-pico', estatisticasController.horariosPico);

module.exports = router;

