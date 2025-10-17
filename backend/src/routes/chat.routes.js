const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const tenantValidation = require('../middlewares/tenantValidation');
const conversaController = require('../controllers/chat/conversaController');
const mensagemController = require('../controllers/chat/mensagemController');
const usuarioController = require('../controllers/chat/usuarioController');

// Todas as rotas requerem autenticação e validação de tenant
router.use(auth);
router.use(tenantValidation);

// Rotas de Usuários (para chat)
router.get('/usuarios-disponiveis', usuarioController.listarDisponiveis);

// Rotas de Conversas
router.get('/conversas', conversaController.listar);
router.get('/conversas/:id', conversaController.buscarPorId);
router.post('/conversas/individual', conversaController.criarIndividual);
router.post('/conversas/grupo', conversaController.criarGrupo);
router.post('/conversas/:id/participantes', conversaController.adicionarParticipante);

// Rotas de Mensagens (REST - histórico e busca)
router.get('/conversas/:id/mensagens', mensagemController.listar);
router.get('/mensagens/buscar', mensagemController.buscar);
router.get('/mensagens/:id', mensagemController.buscarPorId);
router.put('/mensagens/:id', mensagemController.editar);
router.delete('/mensagens/:id', mensagemController.deletar);

module.exports = router;

