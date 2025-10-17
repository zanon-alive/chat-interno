<template>
  <div class="dashboard">
    <h1>Administrador do Cliente</h1>
    <p>Bem-vindo ao painel administrativo!</p>
    <div class="menu">
      <router-link to="/admin/equipes" class="btn">Gerenciar Equipes</router-link>
      <router-link to="/admin/usuarios" class="btn">Gerenciar Usuários</router-link>
      <router-link to="/chat" class="btn">Ir para o Chat</router-link>
      <button @click="handleLogout" class="btn btn-logout">Sair</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/auth';

const router = useRouter();
const authStore = useAuthStore();

async function handleLogout() {
  await authStore.logout();
  router.push('/login');
}
</script>

<style scoped>
.dashboard {
  padding: 2rem;
}

h1 {
  margin-bottom: 1rem;
}

.menu {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.btn:hover {
  background: #5568d3;
}

.btn-logout {
  background: #dc3545;
}
</style>

