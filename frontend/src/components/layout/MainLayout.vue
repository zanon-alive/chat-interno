<template>
  <div class="main-layout">
    <Navbar v-if="!hideNavbar" />
    <main class="main-content">
      <slot></slot>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from './Navbar.vue';

const route = useRoute();

const hideNavbar = computed(() => {
  // Ocultar navbar na página de login
  return route.path === '/login';
});
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  overflow: auto;
}
</style>

