const temaService = require('../../services/temaService');
const logger = require('../../utils/logger');

class TemaController {
  /**
   * Obter tema da instância do administrador
   * GET /api/admin/tema
   */
  async obter(req, res) {
    try {
      const idInstancia = req.usuario.id_instancia_chat;

      const tema = await temaService.obterTemaPorInstancia(idInstancia);

      res.json({
        success: true,
        data: tema
      });
    } catch (error) {
      logger.error('Erro ao obter tema:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao obter configurações de tema'
      });
    }
  }

  /**
   * Atualizar tema da instância
   * PUT /api/admin/tema
   */
  async atualizar(req, res) {
    try {
      const idInstancia = req.usuario.id_instancia_chat;
      const usuarioId = req.usuario.id;
      const dadosTema = req.body;

      // Validar cores (formato hexadecimal)
      const camposCores = [
        'cor_primaria', 'cor_primaria_hover', 'cor_secundaria',
        'cor_fundo', 'cor_fundo_secundario',
        'cor_texto_primaria', 'cor_texto_secundaria',
        'cor_mensagem_enviada', 'cor_mensagem_recebida',
        'cor_sucesso', 'cor_erro', 'cor_alerta', 'cor_info'
      ];

      for (const campo of camposCores) {
        if (dadosTema[campo] && !/^#[0-9A-Fa-f]{6}$/.test(dadosTema[campo])) {
          return res.status(400).json({
            success: false,
            error: `Cor inválida no campo ${campo}. Use formato hexadecimal (#RRGGBB)`
          });
        }
      }

      // Validar border_radius
      if (dadosTema.border_radius !== undefined) {
        const radius = parseInt(dadosTema.border_radius);
        if (isNaN(radius) || radius < 0 || radius > 50) {
          return res.status(400).json({
            success: false,
            error: 'Border radius deve ser um número entre 0 e 50'
          });
        }
      }

      const tema = await temaService.atualizarTema(
        idInstancia,
        dadosTema,
        usuarioId,
        req
      );

      res.json({
        success: true,
        message: 'Tema atualizado com sucesso',
        data: tema
      });
    } catch (error) {
      logger.error('Erro ao atualizar tema:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao atualizar tema'
      });
    }
  }

  /**
   * Atualizar apenas logo
   * PUT /api/admin/tema/logo
   */
  async atualizarLogo(req, res) {
    try {
      const idInstancia = req.usuario.id_instancia_chat;
      const usuarioId = req.usuario.id;
      const { logo_url, logo_width, logo_height } = req.body;

      if (!logo_url) {
        return res.status(400).json({
          success: false,
          error: 'URL do logo é obrigatória'
        });
      }

      const tema = await temaService.atualizarLogo(
        idInstancia,
        logo_url,
        logo_width,
        logo_height,
        usuarioId,
        req
      );

      res.json({
        success: true,
        message: 'Logo atualizado com sucesso',
        data: tema
      });
    } catch (error) {
      logger.error('Erro ao atualizar logo:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao atualizar logo'
      });
    }
  }

  /**
   * Resetar tema para padrão
   * POST /api/admin/tema/resetar
   */
  async resetar(req, res) {
    try {
      const idInstancia = req.usuario.id_instancia_chat;
      const usuarioId = req.usuario.id;

      const tema = await temaService.resetarParaPadrao(idInstancia, usuarioId, req);

      res.json({
        success: true,
        message: 'Tema resetado para configurações padrão',
        data: tema
      });
    } catch (error) {
      logger.error('Erro ao resetar tema:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao resetar tema'
      });
    }
  }

  /**
   * Listar logs de alterações do tema
   * GET /api/admin/tema/logs
   */
  async listarLogs(req, res) {
    try {
      const idInstancia = req.usuario.id_instancia_chat;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const offset = (page - 1) * limit;

      const resultado = await temaService.listarLogs(idInstancia, limit, offset);

      res.json({
        success: true,
        ...resultado
      });
    } catch (error) {
      logger.error('Erro ao listar logs:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao listar logs de tema'
      });
    }
  }

  /**
   * Preview do tema (retorna CSS variables)
   * GET /api/admin/tema/preview
   */
  async preview(req, res) {
    try {
      const idInstancia = req.usuario.id_instancia_chat;
      const tema = await temaService.obterTemaPorInstancia(idInstancia);

      const cssVariables = {
        '--cor-primaria': tema.cor_primaria,
        '--cor-primaria-hover': tema.cor_primaria_hover,
        '--cor-secundaria': tema.cor_secundaria,
        '--cor-fundo': tema.cor_fundo,
        '--cor-fundo-secundario': tema.cor_fundo_secundario,
        '--cor-texto-primaria': tema.cor_texto_primaria,
        '--cor-texto-secundaria': tema.cor_texto_secundaria,
        '--cor-mensagem-enviada': tema.cor_mensagem_enviada,
        '--cor-mensagem-recebida': tema.cor_mensagem_recebida,
        '--cor-sucesso': tema.cor_sucesso,
        '--cor-erro': tema.cor_erro,
        '--cor-alerta': tema.cor_alerta,
        '--cor-info': tema.cor_info,
        '--fonte-principal': tema.fonte_principal,
        '--border-radius': `${tema.border_radius}px`
      };

      res.json({
        success: true,
        cssVariables,
        tema
      });
    } catch (error) {
      logger.error('Erro ao gerar preview:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao gerar preview do tema'
      });
    }
  }
}

module.exports = new TemaController();

