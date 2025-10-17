<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <router-link to="/" class="logo">
        💬 Chat Interno
      </router-link>
    </div>

    <div class="navbar-menu">
      <div v-if="authStore.isAuthenticated" class="navbar-links">
        <router-link v-if="authStore.isSuperAdmin" to="/superadmin" class="nav-link">
          Super Admin
        </router-link>
        <router-link v-if="authStore.isAdminCliente" to="/admin" class="nav-link">
          Administração
        </router-link>
        <router-link to="/chat" class="nav-link">
          Chat
          <span v-if="chatStore.totalNaoLidas > 0" class="badge-notif">
            {{ chatStore.totalNaoLidas }}
          </span>
        </router-link>
      </div>

      <div v-if="authStore.isAuthenticated" class="navbar-user">
        <div class="user-info">
          <span class="user-name">{{ authStore.usuario?.nome_completo }}</span>
          <span class="user-role">{{ formatarRole(authStore.usuario?.nivel_permissao) }}</span>
        </div>
        <button @click="handleLogout" class="btn-logout">Sair</button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/auth';
import { useChatStore } from '../../store/chat';

const router = useRouter();
const authStore = useAuthStore();
const chatStore = useChatStore();

async function handleLogout() {
  await authStore.logout();
  chatStore.limpar();
  router.push('/login');
}

function formatarRole(role) {
  const roles = {
    super_admin: 'Super Administrador',
    admin_cliente: 'Administrador',
    gestor: 'Gestor',
    equipe: 'Usuário'
  };
  return roles[role] || role;
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navbar-brand .logo {
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: 600;
}

.navbar-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.navbar-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: background 0.2s;
  position: relative;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
}

.nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.2);
}

.badge-notif {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #dc3545;
  color: white;
  border-radius: 10px;
  padding: 0.15rem 0.4rem;
  font-size: 0.7rem;
  font-weight: bold;
}

.navbar-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.user-name {
  font-weight: 500;
  font-size: 0.95rem;
}

.user-role {
  font-size: 0.8rem;
  opacity: 0.9;
}

.btn-logout {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.btn-logout:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>

