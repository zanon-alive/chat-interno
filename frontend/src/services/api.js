import axios from 'axios';

// Criar instância do axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - adicionar token
api.interceptors.request.use(
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

// Response interceptor - tratar erros
api.interceptors.response.use(
  (response) => response.data, // Retornar apenas data
  (error) => {
    if (error.response) {
      // Erro da API
      const { status, data } = error.response;
      
      // Se 401, limpar auth e redirecionar para login
      if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      // Retornar mensagem de erro
      return Promise.reject(data.error || 'Erro na requisição');
    }
    
    // Erro de rede
    return Promise.reject('Erro de conexão com o servidor');
  }
);

export default api;

