<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Gerenciar Equipes</h1>
        <p>Organize usuários em equipes e setores</p>
      </div>
      <div class="header-actions">
        <Button @click="abrirModalCriar">+ Nova Equipe</Button>
        <Button variant="secondary" @click="$router.push('/admin')">← Voltar</Button>
      </div>
    </div>

    <Table
      :columns="colunas"
      :data="equipes"
      :loading="loading"
      empty-message="Nenhuma equipe cadastrada"
    >
      <template #cell-membros="{ item }">
        {{ item.total_membros || 0 }} membros
      </template>

      <template #actions="{ item }">
        <Button variant="secondary" @click="editar(item)" size="sm">Editar</Button>
        <Button variant="danger" @click="deletar(item)" size="sm">Deletar</Button>
      </template>
    </Table>

    <Modal v-model="showModal" :title="equipeEdicao ? 'Editar Equipe' : 'Nova Equipe'">
      <form @submit.prevent="salvar">
        <div class="form-group">
          <label>Nome da Equipe *</label>
          <input v-model="form.nome" type="text" required />
        </div>

        <div class="form-group">
          <label>Descrição</label>
          <textarea v-model="form.descricao" rows="3"></textarea>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </form>

      <template #footer>
        <Button variant="secondary" @click="showModal = false">Cancelar</Button>
        <Button @click="salvar" :loading="salvando">Salvar</Button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Button from '../../components/common/Button.vue';
import Modal from '../../components/common/Modal.vue';
import Table from '../../components/common/Table.vue';
import equipeService from '../../services/equipeService';

const equipes = ref([]);
const loading = ref(false);
const showModal = ref(false);
const equipeEdicao = ref(null);
const salvando = ref(false);
const error = ref(null);

const form = ref({
  nome: '',
  descricao: ''
});

const colunas = [
  { key: 'nome', label: 'Nome' },
  { key: 'descricao', label: 'Descrição' },
  { key: 'membros', label: 'Membros' }
];

onMounted(async () => {
  await carregarEquipes();
});

async function carregarEquipes() {
  loading.value = true;
  try {
    const response = await equipeService.listar();
    equipes.value = response.data;
  } catch (err) {
    console.error('Erro ao carregar equipes:', err);
  } finally {
    loading.value = false;
  }
}

function abrirModalCriar() {
  equipeEdicao.value = null;
  form.value = { nome: '', descricao: '' };
  error.value = null;
  showModal.value = true;
}

function editar(equipe) {
  equipeEdicao.value = equipe;
  form.value = {
    nome: equipe.nome,
    descricao: equipe.descricao || ''
  };
  error.value = null;
  showModal.value = true;
}

async function salvar() {
  salvando.value = true;
  error.value = null;

  try {
    if (equipeEdicao.value) {
      await equipeService.atualizar(equipeEdicao.value.id, form.value);
    } else {
      await equipeService.criar(form.value);
    }

    showModal.value = false;
    await carregarEquipes();
  } catch (err) {
    error.value = err;
  } finally {
    salvando.value = false;
  }
}

async function deletar(equipe) {
  if (!confirm(`Tem certeza que deseja deletar "${equipe.nome}"?`)) {
    return;
  }

  try {
    await equipeService.deletar(equipe.id);
    await carregarEquipes();
  } catch (err) {
    alert('Erro ao deletar: ' + err);
  }
}
</script>

<style scoped>
.page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.page-header h1 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.page-header p {
  margin: 0;
  color: #666;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.error-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #fee;
  color: #c33;
  border-radius: 6px;
  font-size: 0.9rem;
}
</style>
