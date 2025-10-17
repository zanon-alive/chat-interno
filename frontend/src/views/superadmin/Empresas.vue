<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Gerenciar Empresas</h1>
        <p>Cadastre e gerencie empresas clientes do sistema</p>
      </div>
      <div class="header-actions">
        <Button @click="abrirModalCriar">+ Nova Empresa</Button>
        <Button variant="secondary" @click="$router.push('/superadmin')">← Voltar</Button>
      </div>
    </div>

    <div class="filters">
      <input 
        v-model="filtros.nome" 
        type="text" 
        placeholder="Buscar por nome..."
        @input="carregarEmpresas"
      />
      <select v-model="filtros.status" @change="carregarEmpresas">
        <option value="">Todos os status</option>
        <option value="ativa">Ativa</option>
        <option value="inativa">Inativa</option>
        <option value="suspensa">Suspensa</option>
      </select>
    </div>

    <Table
      :columns="colunas"
      :data="empresas"
      :loading="loading"
      empty-message="Nenhuma empresa cadastrada"
    >
      <template #cell-status="{ item }">
        <span :class="['status-badge', `status-${item.status}`]">
          {{ item.status }}
        </span>
      </template>

      <template #cell-instancias="{ item }">
        {{ item.instancias?.length || 0 }}
      </template>

      <template #actions="{ item }">
        <Button variant="secondary" @click="editar(item)" size="sm">Editar</Button>
        <Button variant="danger" @click="deletar(item)" size="sm">Deletar</Button>
      </template>
    </Table>

    <Modal v-model="showModal" :title="empresaEdicao ? 'Editar Empresa' : 'Nova Empresa'">
      <form @submit.prevent="salvar">
        <div class="form-group">
          <label>Nome da Empresa *</label>
          <input v-model="form.nome_cliente" type="text" required />
        </div>

        <div class="form-group">
          <label>CNPJ *</label>
          <input 
            v-model="form.cnpj" 
            type="text" 
            placeholder="XX.XXX.XXX/XXXX-XX"
            required
            maxlength="18"
          />
        </div>

        <div class="form-group">
          <label>Email de Contato *</label>
          <input v-model="form.email_contato" type="email" required />
        </div>

        <div class="form-group">
          <label>Telefone</label>
          <input v-model="form.telefone" type="tel" placeholder="(XX) XXXXX-XXXX" />
        </div>

        <div class="form-group">
          <label>Status</label>
          <select v-model="form.status">
            <option value="ativa">Ativa</option>
            <option value="inativa">Inativa</option>
            <option value="suspensa">Suspensa</option>
          </select>
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
import { useRouter } from 'vue-router';
import Button from '../../components/common/Button.vue';
import Modal from '../../components/common/Modal.vue';
import Table from '../../components/common/Table.vue';
import empresaService from '../../services/empresaService';

const router = useRouter();

const empresas = ref([]);
const loading = ref(false);
const showModal = ref(false);
const empresaEdicao = ref(null);
const salvando = ref(false);
const error = ref(null);

const filtros = ref({
  nome: '',
  status: ''
});

const form = ref({
  nome_cliente: '',
  cnpj: '',
  email_contato: '',
  telefone: '',
  status: 'ativa'
});

const colunas = [
  { key: 'nome_cliente', label: 'Nome' },
  { key: 'cnpj', label: 'CNPJ' },
  { key: 'email_contato', label: 'Email' },
  { key: 'telefone', label: 'Telefone' },
  { key: 'status', label: 'Status' },
  { key: 'instancias', label: 'Instâncias' }
];

onMounted(async () => {
  await carregarEmpresas();
});

async function carregarEmpresas() {
  loading.value = true;
  try {
    const response = await empresaService.listar(filtros.value);
    empresas.value = response.data;
  } catch (err) {
    console.error('Erro ao carregar empresas:', err);
    error.value = err;
  } finally {
    loading.value = false;
  }
}

function abrirModalCriar() {
  empresaEdicao.value = null;
  form.value = {
    nome_cliente: '',
    cnpj: '',
    email_contato: '',
    telefone: '',
    status: 'ativa'
  };
  error.value = null;
  showModal.value = true;
}

function editar(empresa) {
  empresaEdicao.value = empresa;
  form.value = {
    nome_cliente: empresa.nome_cliente,
    cnpj: empresa.cnpj,
    email_contato: empresa.email_contato,
    telefone: empresa.telefone,
    status: empresa.status
  };
  error.value = null;
  showModal.value = true;
}

async function salvar() {
  salvando.value = true;
  error.value = null;

  try {
    if (empresaEdicao.value) {
      await empresaService.atualizar(empresaEdicao.value.id, form.value);
    } else {
      await empresaService.criar(form.value);
    }

    showModal.value = false;
    await carregarEmpresas();
  } catch (err) {
    error.value = err;
  } finally {
    salvando.value = false;
  }
}

async function deletar(empresa) {
  if (!confirm(`Tem certeza que deseja deletar a empresa "${empresa.nome_cliente}"?`)) {
    return;
  }

  try {
    await empresaService.deletar(empresa.id);
    await carregarEmpresas();
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
  background-color: #f5f5f5;
  min-height: calc(100vh - 70px);
}

@media (max-width: 768px) {
  .page {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    gap: 1rem;
  }

  .header-actions {
    width: 100%;
    flex-direction: column;
  }

  .filters {
    flex-direction: column;
  }

  .filters input,
  .filters select {
    max-width: 100%;
  }
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

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.filters input,
.filters select {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
}

.filters input {
  flex: 1;
  max-width: 300px;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-ativa {
  background-color: #d4edda;
  color: #155724;
}

.status-inativa {
  background-color: #f8d7da;
  color: #721c24;
}

.status-suspensa {
  background-color: #fff3cd;
  color: #856404;
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
.form-group select {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
}

.form-group input:focus,
.form-group select:focus {
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
