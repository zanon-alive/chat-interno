'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    // 1. Criar Super Admin
    await queryInterface.bulkInsert('usuarios', [{
      id: 1,
      nome_completo: 'Super Administrador',
      email: 'admin@chatinterno.com',
      hash_senha: await bcrypt.hash('Admin@123456', 10),
      nivel_permissao: 'super_admin',
      status: 'ativo',
      id_instancia_chat: null,
      id_equipe: null,
      id_supervisor: null,
      forcar_troca_senha: false,
      created_at: now,
      updated_at: now
    }]);

    // 2. Criar Empresas de Demonstração
    await queryInterface.bulkInsert('empresas', [
      {
        id: 1,
        nome_cliente: 'Empresa Demo LTDA',
        cnpj: '12.345.678/0001-90',
        email_contato: 'contato@empresademo.com',
        telefone: '(11) 98765-4321',
        status: 'ativa',
        created_at: now,
        updated_at: now
      },
      {
        id: 2,
        nome_cliente: 'Tech Solutions SA',
        cnpj: '98.765.432/0001-10',
        email_contato: 'contato@techsolutions.com',
        telefone: '(21) 91234-5678',
        status: 'ativa',
        created_at: now,
        updated_at: now
      }
    ]);

    // 3. Criar Instâncias de Chat
    await queryInterface.bulkInsert('instancias_chat', [
      {
        id: 1,
        id_empresa: 1,
        nome_instancia: 'Chat Matriz',
        descricao: 'Instância principal da Empresa Demo',
        limite_usuarios: 50,
        status: 'ativa',
        created_at: now,
        updated_at: now
      },
      {
        id: 2,
        id_empresa: 1,
        nome_instancia: 'Chat Filial SP',
        descricao: 'Instância da filial de São Paulo',
        limite_usuarios: 30,
        status: 'ativa',
        created_at: now,
        updated_at: now
      },
      {
        id: 3,
        id_empresa: 2,
        nome_instancia: 'Tech Chat',
        descricao: 'Instância principal da Tech Solutions',
        limite_usuarios: 100,
        status: 'ativa',
        created_at: now,
        updated_at: now
      }
    ]);

    // 4. Criar Equipes
    await queryInterface.bulkInsert('equipes', [
      // Instância 1
      {
        id: 1,
        id_instancia_chat: 1,
        nome: 'Desenvolvimento',
        descricao: 'Equipe de desenvolvedores',
        created_at: now,
        updated_at: now
      },
      {
        id: 2,
        id_instancia_chat: 1,
        nome: 'Suporte',
        descricao: 'Equipe de suporte técnico',
        created_at: now,
        updated_at: now
      },
      {
        id: 3,
        id_instancia_chat: 1,
        nome: 'Vendas',
        descricao: 'Equipe comercial',
        created_at: now,
        updated_at: now
      },
      // Instância 3
      {
        id: 4,
        id_instancia_chat: 3,
        nome: 'Engineering',
        descricao: 'Engineering team',
        created_at: now,
        updated_at: now
      }
    ]);

    // 5. Criar Administradores das Instâncias e Usuários
    await queryInterface.bulkInsert('usuarios', [
      // Admin da Instância 1
      {
        id: 2,
        nome_completo: 'João Silva',
        email: 'joao.silva@empresademo.com',
        hash_senha: await bcrypt.hash('Admin@123456', 10),
        nivel_permissao: 'admin_cliente',
        status: 'ativo',
        id_instancia_chat: 1,
        id_equipe: null,
        id_supervisor: null,
        forcar_troca_senha: false,
        created_at: now,
        updated_at: now
      },
      // Gestor de Desenvolvimento
      {
        id: 3,
        nome_completo: 'Maria Santos',
        email: 'maria.santos@empresademo.com',
        hash_senha: await bcrypt.hash('User@123456', 10),
        nivel_permissao: 'gestor',
        status: 'ativo',
        id_instancia_chat: 1,
        id_equipe: 1,
        id_supervisor: 2,
        forcar_troca_senha: false,
        created_at: now,
        updated_at: now
      },
      // Usuário de Desenvolvimento
      {
        id: 4,
        nome_completo: 'Pedro Oliveira',
        email: 'pedro.oliveira@empresademo.com',
        hash_senha: await bcrypt.hash('User@123456', 10),
        nivel_permissao: 'equipe',
        status: 'ativo',
        id_instancia_chat: 1,
        id_equipe: 1,
        id_supervisor: 3,
        forcar_troca_senha: false,
        created_at: now,
        updated_at: now
      },
      // Usuário de Desenvolvimento
      {
        id: 5,
        nome_completo: 'Ana Costa',
        email: 'ana.costa@empresademo.com',
        hash_senha: await bcrypt.hash('User@123456', 10),
        nivel_permissao: 'equipe',
        status: 'ativo',
        id_instancia_chat: 1,
        id_equipe: 1,
        id_supervisor: 3,
        forcar_troca_senha: false,
        created_at: now,
        updated_at: now
      },
      // Gestor de Suporte
      {
        id: 6,
        nome_completo: 'Carlos Ferreira',
        email: 'carlos.ferreira@empresademo.com',
        hash_senha: await bcrypt.hash('User@123456', 10),
        nivel_permissao: 'gestor',
        status: 'ativo',
        id_instancia_chat: 1,
        id_equipe: 2,
        id_supervisor: 2,
        forcar_troca_senha: false,
        created_at: now,
        updated_at: now
      },
      // Usuário de Suporte
      {
        id: 7,
        nome_completo: 'Beatriz Lima',
        email: 'beatriz.lima@empresademo.com',
        hash_senha: await bcrypt.hash('User@123456', 10),
        nivel_permissao: 'equipe',
        status: 'ativo',
        id_instancia_chat: 1,
        id_equipe: 2,
        id_supervisor: 6,
        forcar_troca_senha: false,
        created_at: now,
        updated_at: now
      },
      // Admin da Instância 3
      {
        id: 8,
        nome_completo: 'Robert Johnson',
        email: 'robert.johnson@techsolutions.com',
        hash_senha: await bcrypt.hash('Admin@123456', 10),
        nivel_permissao: 'admin_cliente',
        status: 'ativo',
        id_instancia_chat: 3,
        id_equipe: null,
        id_supervisor: null,
        forcar_troca_senha: false,
        created_at: now,
        updated_at: now
      }
    ]);

    // 6. Criar algumas conversas de exemplo
    await queryInterface.bulkInsert('conversas', [
      {
        id: 1,
        id_instancia_chat: 1,
        tipo_conversa: 'individual',
        nome_conversa: null,
        created_at: now,
        updated_at: now
      },
      {
        id: 2,
        id_instancia_chat: 1,
        tipo_conversa: 'canal',
        nome_conversa: 'Canal Geral',
        created_at: now,
        updated_at: now
      },
      {
        id: 3,
        id_instancia_chat: 1,
        tipo_conversa: 'canal',
        nome_conversa: 'Canal Desenvolvimento',
        created_at: now,
        updated_at: now
      }
    ]);

    // 7. Criar participantes das conversas
    await queryInterface.bulkInsert('participantes_conversa', [
      // Conversa 1: Pedro e Ana (1-on-1)
      {
        id_conversa: 1,
        id_usuario: 4,
        joined_at: now,
        ultima_leitura: now
      },
      {
        id_conversa: 1,
        id_usuario: 5,
        joined_at: now,
        ultima_leitura: now
      },
      // Conversa 2: Canal Geral (todos da instância)
      {
        id_conversa: 2,
        id_usuario: 2,
        joined_at: now
      },
      {
        id_conversa: 2,
        id_usuario: 3,
        joined_at: now
      },
      {
        id_conversa: 2,
        id_usuario: 4,
        joined_at: now
      },
      {
        id_conversa: 2,
        id_usuario: 5,
        joined_at: now
      },
      {
        id_conversa: 2,
        id_usuario: 6,
        joined_at: now
      },
      {
        id_conversa: 2,
        id_usuario: 7,
        joined_at: now
      },
      // Conversa 3: Canal Desenvolvimento
      {
        id_conversa: 3,
        id_usuario: 3,
        joined_at: now
      },
      {
        id_conversa: 3,
        id_usuario: 4,
        joined_at: now
      },
      {
        id_conversa: 3,
        id_usuario: 5,
        joined_at: now
      }
    ]);

    // 8. Criar algumas mensagens de exemplo
    await queryInterface.bulkInsert('mensagens', [
      // Mensagens na conversa 1 (Pedro e Ana)
      {
        id_conversa: 1,
        id_remetente: 4,
        id_instancia_chat: 1,
        conteudo_texto: 'Oi Ana, tudo bem? Conseguiu revisar aquele código?',
        tipo_mensagem: 'texto',
        editada: false,
        created_at: new Date(now.getTime() - 3600000), // 1h atrás
        updated_at: new Date(now.getTime() - 3600000)
      },
      {
        id_conversa: 1,
        id_remetente: 5,
        id_instancia_chat: 1,
        conteudo_texto: 'Oi Pedro! Sim, já revisei. Ficou ótimo! Fiz alguns comentários no PR.',
        tipo_mensagem: 'texto',
        editada: false,
        created_at: new Date(now.getTime() - 3000000), // 50min atrás
        updated_at: new Date(now.getTime() - 3000000)
      },
      // Mensagens no Canal Geral
      {
        id_conversa: 2,
        id_remetente: 2,
        id_instancia_chat: 1,
        conteudo_texto: 'Bom dia a todos! Bem-vindos ao nosso chat interno.',
        tipo_mensagem: 'texto',
        editada: false,
        created_at: new Date(now.getTime() - 86400000), // 1 dia atrás
        updated_at: new Date(now.getTime() - 86400000)
      },
      {
        id_conversa: 2,
        id_remetente: 3,
        id_instancia_chat: 1,
        conteudo_texto: 'Pessoal, hoje teremos reunião às 15h.',
        tipo_mensagem: 'texto',
        editada: false,
        created_at: new Date(now.getTime() - 7200000), // 2h atrás
        updated_at: new Date(now.getTime() - 7200000)
      },
      // Mensagens no Canal Desenvolvimento
      {
        id_conversa: 3,
        id_remetente: 3,
        id_instancia_chat: 1,
        conteudo_texto: 'Equipe, vamos discutir a nova feature de chat em grupo.',
        tipo_mensagem: 'texto',
        editada: false,
        created_at: new Date(now.getTime() - 10800000), // 3h atrás
        updated_at: new Date(now.getTime() - 10800000)
      },
      {
        id_conversa: 3,
        id_remetente: 4,
        id_instancia_chat: 1,
        conteudo_texto: 'Boa ideia! Já comecei a trabalhar nisso.',
        tipo_mensagem: 'texto',
        editada: false,
        created_at: new Date(now.getTime() - 9000000), // 2.5h atrás
        updated_at: new Date(now.getTime() - 9000000)
      }
    ]);

    // 9. Criar permissões padrão
    await queryInterface.bulkInsert('permissoes_comunicacao', [
      // Permissão padrão para instância 1
      {
        id_instancia_chat: 1,
        id_usuario: null,
        id_equipe: 1,
        tipo_permissao: 'equipe',
        pode_comunicar_com: JSON.stringify({ 
          mesma_equipe: true, 
          supervisores: true, 
          admins: true 
        }),
        created_at: now,
        updated_at: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    // Deletar na ordem inversa devido às foreign keys
    await queryInterface.bulkDelete('mensagens', null, {});
    await queryInterface.bulkDelete('participantes_conversa', null, {});
    await queryInterface.bulkDelete('conversas', null, {});
    await queryInterface.bulkDelete('permissoes_comunicacao', null, {});
    await queryInterface.bulkDelete('usuarios', null, {});
    await queryInterface.bulkDelete('equipes', null, {});
    await queryInterface.bulkDelete('instancias_chat', null, {});
    await queryInterface.bulkDelete('empresas', null, {});
  }
};
