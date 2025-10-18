<template>
  <div class="dashboard-layout">
    <Sidebar v-if="showSidebar" ref="sidebarRef" />
    
    <main class="dashboard-main" :class="{ 'full-width': !showSidebar }">
      <div class="dashboard-content">
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../../store/auth';
import Sidebar from './Sidebar.vue';

const route = useRoute();
const authStore = useAuthStore();
const sidebarRef = ref(null);

// Mostrar sidebar apenas em páginas de admin/superadmin
const showSidebar = computed(() => {
  const path = route.path;
  return (
    path.startsWith('/admin') || 
    path.startsWith('/superadmin')
  ) && authStore.isAuthenticated;
});
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: calc(100vh - 70px);
  background: var(--cor-fundo);
}

.dashboard-main {
  flex: 1;
  overflow-x: hidden;
}

.dashboard-main.full-width {
  width: 100%;
}

.dashboard-content {
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .dashboard-content {
    padding: 1rem;
  }
}
</style>

