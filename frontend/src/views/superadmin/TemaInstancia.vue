<template>
  <DashboardLayout>
    <div class="tema-instancia">
      <div class="header">
        <h1>🎨 Editar Tema da Instância</h1>
        <router-link to="/superadmin" class="btn-voltar">← Voltar</router-link>
      </div>

      <div v-if="carregando" class="loading">
        <span>⏳ Carregando configurações...</span>
      </div>

      <div v-else class="tema-content">
        <ConfiguracaoTema 
          :instancia-id="instanciaId" 
          :super-admin="true"
        />
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import DashboardLayout from '../../components/layout/DashboardLayout.vue';
import ConfiguracaoTema from '../../components/admin/ConfiguracaoTema.vue';

const route = useRoute();
const instanciaId = ref(null);
const carregando = ref(true);

onMounted(() => {
  instanciaId.value = parseInt(route.params.id);
  carregando.value = false;
});
</script>

<style scoped>
.tema-instancia {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2rem;
  color: var(--cor-texto-primaria);
}

.btn-voltar {
  padding: 0.75rem 1.5rem;
  background: var(--cor-texto-secundaria);
  color: white;
  text-decoration: none;
  border-radius: var(--border-radius);
  font-weight: 600;
  transition: background 0.2s;
}

.btn-voltar:hover {
  background: var(--cor-texto-primaria);
}

.loading {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
}
</style>

