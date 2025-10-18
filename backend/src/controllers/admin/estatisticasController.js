const estatisticasService = require('../../services/estatisticasService');
const logger = require('../../utils/logger');

class EstatisticasController {
  /**
   * Obter estatísticas gerais da instância
   * GET /api/admin/estatisticas/geral
   */
  async obterGeral(req, res) {
    try {
      if (!req.usuario || !req.usuario.id_instancia_chat) {
        return res.status(400).json({
          success: false,
          error: 'Usuário ou instância não identificados'
        });
      }

      const idInstancia = req.usuario.id_instancia_chat;
      const estatisticas = await estatisticasService.obterGeraisAdmin(idInstancia);

      res.json({
        success: true,
        data: estatisticas
      });
    } catch (error) {
      logger.error('Erro ao obter estatísticas gerais:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao obter estatísticas'
      });
    }
  }

  /**
   * Usuários online por hora
   * GET /api/admin/estatisticas/usuarios-online
   */
  async usuariosOnlinePorHora(req, res) {
    try {
      if (!req.usuario || !req.usuario.id_instancia_chat) {
        return res.status(400).json({
          success: false,
          error: 'Usuário ou instância não identificados'
        });
      }

      const idInstancia = req.usuario.id_instancia_chat;
      const dados = await estatisticasService.usuariosOnlinePorHora(idInstancia);

      res.json({
        success: true,
        data: dados
      });
    } catch (error) {
      logger.error('Erro ao obter usuários online por hora:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao obter dados'
      });
    }
  }

  /**
   * Conversas por hora
   * GET /api/admin/estatisticas/conversas
   */
  async conversasPorHora(req, res) {
    try {
      if (!req.usuario || !req.usuario.id_instancia_chat) {
        return res.status(400).json({
          success: false,
          error: 'Usuário ou instância não identificados'
        });
      }

      const idInstancia = req.usuario.id_instancia_chat;
      const dados = await estatisticasService.conversasPorHora(idInstancia);

      res.json({
        success: true,
        data: dados
      });
    } catch (error) {
      logger.error('Erro ao obter conversas por hora:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao obter dados'
      });
    }
  }

  /**
   * Mensagens por hora
   * GET /api/admin/estatisticas/mensagens
   */
  async mensagensPorHora(req, res) {
    try {
      if (!req.usuario || !req.usuario.id_instancia_chat) {
        return res.status(400).json({
          success: false,
          error: 'Usuário ou instância não identificados'
        });
      }

      const idInstancia = req.usuario.id_instancia_chat;
      const dados = await estatisticasService.mensagensPorHora(idInstancia);

      res.json({
        success: true,
        data: dados
      });
    } catch (error) {
      logger.error('Erro ao obter mensagens por hora:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao obter dados'
      });
    }
  }

  /**
   * Atividade por equipe
   * GET /api/admin/estatisticas/equipes
   */
  async equipesAtividade(req, res) {
    try {
      if (!req.usuario || !req.usuario.id_instancia_chat) {
        return res.status(400).json({
          success: false,
          error: 'Usuário ou instância não identificados'
        });
      }

      const idInstancia = req.usuario.id_instancia_chat;
      const dados = await estatisticasService.equipesAtividade(idInstancia);

      res.json({
        success: true,
        data: dados
      });
    } catch (error) {
      logger.error('Erro ao obter atividade de equipes:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao obter dados'
      });
    }
  }

  /**
   * Relatório de acessos às conversas
   * GET /api/admin/relatorios/acessos-conversas?inicio=2025-01-01&fim=2025-01-31
   */
  async acessosConversas(req, res) {
    try {
      if (!req.usuario || !req.usuario.id_instancia_chat) {
        return res.status(400).json({
          success: false,
          error: 'Usuário ou instância não identificados'
        });
      }

      const idInstancia = req.usuario.id_instancia_chat;
      const { inicio, fim } = req.query;

      const dados = await estatisticasService.relatorioAcessosConversas(
        idInstancia,
        inicio,
        fim
      );

      res.json({
        success: true,
        data: dados,
        total: dados.length
      });
    } catch (error) {
      logger.error('Erro ao gerar relatório de acessos:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao gerar relatório'
      });
    }
  }

  /**
   * Horários de pico
   * GET /api/admin/relatorios/horarios-pico?dias=7
   */
  async horariosPico(req, res) {
    try {
      if (!req.usuario || !req.usuario.id_instancia_chat) {
        return res.status(400).json({
          success: false,
          error: 'Usuário ou instância não identificados'
        });
      }

      const idInstancia = req.usuario.id_instancia_chat;
      const dias = parseInt(req.query.dias) || 7;

      const dados = await estatisticasService.horariosPico(idInstancia, dias);

      res.json({
        success: true,
        data: dados
      });
    } catch (error) {
      logger.error('Erro ao obter horários de pico:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao obter dados'
      });
    }
  }
}

module.exports = new EstatisticasController();

