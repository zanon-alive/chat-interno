<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1>Gerenciar Usuários</h1>
        <p>Cadastre e configure usuários da instância</p>
        <div v-if="stats" class="stats">
          <span class="stat-item">
            <strong>{{ stats.usuarios_ativos }}</strong> / {{ stats.limite_usuarios }} usuários
            <span class="percentual">({{ stats.percentual_uso }}% de uso)</span>
          </span>
          <span class="stat-item vagas">
            {{ stats.vagas_disponiveis }} vagas disponíveis
          </span>
        </div>
      </div>
      <div class="header-actions">
        <Button @click="abrirModalCriar" :disabled="!temVagasDisponiveis">
          + Novo Usuário
        </Button>
        <Button variant="secondary" @click="$router.push('/admin')">← Voltar</Button>
      </div>
    </div>

    <div class="filters">
      <input 
        v-model="filtros.nome" 
        type="text" 
        placeholder="Buscar por nome..."
        @input="carregarUsuarios"
      />
      <select v-model="filtros.status" @change="carregarUsuarios">
        <option value="">Todos os status</option>
        <option value="ativo">Ativo</option>
        <option value="inativo">Inativo</option>
      </select>
      <select v-model="filtros.id_equipe" @change="carregarUsuarios">
        <option value="">Todas as equipes</option>
        <option v-for="equipe in equipes" :key="equipe.id" :value="equipe.id">
          {{ equipe.nome }}
        </option>
      </select>
    </div>

    <Table
      :columns="colunas"
      :data="usuarios"
      :loading="loading"
      empty-message="Nenhum usuário cadastrado"
    >
      <template #cell-equipe="{ item }">
        {{ item.equipe?.nome || '-' }}
      </template>

      <template #cell-supervisor="{ item }">
        {{ item.supervisor?.nome_completo || '-' }}
      </template>

      <template #cell-status="{ item }">
        <span :class="['status-badge', `status-${item.status}`]">
          {{ item.status }}
        </span>
      </template>

      <template #actions="{ item }">
        <Button variant="secondary" @click="editar(item)" size="sm">Editar</Button>
        <Button @click="abrirTokenWidget(item)" size="sm" title="Gerenciar Token de Widget">
          🔑 Token Widget
        </Button>
        <Button variant="danger" @click="deletar(item)" size="sm">Deletar</Button>
      </template>
    </Table>

    <!-- Modal Token Widget -->
    <TokenWidgetModal
      v-model="showTokenModal"
      :usuario="usuarioTokenWidget"
      @token-gerado="handleTokenGerado"
      @token-revogado="handleTokenRevogado"
    />

    <Modal v-model="showModal" :title="usuarioEdicao ? 'Editar Usuário' : 'Novo Usuário'">
      <form @submit.prevent="salvar">
        <div class="form-group">
          <label>Nome Completo *</label>
          <input v-model="form.nome_completo" type="text" required />
        </div>

        <div class="form-group">
          <label>Email *</label>
          <input v-model="form.email" type="email" required :disabled="!!usuarioEdicao" />
        </div>

        <div v-if="!usuarioEdicao" class="form-group">
          <label>Senha Inicial</label>
          <input v-model="form.senha" type="password" placeholder="User@123456 (padrão)" />
          <small>Usuário será forçado a trocar no primeiro login</small>
        </div>

        <div class="form-group">
          <label>Nível de Permissão *</label>
          <select v-model="form.nivel_permissao" required>
            <option value="gestor">Gestor</option>
            <option value="equipe">Equipe</option>
          </select>
        </div>

        <div class="form-group">
          <label>Equipe *</label>
          <select v-model="form.id_equipe" required>
            <option value="">Selecione uma equipe</option>
            <option v-for="equipe in equipes" :key="equipe.id" :value="equipe.id">
              {{ equipe.nome }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Supervisor</label>
          <select v-model="form.id_supervisor">
            <option value="">Sem supervisor</option>
            <option v-for="user in usuariosSupervisores" :key="user.id" :value="user.id">
              {{ user.nome_completo }} ({{ user.nivel_permissao }})
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Status</label>
          <select v-model="form.status">
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
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
import { ref, onMounted, computed } from 'vue';
import Button from '../../components/common/Button.vue';
import Modal from '../../components/common/Modal.vue';
import Table from '../../components/common/Table.vue';
import TokenWidgetModal from '../../components/admin/TokenWidgetModal.vue';
import usuarioService from '../../services/usuarioService';
import equipeService from '../../services/equipeService';

const usuarios = ref([]);
const equipes = ref([]);
const stats = ref(null);
const loading = ref(false);
const showModal = ref(false);
const showTokenModal = ref(false);
const usuarioEdicao = ref(null);
const usuarioTokenWidget = ref(null);
const salvando = ref(false);
const error = ref(null);

const filtros = ref({
  nome: '',
  status: '',
  id_equipe: ''
});

const form = ref({
  nome_completo: '',
  email: '',
  senha: '',
  nivel_permissao: 'equipe',
  id_equipe: '',
  id_supervisor: '',
  status: 'ativo'
});

const colunas = [
  { key: 'nome_completo', label: 'Nome' },
  { key: 'email', label: 'Email' },
  { key: 'nivel_permissao', label: 'Nível' },
  { key: 'equipe', label: 'Equipe' },
  { key: 'supervisor', label: 'Supervisor' },
  { key: 'status', label: 'Status' }
];

const usuariosSupervisores = computed(() => {
  return usuarios.value.filter(u => 
    u.nivel_permissao === 'gestor' || u.nivel_permissao === 'admin_cliente'
  );
});

const temVagasDisponiveis = computed(() => {
  return stats.value ? stats.value.vagas_disponiveis > 0 : true;
});

onMounted(async () => {
  await Promise.all([
    carregarUsuarios(),
    carregarEquipes(),
    carregarEstatisticas()
  ]);
});

async function carregarUsuarios() {
  loading.value = true;
  try {
    const response = await usuarioService.listar(filtros.value);
    usuarios.value = response.data;
  } catch (err) {
    console.error('Erro ao carregar usuários:', err);
  } finally {
    loading.value = false;
  }
}

async function carregarEquipes() {
  try {
    const response = await equipeService.listar();
    equipes.value = response.data;
  } catch (err) {
    console.error('Erro ao carregar equipes:', err);
  }
}

async function carregarEstatisticas() {
  try {
    const response = await usuarioService.estatisticas();
    stats.value = response.data;
  } catch (err) {
    console.error('Erro ao carregar estatísticas:', err);
  }
}

function abrirModalCriar() {
  if (!temVagasDisponiveis.value) {
    alert('Limite de usuários atingido! Não é possível adicionar mais usuários.');
    return;
  }

  usuarioEdicao.value = null;
  form.value = {
    nome_completo: '',
    email: '',
    senha: '',
    nivel_permissao: 'equipe',
    id_equipe: '',
    id_supervisor: '',
    status: 'ativo'
  };
  error.value = null;
  showModal.value = true;
}

function editar(usuario) {
  usuarioEdicao.value = usuario;
  form.value = {
    nome_completo: usuario.nome_completo,
    email: usuario.email,
    nivel_permissao: usuario.nivel_permissao,
    id_equipe: usuario.id_equipe || '',
    id_supervisor: usuario.id_supervisor || '',
    status: usuario.status
  };
  error.value = null;
  showModal.value = true;
}

async function salvar() {
  salvando.value = true;
  error.value = null;

  try {
    const dados = { ...form.value };
    
    // Converter strings vazias para null
    if (dados.id_supervisor === '') dados.id_supervisor = null;
    if (dados.id_equipe === '') dados.id_equipe = null;
    
    if (usuarioEdicao.value) {
      delete dados.email; // Não permite alterar email
      delete dados.senha;
      await usuarioService.atualizar(usuarioEdicao.value.id, dados);
    } else {
      await usuarioService.criar(dados);
    }

    showModal.value = false;
    await Promise.all([carregarUsuarios(), carregarEstatisticas()]);
  } catch (err) {
    error.value = err;
  } finally {
    salvando.value = false;
  }
}

function abrirTokenWidget(usuario) {
  usuarioTokenWidget.value = usuario;
  showTokenModal.value = true;
}

function handleTokenGerado(data) {
  console.log('✅ Token gerado:', data);
  // Opcional: atualizar lista de usuários
}

function handleTokenRevogado() {
  console.log('🗑️ Token revogado');
  // Opcional: atualizar lista de usuários
}

async function deletar(usuario) {
  if (!confirm(`Tem certeza que deseja deletar "${usuario.nome_completo}"?`)) {
    return;
  }

  try {
    await usuarioService.deletar(usuario.id);
    await Promise.all([carregarUsuarios(), carregarEstatisticas()]);
  } catch (err) {
    alert('Erro ao deletar: ' + err);
  }
}
</script>

<style scoped>
.page {
  padding: 2rem;
  max-width: 1400px;
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
  margin: 0 0 0.75rem 0;
  color: #666;
}

.stats {
  display: flex;
  gap: 1.5rem;
  font-size: 0.9rem;
}

.stat-item {
  color: #495057;
}

.stat-item strong {
  color: #667eea;
  font-size: 1.1rem;
}

.percentual {
  color: #999;
  font-size: 0.85rem;
}

.vagas {
  color: #28a745;
  font-weight: 500;
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

.status-ativo {
  background-color: #d4edda;
  color: #155724;
}

.status-inativo {
  background-color: #f8d7da;
  color: #721c24;
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

.form-group small {
  display: block;
  margin-top: 0.25rem;
  color: #999;
  font-size: 0.85rem;
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
