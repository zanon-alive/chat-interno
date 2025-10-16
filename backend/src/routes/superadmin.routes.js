const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');
const empresaController = require('../controllers/superadmin/empresaController');
const instanciaController = require('../controllers/superadmin/instanciaController');

// Todas as rotas requerem autenticação e role super_admin
router.use(auth);
router.use(roleCheck('super_admin'));

// Rotas de Empresas
router.get('/empresas', empresaController.listar);
router.get('/empresas/:id', empresaController.buscarPorId);
router.post('/empresas', empresaController.criar);
router.put('/empresas/:id', empresaController.atualizar);
router.delete('/empresas/:id', empresaController.deletar);
router.get('/empresas/:id/estatisticas', empresaController.estatisticas);

// Rotas de Instâncias
router.get('/instancias', instanciaController.listar);
router.get('/instancias/:id', instanciaController.buscarPorId);
router.post('/instancias', instanciaController.criar);
router.put('/instancias/:id', instanciaController.atualizar);
router.delete('/instancias/:id', instanciaController.deletar);
router.get('/instancias/:id/estatisticas', instanciaController.estatisticas);

module.exports = router;

