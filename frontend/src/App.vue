<template>
  <div id="app">
    <MainLayout>
      <router-view />
    </MainLayout>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useAuthStore } from './store/auth';
import { useTheme } from './composables/useTheme';
import MainLayout from './components/layout/MainLayout.vue';

const authStore = useAuthStore();
const { carregarTema } = useTheme();

onMounted(() => {
  // Inicializar Socket.IO se já autenticado
  authStore.initializeSocket();
  
  // Carregar tema da instância
  carregarTema();
});

// Recarregar tema quando usuário fizer login
watch(() => authStore.usuario, (usuario) => {
  if (usuario) {
    console.log('👤 Usuário logado, carregando tema...');
    carregarTema();
  }
});
</script>

<style>
:root {
  /* Cores padrão (serão sobrescritas pelo tema) */
  --cor-primaria: #667eea;
  --cor-primaria-hover: #5568d3;
  --cor-secundaria: #764ba2;
  --cor-fundo: #f7fafc;
  --cor-fundo-secundario: #ffffff;
  --cor-texto-primaria: #2d3748;
  --cor-texto-secundaria: #718096;
  --cor-mensagem-enviada: #667eea;
  --cor-mensagem-recebida: #e2e8f0;
  --cor-sucesso: #48bb78;
  --cor-erro: #f56565;
  --cor-alerta: #ed8936;
  --cor-info: #4299e1;
  --fonte-principal: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  --border-radius: 8px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: var(--fonte-principal);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  min-height: 100vh;
  background-color: var(--cor-fundo);
  color: var(--cor-texto-primaria);
}

/* Botões usam cores do tema */
button, .btn {
  border-radius: var(--border-radius);
}

.btn-primary {
  background-color: var(--cor-primaria);
  color: white;
}

.btn-primary:hover {
  background-color: var(--cor-primaria-hover);
}

.btn-success {
  background-color: var(--cor-sucesso);
}

.btn-error {
  background-color: var(--cor-erro);
}

.btn-warning {
  background-color: var(--cor-alerta);
}

.btn-info {
  background-color: var(--cor-info);
}

/* Cards e containers */
.card, .modal-content {
  background-color: var(--cor-fundo-secundario);
  border-radius: var(--border-radius);
}

/* Links */
a {
  color: var(--cor-primaria);
}

a:hover {
  color: var(--cor-primaria-hover);
}
</style>
