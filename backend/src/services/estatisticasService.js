const { Empresa, InstanciaChat, Usuario, Conversa, Mensagem, Equipe, sequelize } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

class EstatisticasService {
  /**
   * Obter estatísticas gerais do SuperAdmin
   */
  async obterGeraisSuperAdmin() {
    try {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const cincoMinutosAtras = new Date(Date.now() - 5 * 60 * 1000);

      const [totalEmpresas, totalUsuarios, usuariosOnline, conversasHoje, mensagensHoje] = await Promise.all([
        Empresa.count({ where: { ativo: true } }),
        Usuario.count({ where: { status: 'ativo' } }),
        Usuario.count({
          where: {
            status: 'ativo',
            ultimo_acesso: { [Op.gte]: cincoMinutosAtras }
          }
        }),
        Conversa.count({
          where: {
            created_at: { [Op.gte]: hoje }
          }
        }),
        Mensagem.count({
          where: {
            created_at: { [Op.gte]: hoje }
          }
        })
      ]);

      return {
        totalEmpresas,
        totalUsuarios,
        usuariosOnline,
        conversasHoje,
        mensagensHoje,
        dataAtualizada: new Date()
      };
    } catch (error) {
      logger.error('Erro ao obter estatísticas gerais (SuperAdmin):', error);
      throw error;
    }
  }

  /**
   * Obter estatísticas gerais do Admin (por instância)
   */
  async obterGeraisAdmin(idInstancia) {
    try {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const cincoMinutosAtras = new Date(Date.now() - 5 * 60 * 1000);

      const [totalUsuarios, usuariosOnline, conversasAtivas, mensagensHoje] = await Promise.all([
        Usuario.count({
          where: {
            id_instancia_chat: idInstancia,
            status: 'ativo'
          }
        }),
        Usuario.count({
          where: {
            id_instancia_chat: idInstancia,
            status: 'ativo',
            ultimo_acesso: { [Op.gte]: cincoMinutosAtras }
          }
        }),
        Conversa.count({
          where: {
            id_instancia: idInstancia,
            updated_at: { [Op.gte]: hoje }
          }
        }),
        Mensagem.count({
          where: {
            id_instancia: idInstancia,
            created_at: { [Op.gte]: hoje }
          }
        })
      ]);

      // Calcular taxa de resposta (mensagens respondidas em < 1h)
      const taxaResposta = await this.calcularTaxaResposta(idInstancia);

      return {
        totalUsuarios,
        usuariosOnline,
        conversasAtivas,
        mensagensHoje,
        taxaResposta,
        dataAtualizada: new Date()
      };
    } catch (error) {
      logger.error('Erro ao obter estatísticas gerais (Admin):', error);
      throw error;
    }
  }

  /**
   * Usuários online por hora (últimas 24h)
   */
  async usuariosOnlinePorHora(idInstancia = null, empresaId = null) {
    try {
      const vintequatroHorasAtras = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      const where = {
        ultimo_acesso: { [Op.gte]: vintequatroHorasAtras },
        status: 'ativo'
      };

      if (idInstancia) {
        where.id_instancia_chat = idInstancia;
      }

      if (empresaId) {
        const instancias = await InstanciaChat.findAll({
          where: { id_empresa: empresaId },
          attributes: ['id']
        });
        const instanciaIds = instancias.map(i => i.id);
        where.id_instancia_chat = { [Op.in]: instanciaIds };
      }

      // Agrupar por hora
      const resultado = await Usuario.findAll({
        attributes: [
          [sequelize.fn('strftime', '%H', sequelize.col('ultimo_acesso')), 'hora'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'total']
        ],
        where,
        group: [sequelize.fn('strftime', '%H', sequelize.col('ultimo_acesso'))],
        raw: true
      });

      // Preencher todas as 24 horas
      const dados = Array.from({ length: 24 }, (_, i) => {
        const hora = i.toString().padStart(2, '0');
        const item = resultado.find(r => r.hora === hora);
        return {
          hora: `${hora}:00`,
          total: item ? parseInt(item.total) : 0
        };
      });

      return dados;
    } catch (error) {
      logger.error('Erro ao obter usuários online por hora:', error);
      throw error;
    }
  }

  /**
   * Conversas por hora (últimas 24h)
   */
  async conversasPorHora(idInstancia = null, empresaId = null) {
    try {
      const vintequatroHorasAtras = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      const where = {
        created_at: { [Op.gte]: vintequatroHorasAtras }
      };

      if (idInstancia) {
        where.id_instancia = idInstancia;
      }

      if (empresaId) {
        const instancias = await InstanciaChat.findAll({
          where: { id_empresa: empresaId },
          attributes: ['id']
        });
        const instanciaIds = instancias.map(i => i.id);
        where.id_instancia = { [Op.in]: instanciaIds };
      }

      const resultado = await Conversa.findAll({
        attributes: [
          [sequelize.fn('strftime', '%H', sequelize.col('created_at')), 'hora'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'total']
        ],
        where,
        group: [sequelize.fn('strftime', '%H', sequelize.col('created_at'))],
        raw: true
      });

      // Preencher todas as 24 horas
      const dados = Array.from({ length: 24 }, (_, i) => {
        const hora = i.toString().padStart(2, '0');
        const item = resultado.find(r => r.hora === hora);
        return {
          hora: `${hora}:00`,
          total: item ? parseInt(item.total) : 0
        };
      });

      return dados;
    } catch (error) {
      logger.error('Erro ao obter conversas por hora:', error);
      throw error;
    }
  }

  /**
   * Mensagens por hora (últimas 24h)
   */
  async mensagensPorHora(idInstancia = null, empresaId = null) {
    try {
      const vintequatroHorasAtras = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      const where = {
        created_at: { [Op.gte]: vintequatroHorasAtras }
      };

      if (idInstancia) {
        where.id_instancia = idInstancia;
      }

      if (empresaId) {
        const instancias = await InstanciaChat.findAll({
          where: { id_empresa: empresaId },
          attributes: ['id']
        });
        const instanciaIds = instancias.map(i => i.id);
        where.id_instancia = { [Op.in]: instanciaIds };
      }

      const resultado = await Mensagem.findAll({
        attributes: [
          [sequelize.fn('strftime', '%H', sequelize.col('created_at')), 'hora'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'total']
        ],
        where,
        group: [sequelize.fn('strftime', '%H', sequelize.col('created_at'))],
        raw: true
      });

      // Preencher todas as 24 horas
      const dados = Array.from({ length: 24 }, (_, i) => {
        const hora = i.toString().padStart(2, '0');
        const item = resultado.find(r => r.hora === hora);
        return {
          hora: `${hora}:00`,
          total: item ? parseInt(item.total) : 0
        };
      });

      return dados;
    } catch (error) {
      logger.error('Erro ao obter mensagens por hora:', error);
      throw error;
    }
  }

  /**
   * Detalhamento por empresa (SuperAdmin)
   */
  async detalheEmpresas() {
    try {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const cincoMinutosAtras = new Date(Date.now() - 5 * 60 * 1000);

      const empresas = await Empresa.findAll({
        where: { ativo: true },
        include: [
          {
            model: InstanciaChat,
            as: 'instancias',
            attributes: ['id', 'nome']
          }
        ]
      });

      const detalhes = await Promise.all(empresas.map(async (empresa) => {
        const instanciaIds = empresa.instancias.map(i => i.id);

        const [totalUsuarios, usuariosOnline, conversasAtivas, mensagensHoje] = await Promise.all([
          Usuario.count({
            where: { id_instancia_chat: { [Op.in]: instanciaIds }, status: 'ativo' }
          }),
          Usuario.count({
            where: {
              id_instancia_chat: { [Op.in]: instanciaIds },
              status: 'ativo',
              ultimo_acesso: { [Op.gte]: cincoMinutosAtras }
            }
          }),
          Conversa.count({
            where: {
              id_instancia: { [Op.in]: instanciaIds },
              updated_at: { [Op.gte]: hoje }
            }
          }),
          Mensagem.count({
            where: {
              id_instancia: { [Op.in]: instanciaIds },
              created_at: { [Op.gte]: hoje }
            }
          })
        ]);

        return {
          id: empresa.id,
          nome: empresa.nome_fantasia,
          id_instancia: empresa.instancias[0]?.id || null,
          total_usuarios: totalUsuarios,
          usuarios_online: usuariosOnline,
          conversas_ativas: conversasAtivas,
          mensagens_hoje: mensagensHoje
        };
      }));

      return detalhes.sort((a, b) => b.mensagens_hoje - a.mensagens_hoje);
    } catch (error) {
      logger.error('Erro ao obter detalhes de empresas:', error);
      throw error;
    }
  }

  /**
   * Equipes mais ativas (Admin)
   */
  async equipesAtividade(idInstancia) {
    try {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      const equipes = await Equipe.findAll({
        where: { id_instancia: idInstancia },
        include: [
          {
            model: Usuario,
            as: 'membros',
            attributes: ['id'],
            include: [
              {
                model: Mensagem,
                as: 'mensagens',
                attributes: ['id'],
                where: {
                  created_at: { [Op.gte]: hoje }
                },
                required: false
              }
            ]
          }
        ]
      });

      const resultado = equipes.map(equipe => {
        const totalMensagens = equipe.membros.reduce((total, membro) => {
          return total + (membro.mensagens?.length || 0);
        }, 0);

        return {
          id: equipe.id,
          nome: equipe.nome,
          total_membros: equipe.membros.length,
          total_mensagens: totalMensagens
        };
      });

      return resultado.sort((a, b) => b.total_mensagens - a.total_mensagens);
    } catch (error) {
      logger.error('Erro ao obter atividade de equipes:', error);
      throw error;
    }
  }

  /**
   * Calcular taxa de resposta
   */
  async calcularTaxaResposta(idInstancia) {
    try {
      const umaHoraAtras = new Date(Date.now() - 60 * 60 * 1000);

      const totalMensagens = await Mensagem.count({
        where: {
          id_instancia: idInstancia,
          created_at: { [Op.gte]: umaHoraAtras }
        }
      });

      if (totalMensagens === 0) return 0;

      // Mensagens com resposta (simplificado: mensagens com status 'lida')
      const mensagensRespondidas = await Mensagem.count({
        where: {
          id_instancia: idInstancia,
          created_at: { [Op.gte]: umaHoraAtras },
          status_entrega: 'lida'
        }
      });

      return Math.round((mensagensRespondidas / totalMensagens) * 100);
    } catch (error) {
      logger.error('Erro ao calcular taxa de resposta:', error);
      return 0;
    }
  }

  /**
   * Top empresas mais ativas
   */
  async topEmpresasAtivas(limit = 5) {
    try {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      const empresas = await this.detalheEmpresas();
      return empresas.slice(0, limit);
    } catch (error) {
      logger.error('Erro ao obter top empresas:', error);
      throw error;
    }
  }

  /**
   * Relatório de acessos às conversas
   */
  async relatorioAcessosConversas(idInstancia, dataInicio = null, dataFim = null) {
    try {
      // Por enquanto, retornar mensagens como proxy de "acessos"
      // Futuramente: criar tabela conversas_acessos
      const where = {
        id_instancia: idInstancia
      };

      if (dataInicio) {
        where.created_at = { [Op.gte]: new Date(dataInicio) };
      }

      if (dataFim) {
        where.created_at = {
          ...where.created_at,
          [Op.lte]: new Date(dataFim)
        };
      }

      const mensagens = await Mensagem.findAll({
        where,
        include: [
          {
            model: Usuario,
            as: 'remetente',
            attributes: ['id', 'nome_completo', 'email']
          },
          {
            model: Conversa,
            as: 'conversa',
            attributes: ['id', 'nome_conversa', 'tipo_conversa']
          }
        ],
        order: [['created_at', 'DESC']],
        limit: 100
      });

      return mensagens;
    } catch (error) {
      logger.error('Erro ao gerar relatório de acessos:', error);
      throw error;
    }
  }

  /**
   * Horários de pico
   */
  async horariosPico(idInstancia, dias = 7) {
    try {
      const diasAtras = new Date(Date.now() - dias * 24 * 60 * 60 * 1000);

      const mensagens = await Mensagem.findAll({
        attributes: [
          [sequelize.fn('strftime', '%H', sequelize.col('created_at')), 'hora'],
          [sequelize.fn('strftime', '%w', sequelize.col('created_at')), 'dia_semana'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'total']
        ],
        where: {
          id_instancia: idInstancia,
          created_at: { [Op.gte]: diasAtras }
        },
        group: [
          sequelize.fn('strftime', '%H', sequelize.col('created_at')),
          sequelize.fn('strftime', '%w', sequelize.col('created_at'))
        ],
        raw: true
      });

      return mensagens;
    } catch (error) {
      logger.error('Erro ao obter horários de pico:', error);
      throw error;
    }
  }
}

module.exports = new EstatisticasService();

