<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <router-link :to="homeRoute" class="logo">
        <img v-if="logo" :src="logo.url" :width="logo.width" :height="logo.height" alt="Logo" class="logo-img" />
        <span v-else>💬 Chat Interno</span>
      </router-link>
    </div>

    <div class="navbar-menu">
      <div v-if="authStore.isAuthenticated" class="navbar-links">
        <router-link v-if="authStore.isSuperAdmin" to="/superadmin" class="nav-link">
          📊 Dashboard
        </router-link>
        <router-link v-if="authStore.isAdminCliente" to="/admin" class="nav-link">
          📊 Dashboard
        </router-link>
        <router-link to="/chat" class="nav-link">
          💬 Chat
          <span v-if="chatStore.totalNaoLidas > 0" class="badge-notif">
            {{ chatStore.totalNaoLidas }}
          </span>
        </router-link>
        
        <!-- Dropdown Configurações -->
        <div v-if="authStore.isAdminCliente || authStore.isSuperAdmin" class="dropdown">
          <button class="nav-link dropdown-toggle" @click="toggleDropdown">
            ⚙️ Configurações
          </button>
          <div v-if="showDropdown" class="dropdown-menu">
            <router-link v-if="authStore.isAdminCliente" to="/admin/tema" class="dropdown-item" @click="showDropdown = false">
              🎨 Personalização Visual
            </router-link>
            <router-link v-if="authStore.isAdminCliente" to="/admin/usuarios" class="dropdown-item" @click="showDropdown = false">
              👥 Usuários
            </router-link>
            <router-link v-if="authStore.isAdminCliente" to="/admin/equipes" class="dropdown-item" @click="showDropdown = false">
              👥 Equipes
            </router-link>
            <router-link v-if="authStore.isSuperAdmin" to="/superadmin/empresas" class="dropdown-item" @click="showDropdown = false">
              🏢 Empresas
            </router-link>
            <router-link v-if="authStore.isSuperAdmin" to="/superadmin/instancias" class="dropdown-item" @click="showDropdown = false">
              🔧 Instâncias
            </router-link>
          </div>
        </div>
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
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/auth';
import { useChatStore } from '../../store/chat';
import { useTheme } from '../../composables/useTheme';

const router = useRouter();
const authStore = useAuthStore();
const chatStore = useChatStore();
const { logo } = useTheme();

const showDropdown = ref(false);

// Home route dinâmica baseada no role do usuário
const homeRoute = computed(() => {
  if (!authStore.isAuthenticated) return '/login';
  if (authStore.isSuperAdmin) return '/superadmin';
  if (authStore.isAdminCliente) return '/admin';
  return '/chat';
});

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

// Fechar dropdown ao clicar fora
if (typeof window !== 'undefined') {
  window.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
      showDropdown.value = false;
    }
  });
}

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
  min-height: 70px;
}

@media (max-width: 768px) {
  .navbar {
    padding: 0.75rem 1rem;
    min-height: 60px;
  }

  .navbar-brand .logo {
    font-size: 1.2rem;
  }

  .navbar-menu {
    gap: 1rem;
  }

  .navbar-links {
    gap: 0.75rem;
  }

  .nav-link {
    padding: 0.4rem 0.75rem;
    font-size: 0.9rem;
  }

  .user-name {
    display: none;
  }

  .user-role {
    font-size: 0.75rem;
  }
}

.navbar-brand .logo {
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-img {
  object-fit: contain;
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

/* Dropdown */
.dropdown {
  position: relative;
}

.dropdown-toggle {
  cursor: pointer;
  background: transparent;
  border: none;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 220px;
  z-index: 1000;
  overflow: hidden;
}

.dropdown-item {
  display: block;
  padding: 0.75rem 1rem;
  color: var(--cor-texto-primaria);
  text-decoration: none;
  transition: background 0.2s;
}

.dropdown-item:hover {
  background: var(--cor-fundo);
}
</style>

