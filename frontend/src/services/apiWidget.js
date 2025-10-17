/**
 * API Service para Widget
 * Versão sem redirecionamento para não interferir com sistema hospedeiro
 */
import axios from 'axios';

const apiWidget = axios.create({
  baseURL: window.__CHAT_API_URL__ || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - adiciona token
apiWidget.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - SEM redirecionamento!
apiWidget.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      // Log do erro mas NÃO redireciona
      if (status === 401) {
        console.warn('⚠️ Widget: Token inválido ou expirado');
        // NÃO fazer: router.push('/login')
        // O widget apenas lança o erro para tratamento local
      } else if (status === 403) {
        console.warn('⚠️ Widget: Acesso negado');
      } else if (status === 404) {
        console.warn('⚠️ Widget: Recurso não encontrado');
      } else if (status >= 500) {
        console.error('❌ Widget: Erro no servidor');
      }
      
      // Retornar erro com mensagem amigável
      return Promise.reject({
        message: data?.error || data?.message || 'Erro ao comunicar com o servidor',
        status,
        data
      });
    }
    
    if (error.request) {
      // Requisição feita mas sem resposta (servidor offline)
      console.warn('⚠️ Widget: Servidor não respondeu');
      return Promise.reject({
        message: 'Servidor não disponível. Verifique sua conexão.',
        status: 0
      });
    }
    
    // Erro na configuração da requisição
    console.error('❌ Widget: Erro na requisição', error.message);
    return Promise.reject({
      message: error.message || 'Erro desconhecido',
      status: -1
    });
  }
);

export default apiWidget;

