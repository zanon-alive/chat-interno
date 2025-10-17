<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Gerenciar Instâncias de Chat</h1>
        <p>Criar e configurar instâncias para as empresas</p>
      </div>
      <div class="header-actions">
        <Button @click="abrirModalCriar">+ Nova Instância</Button>
        <Button variant="secondary" @click="$router.push('/superadmin')">← Voltar</Button>
      </div>
    </div>

    <Table
      :columns="colunas"
      :data="instancias"
      :loading="loading"
      empty-message="Nenhuma instância cadastrada"
    >
      <template #cell-empresa="{ item }">
        {{ item.empresa?.nome_cliente }}
      </template>

      <template #cell-limite="{ item }">
        {{ item.usuarios_ativos || 0 }} / {{ item.limite_usuarios }}
        <span class="percentual">({{ calcularPercentual(item) }}%)</span>
      </template>

      <template #cell-status="{ item }">
        <span :class="['status-badge', `status-${item.status}`]">
          {{ item.status }}
        </span>
      </template>

      <template #actions="{ item }">
        <Button variant="secondary" @click="editar(item)" size="sm">Editar</Button>
        <Button variant="danger" @click="deletar(item)" size="sm">Deletar</Button>
      </template>
    </Table>

    <Modal v-model="showModal" :title="instanciaEdicao ? 'Editar Instância' : 'Nova Instância'">
      <form @submit.prevent="salvar">
        <div class="form-group">
          <label>Empresa *</label>
          <select v-model="form.id_empresa" required :disabled="!!instanciaEdicao">
            <option value="">Selecione uma empresa</option>
            <option v-for="emp in empresas" :key="emp.id" :value="emp.id">
              {{ emp.nome_cliente }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Nome da Instância *</label>
          <input v-model="form.nome_instancia" type="text" required />
        </div>

        <div class="form-group">
          <label>Descrição</label>
          <textarea v-model="form.descricao" rows="3"></textarea>
        </div>

        <div class="form-group">
          <label>Limite de Usuários *</label>
          <input v-model.number="form.limite_usuarios" type="number" min="1" required />
        </div>

        <div class="form-group">
          <label>Status</label>
          <select v-model="form.status">
            <option value="ativa">Ativa</option>
            <option value="suspensa">Suspensa</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>

        <div v-if="!instanciaEdicao" class="admin-section">
          <h4>Administrador Inicial</h4>
          <div class="form-group">
            <label>Nome Completo *</label>
            <input v-model="form.admin_inicial.nome_completo" type="text" required />
          </div>
          <div class="form-group">
            <label>Email *</label>
            <input v-model="form.admin_inicial.email" type="email" required />
          </div>
          <div class="form-group">
            <label>Senha Inicial</label>
            <input v-model="form.admin_inicial.senha" type="password" placeholder="Admin@123456 (padrão)" />
          </div>
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
import instanciaService from '../../services/instanciaService';
import empresaService from '../../services/empresaService';

const router = useRouter();

const instancias = ref([]);
const empresas = ref([]);
const loading = ref(false);
const showModal = ref(false);
const instanciaEdicao = ref(null);
const salvando = ref(false);
const error = ref(null);

const filtros = ref({
  nome: '',
  status: ''
});

const form = ref({
  id_empresa: '',
  nome_instancia: '',
  descricao: '',
  limite_usuarios: 50,
  status: 'ativa',
  admin_inicial: {
    nome_completo: '',
    email: '',
    senha: ''
  }
});

const colunas = [
  { key: 'nome_instancia', label: 'Nome' },
  { key: 'empresa', label: 'Empresa' },
  { key: 'limite', label: 'Usuários (Uso)' },
  { key: 'status', label: 'Status' }
];

onMounted(async () => {
  await Promise.all([carregarInstancias(), carregarEmpresas()]);
});

async function carregarInstancias() {
  loading.value = true;
  try {
    const response = await instanciaService.listar(filtros.value);
    instancias.value = response.data;
  } catch (err) {
    console.error('Erro ao carregar instâncias:', err);
  } finally {
    loading.value = false;
  }
}

async function carregarEmpresas() {
  try {
    const response = await empresaService.listar();
    empresas.value = response.data;
  } catch (err) {
    console.error('Erro ao carregar empresas:', err);
  }
}

function abrirModalCriar() {
  instanciaEdicao.value = null;
  form.value = {
    id_empresa: '',
    nome_instancia: '',
    descricao: '',
    limite_usuarios: 50,
    status: 'ativa',
    admin_inicial: {
      nome_completo: '',
      email: '',
      senha: ''
    }
  };
  error.value = null;
  showModal.value = true;
}

function editar(instancia) {
  instanciaEdicao.value = instancia;
  form.value = {
    id_empresa: instancia.id_empresa,
    nome_instancia: instancia.nome_instancia,
    descricao: instancia.descricao,
    limite_usuarios: instancia.limite_usuarios,
    status: instancia.status,
    admin_inicial: {
      nome_completo: '',
      email: '',
      senha: ''
    }
  };
  error.value = null;
  showModal.value = true;
}

async function salvar() {
  salvando.value = true;
  error.value = null;

  try {
    if (instanciaEdicao.value) {
      const { admin_inicial, ...dados } = form.value;
      await instanciaService.atualizar(instanciaEdicao.value.id, dados);
    } else {
      await instanciaService.criar(form.value);
    }

    showModal.value = false;
    await carregarInstancias();
  } catch (err) {
    error.value = err;
  } finally {
    salvando.value = false;
  }
}

async function deletar(instancia) {
  if (!confirm(`Tem certeza que deseja deletar "${instancia.nome_instancia}"?`)) {
    return;
  }

  try {
    await instanciaService.deletar(instancia.id);
    await carregarInstancias();
  } catch (err) {
    alert('Erro ao deletar: ' + err);
  }
}

function calcularPercentual(instancia) {
  const uso = instancia.usuarios_ativos || 0;
  const limite = instancia.limite_usuarios;
  return ((uso / limite) * 100).toFixed(0);
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

.status-suspensa {
  background-color: #fff3cd;
  color: #856404;
}

.status-cancelada {
  background-color: #f8d7da;
  color: #721c24;
}

.percentual {
  color: #999;
  font-size: 0.85rem;
  margin-left: 0.25rem;
}

.admin-section {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.admin-section h4 {
  margin-bottom: 1rem;
  color: #667eea;
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
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
}

.form-group input:focus,
.form-group select:focus,
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
