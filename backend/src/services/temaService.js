const { TemaInstancia, TemaLog, InstanciaChat, Usuario } = require('../models');
const logger = require('../utils/logger');

class TemaService {
  /**
   * Obter tema de uma instância
   */
  async obterTemaPorInstancia(idInstancia) {
    try {
      let tema = await TemaInstancia.findOne({
        where: { id_instancia: idInstancia, ativo: true },
        include: [
          {
            model: InstanciaChat,
            as: 'instancia',
            attributes: ['id', 'nome']
          }
        ]
      });

      // Se não existe tema, criar um com valores padrão
      if (!tema) {
        tema = await this.criarTemaP​adrao(idInstancia);
      }

      return tema;
    } catch (error) {
      logger.error('Erro ao obter tema da instância:', error);
      throw error;
    }
  }

  /**
   * Criar tema padrão para uma instância
   */
  async criarTemaPadrao(idInstancia, usuarioId = null) {
    try {
      const tema = await TemaInstancia.create({
        id_instancia: idInstancia,
        criado_por: usuarioId,
        atualizado_por: usuarioId,
        // Valores padrão já estão definidos no model
      });

      // Registrar log
      if (usuarioId) {
        await this.registrarLog({
          id_tema: tema.id,
          id_usuario: usuarioId,
          id_instancia: idInstancia,
          acao: 'criado',
          descricao: 'Tema padrão criado automaticamente'
        });
      }

      return tema;
    } catch (error) {
      logger.error('Erro ao criar tema padrão:', error);
      throw error;
    }
  }

  /**
   * Atualizar tema de uma instância
   */
  async atualizarTema(idInstancia, dadosTema, usuarioId, req = null) {
    try {
      let tema = await TemaInstancia.findOne({
        where: { id_instancia: idInstancia }
      });

      // Se não existe, criar primeiro
      if (!tema) {
        tema = await this.criarTemaPadrao(idInstancia, usuarioId);
      }

      // Guardar valores anteriores para log
      const valoresAnteriores = { ...tema.toJSON() };

      // Atualizar tema
      await tema.update({
        ...dadosTema,
        atualizado_por: usuarioId
      });

      // Registrar log detalhado
      const camposAlterados = this.detectarCamposAlterados(valoresAnteriores, dadosTema);
      
      await this.registrarLog({
        id_tema: tema.id,
        id_usuario: usuarioId,
        id_instancia: idInstancia,
        acao: 'atualizado',
        valor_anterior: JSON.stringify(valoresAnteriores),
        valor_novo: JSON.stringify(dadosTema),
        ip_origem: req?.ip || req?.connection?.remoteAddress,
        user_agent: req?.headers?.['user-agent'],
        descricao: `Campos alterados: ${camposAlterados.join(', ')}`
      });

      logger.info(`Tema atualizado: instância ${idInstancia} por usuário ${usuarioId}`);
      return tema;
    } catch (error) {
      logger.error('Erro ao atualizar tema:', error);
      throw error;
    }
  }

  /**
   * Atualizar logo
   */
  async atualizarLogo(idInstancia, logoUrl, logoWidth, logoHeight, usuarioId, req = null) {
    try {
      let tema = await TemaInstancia.findOne({
        where: { id_instancia: idInstancia }
      });

      if (!tema) {
        tema = await this.criarTemaPadrao(idInstancia, usuarioId);
      }

      const logoAnterior = tema.logo_url;

      await tema.update({
        logo_url: logoUrl,
        logo_width: logoWidth || 150,
        logo_height: logoHeight || 50,
        atualizado_por: usuarioId
      });

      await this.registrarLog({
        id_tema: tema.id,
        id_usuario: usuarioId,
        id_instancia: idInstancia,
        acao: 'logo_alterado',
        campo_alterado: 'logo_url',
        valor_anterior: logoAnterior,
        valor_novo: logoUrl,
        ip_origem: req?.ip,
        user_agent: req?.headers?.['user-agent'],
        descricao: 'Logo da instância alterado'
      });

      logger.info(`Logo atualizado: instância ${idInstancia}`);
      return tema;
    } catch (error) {
      logger.error('Erro ao atualizar logo:', error);
      throw error;
    }
  }

  /**
   * Ativar/Desativar tema
   */
  async toggleAtivo(idInstancia, ativo, usuarioId, req = null) {
    try {
      const tema = await TemaInstancia.findOne({
        where: { id_instancia: idInstancia }
      });

      if (!tema) {
        throw new Error('Tema não encontrado');
      }

      await tema.update({
        ativo,
        atualizado_por: usuarioId
      });

      await this.registrarLog({
        id_tema: tema.id,
        id_usuario: usuarioId,
        id_instancia: idInstancia,
        acao: ativo ? 'ativado' : 'desativado',
        ip_origem: req?.ip,
        user_agent: req?.headers?.['user-agent'],
        descricao: `Tema ${ativo ? 'ativado' : 'desativado'}`
      });

      return tema;
    } catch (error) {
      logger.error('Erro ao ativar/desativar tema:', error);
      throw error;
    }
  }

  /**
   * Listar logs de alterações
   */
  async listarLogs(idInstancia, limit = 50, offset = 0) {
    try {
      const { count, rows } = await TemaLog.findAndCountAll({
        where: { id_instancia: idInstancia },
        include: [
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['id', 'nome_completo', 'email']
          }
        ],
        order: [['created_at', 'DESC']],
        limit,
        offset
      });

      return {
        total: count,
        logs: rows,
        page: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      logger.error('Erro ao listar logs de tema:', error);
      throw error;
    }
  }

  /**
   * Registrar log de alteração
   */
  async registrarLog(dadosLog) {
    try {
      return await TemaLog.create(dadosLog);
    } catch (error) {
      logger.error('Erro ao registrar log de tema:', error);
      // Não propagar erro para não impedir a operação principal
    }
  }

  /**
   * Detectar quais campos foram alterados
   */
  detectarCamposAlterados(valoresAnteriores, valoresNovos) {
    const campos = [];
    const camposIgnorar = ['id', 'created_at', 'updated_at', 'criado_por', 'atualizado_por'];

    Object.keys(valoresNovos).forEach(key => {
      if (!camposIgnorar.includes(key) && valoresAnteriores[key] !== valoresNovos[key]) {
        campos.push(key);
      }
    });

    return campos;
  }

  /**
   * Listar todos os temas (SuperAdmin)
   */
  async listarTodos(limit = 50, offset = 0) {
    try {
      const { count, rows } = await TemaInstancia.findAndCountAll({
        include: [
          {
            model: InstanciaChat,
            as: 'instancia',
            attributes: ['id', 'nome', 'ativo']
          },
          {
            model: Usuario,
            as: 'atualizador',
            attributes: ['id', 'nome_completo']
          }
        ],
        order: [['updated_at', 'DESC']],
        limit,
        offset
      });

      return {
        total: count,
        temas: rows,
        page: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      logger.error('Erro ao listar todos os temas:', error);
      throw error;
    }
  }

  /**
   * Resetar tema para padrão
   */
  async resetarParaPadrao(idInstancia, usuarioId, req = null) {
    try {
      const tema = await TemaInstancia.findOne({
        where: { id_instancia: idInstancia }
      });

      if (!tema) {
        throw new Error('Tema não encontrado');
      }

      const valoresAnteriores = { ...tema.toJSON() };

      // Valores padrão
      const valoresPadrao = {
        cor_primaria: '#667eea',
        cor_primaria_hover: '#5568d3',
        cor_secundaria: '#764ba2',
        cor_fundo: '#f7fafc',
        cor_fundo_secundario: '#ffffff',
        cor_texto_primaria: '#2d3748',
        cor_texto_secundaria: '#718096',
        cor_mensagem_enviada: '#667eea',
        cor_mensagem_recebida: '#e2e8f0',
        cor_sucesso: '#48bb78',
        cor_erro: '#f56565',
        cor_alerta: '#ed8936',
        cor_info: '#4299e1',
        fonte_principal: 'Inter, sans-serif',
        border_radius: 8,
        atualizado_por: usuarioId
      };

      await tema.update(valoresPadrao);

      await this.registrarLog({
        id_tema: tema.id,
        id_usuario: usuarioId,
        id_instancia: idInstancia,
        acao: 'atualizado',
        valor_anterior: JSON.stringify(valoresAnteriores),
        valor_novo: JSON.stringify(valoresPadrao),
        ip_origem: req?.ip,
        user_agent: req?.headers?.['user-agent'],
        descricao: 'Tema resetado para valores padrão'
      });

      return tema;
    } catch (error) {
      logger.error('Erro ao resetar tema:', error);
      throw error;
    }
  }
}

module.exports = new TemaService();

