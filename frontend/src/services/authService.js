import api from './api';

export default {
  async login(email, senha) {
    const response = await api.post('/auth/login', { email, senha });
    return response.data;
  },

  async me() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async trocarSenha(senhaAtual, novaSenha) {
    const response = await api.post('/auth/trocar-senha', {
      senha_atual: senhaAtual,
      nova_senha: novaSenha
    });
    return response.data;
  },

  async logout() {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return response.data;
  }
};

