import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import authService from '../services/authService';
import socketService from '../services/socketService';

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref(localStorage.getItem('token') || null);
  const usuario = ref(JSON.parse(localStorage.getItem('user') || 'null'));
  const loading = ref(false);
  const error = ref(null);

  // Getters
  const isAuthenticated = computed(() => !!token.value);
  const isSuperAdmin = computed(() => usuario.value?.nivel_permissao === 'super_admin');
  const isAdminCliente = computed(() => usuario.value?.nivel_permissao === 'admin_cliente');
  const isGestor = computed(() => usuario.value?.nivel_permissao === 'gestor');
  const isEquipe = computed(() => usuario.value?.nivel_permissao === 'equipe');

  // Actions
  async function login(email, senha) {
    loading.value = true;
    error.value = null;

    try {
      const response = await authService.login(email, senha);
      
      token.value = response.token;
      usuario.value = response.usuario;
      
      // Persistir
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.usuario));
      
      // Conectar Socket.IO
      socketService.connect(response.token);
      
      return response;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    loading.value = true;

    try {
      await authService.logout();
    } catch (err) {
      console.error('Erro no logout:', err);
    } finally {
      // Limpar estado
      token.value = null;
      usuario.value = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Desconectar Socket.IO
      socketService.disconnect();
      
      loading.value = false;
    }
  }

  async function fetchUsuario() {
    if (!token.value) return;

    try {
      const response = await authService.me();
      usuario.value = response;
      localStorage.setItem('user', JSON.stringify(response));
    } catch (err) {
      // Se falhar, fazer logout
      await logout();
    }
  }

  async function trocarSenha(senhaAtual, novaSenha) {
    loading.value = true;
    error.value = null;

    try {
      const response = await authService.trocarSenha(senhaAtual, novaSenha);
      
      // Atualizar usuario se forcar_troca_senha mudou
      if (usuario.value) {
        usuario.value.forcar_troca_senha = false;
        localStorage.setItem('user', JSON.stringify(usuario.value));
      }
      
      return response;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Auto-connect Socket.IO se já autenticado
  function initializeSocket() {
    if (token.value && !socketService.socket?.connected) {
      socketService.connect(token.value);
    }
  }

  return {
    // State
    token,
    usuario,
    loading,
    error,
    
    // Getters
    isAuthenticated,
    isSuperAdmin,
    isAdminCliente,
    isGestor,
    isEquipe,
    
    // Actions
    login,
    logout,
    fetchUsuario,
    trocarSenha,
    initializeSocket
  };
});

