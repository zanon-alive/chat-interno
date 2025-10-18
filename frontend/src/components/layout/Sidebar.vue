<template>
  <aside class="sidebar" :class="{ 'sidebar-collapsed': collapsed }">
    <button class="sidebar-toggle" @click="toggleSidebar">
      {{ collapsed ? '→' : '←' }}
    </button>

    <nav class="sidebar-nav">
      <!-- Menu Principal -->
      <div class="nav-section">
        <h4 v-if="!collapsed" class="section-title">Principal</h4>
        <router-link 
          v-for="item in menuPrincipal" 
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :title="item.label"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span v-if="!collapsed" class="nav-label">{{ item.label }}</span>
          <span v-if="item.badge && !collapsed" class="nav-badge">{{ item.badge }}</span>
        </router-link>
      </div>

      <!-- Menu Gestão -->
      <div v-if="menuGestao.length > 0" class="nav-section">
        <h4 v-if="!collapsed" class="section-title">Gestão</h4>
        <router-link 
          v-for="item in menuGestao" 
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :title="item.label"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span v-if="!collapsed" class="nav-label">{{ item.label }}</span>
        </router-link>
      </div>

      <!-- Menu Relatórios -->
      <div v-if="menuRelatorios.length > 0" class="nav-section">
        <h4 v-if="!collapsed" class="section-title">Relatórios</h4>
        <router-link 
          v-for="item in menuRelatorios" 
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :title="item.label"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span v-if="!collapsed" class="nav-label">{{ item.label }}</span>
        </router-link>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '../../store/auth';
import { useChatStore } from '../../store/chat';

const authStore = useAuthStore();
const chatStore = useChatStore();
const collapsed = ref(false);

function toggleSidebar() {
  collapsed.value = !collapsed.value;
}

// Menu dinâmico baseado no role
const menuPrincipal = computed(() => {
  const items = [];
  
  if (authStore.isSuperAdmin) {
    items.push(
      { path: '/superadmin', icon: '📊', label: 'Dashboard' },
      { path: '/chat', icon: '💬', label: 'Chat', badge: chatStore.totalNaoLidas > 0 ? chatStore.totalNaoLidas : null }
    );
  } else if (authStore.isAdminCliente) {
    items.push(
      { path: '/admin', icon: '📊', label: 'Dashboard' },
      { path: '/chat', icon: '💬', label: 'Chat', badge: chatStore.totalNaoLidas > 0 ? chatStore.totalNaoLidas : null }
    );
  } else {
    items.push(
      { path: '/chat', icon: '💬', label: 'Chat', badge: chatStore.totalNaoLidas > 0 ? chatStore.totalNaoLidas : null }
    );
  }
  
  return items;
});

const menuGestao = computed(() => {
  const items = [];
  
  if (authStore.isSuperAdmin) {
    items.push(
      { path: '/superadmin/empresas', icon: '🏢', label: 'Empresas' },
      { path: '/superadmin/instancias', icon: '🔧', label: 'Instâncias' }
    );
  } else if (authStore.isAdminCliente) {
    items.push(
      { path: '/admin/usuarios', icon: '👥', label: 'Usuários' },
      { path: '/admin/equipes', icon: '👥', label: 'Equipes' },
      { path: '/admin/tema', icon: '🎨', label: 'Personalização' }
    );
  }
  
  return items;
});

const menuRelatorios = computed(() => {
  const items = [];
  
  if (authStore.isAdminCliente) {
    items.push(
      { path: '/admin/relatorios/acessos', icon: '📊', label: 'Acessos' },
      { path: '/admin/relatorios/equipes', icon: '👥', label: 'Equipes' },
      { path: '/admin/relatorios/horarios', icon: '⏰', label: 'Horários de Pico' }
    );
  }
  
  return items;
});

defineExpose({ collapsed, toggleSidebar });
</script>

<style scoped>
.sidebar {
  width: 260px;
  background: var(--cor-fundo-secundario);
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: relative;
  min-height: calc(100vh - 70px);
}

.sidebar-collapsed {
  width: 70px;
}

.sidebar-toggle {
  position: absolute;
  top: 1rem;
  right: -12px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--cor-primaria);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.sidebar-toggle:hover {
  background: var(--cor-primaria-hover);
}

.sidebar-nav {
  flex: 1;
  padding: 2rem 0;
  overflow-y: auto;
}

.nav-section {
  margin-bottom: 2rem;
}

.section-title {
  padding: 0 1.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--cor-texto-secundaria);
  letter-spacing: 0.5px;
}

.sidebar-collapsed .section-title {
  display: none;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  color: var(--cor-texto-primaria);
  text-decoration: none;
  transition: all 0.2s;
  position: relative;
  border-left: 3px solid transparent;
}

.sidebar-collapsed .nav-item {
  justify-content: center;
  padding: 0.75rem;
}

.nav-item:hover {
  background: var(--cor-fundo);
  border-left-color: var(--cor-primaria);
}

.nav-item.router-link-active {
  background: linear-gradient(90deg, rgba(102, 126, 234, 0.1) 0%, transparent 100%);
  border-left-color: var(--cor-primaria);
  color: var(--cor-primaria);
  font-weight: 600;
}

.nav-icon {
  font-size: 1.2rem;
  min-width: 24px;
  text-align: center;
}

.nav-label {
  flex: 1;
  font-size: 0.95rem;
}

.sidebar-collapsed .nav-label {
  display: none;
}

.nav-badge {
  background: var(--cor-erro);
  color: white;
  padding: 0.15rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.sidebar-collapsed .nav-badge {
  position: absolute;
  top: 5px;
  right: 5px;
  padding: 0.15rem 0.4rem;
  font-size: 0.7rem;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 70px;
    bottom: 0;
    z-index: 999;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .sidebar.sidebar-open {
    transform: translateX(0);
  }

  .sidebar-collapsed {
    width: 260px;
  }
}
</style>

