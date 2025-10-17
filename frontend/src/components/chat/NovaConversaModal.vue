<template>
  <Modal :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" title="Nova Conversa" @close="limpar">
    <div class="tabs">
      <button 
        :class="['tab', { active: tipo === 'individual' }]"
        @click="tipo = 'individual'"
      >
        Individual
      </button>
      <button 
        :class="['tab', { active: tipo === 'grupo' }]"
        @click="tipo = 'grupo'"
      >
        Grupo
      </button>
    </div>

    <div v-if="tipo === 'individual'" class="form-section">
      <div class="form-group">
        <label>Selecione o usuário:</label>
        <input 
          v-model="busca" 
          type="text" 
          placeholder="Buscar usuário..."
          class="search-input"
        />
      </div>

      <div class="usuarios-list">
        <div
          v-for="usuario in usuariosFiltrados"
          :key="usuario.id"
          class="usuario-item"
          @click="selecionarUsuario(usuario)"
        >
          <div class="usuario-info">
            <strong>{{ usuario.nome_completo }}</strong>
            <span class="email">{{ usuario.email }}</span>
          </div>
          <span v-if="isOnline(usuario.id)" class="status-dot online"></span>
        </div>

        <div v-if="usuariosFiltrados.length === 0" class="empty">
          Nenhum usuário encontrado
        </div>
      </div>
    </div>

    <div v-else class="form-section">
      <div class="form-group">
        <label>Nome do Grupo *</label>
        <input v-model="nomeGrupo" type="text" placeholder="Ex: Equipe de Projetos" />
      </div>

      <div class="form-group">
        <label>Selecione os participantes:</label>
        <input 
          v-model="busca" 
          type="text" 
          placeholder="Buscar usuários..."
          class="search-input"
        />
      </div>

      <div class="usuarios-list">
        <div
          v-for="usuario in usuariosFiltrados"
          :key="usuario.id"
          class="usuario-item"
          @click="toggleSelecionado(usuario)"
        >
          <div class="usuario-info">
            <input 
              type="checkbox" 
              :checked="usuariosSelecionados.includes(usuario.id)"
              @click.stop="toggleSelecionado(usuario)"
            />
            <div>
              <strong>{{ usuario.nome_completo }}</strong>
              <span class="email">{{ usuario.email }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="usuariosSelecionados.length > 0" class="selecionados">
        {{ usuariosSelecionados.length }} participante(s) selecionado(s)
      </div>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <template #footer>
      <Button variant="secondary" @click="$emit('update:modelValue', false)">
        Cancelar
      </Button>
      <Button @click="criar" :loading="criando" :disabled="!podecriar">
        Criar
      </Button>
    </template>
  </Modal>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import Modal from '../common/Modal.vue';
import Button from '../common/Button.vue';
import { useChatStore } from '../../store/chat';
import usuarioService from '../../services/usuarioService';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'criado']);

const chatStore = useChatStore();

const tipo = ref('individual');
const busca = ref('');
const usuarios = ref([]);
const usuariosSelecionados = ref([]);
const nomeGrupo = ref('');
const criando = ref(false);
const error = ref(null);

const usuariosFiltrados = computed(() => {
  if (!busca.value) return usuarios.value;
  
  const termo = busca.value.toLowerCase();
  return usuarios.value.filter(u =>
    u.nome_completo.toLowerCase().includes(termo) ||
    u.email.toLowerCase().includes(termo)
  );
});

const podecriar = computed(() => {
  if (tipo.value === 'individual') {
    return true; // Será validado ao clicar no usuário
  } else {
    return nomeGrupo.value.trim().length >= 3 && usuariosSelecionados.value.length >= 2;
  }
});

watch(() => props.modelValue, async (newVal) => {
  if (newVal) {
    await carregarUsuarios();
  }
});

async function carregarUsuarios() {
  try {
    const response = await usuarioService.listar({ status: 'ativo' });
    // Filtrar o próprio usuário
    usuarios.value = response.data.filter(u => u.id !== chatStore.userId);
  } catch (err) {
    console.error('Erro ao carregar usuários:', err);
    error.value = 'Erro ao carregar usuários';
  }
}

async function selecionarUsuario(usuario) {
  criando.value = true;
  error.value = null;

  try {
    const conversa = await chatStore.criarConversaIndividual(usuario.id);
    emit('update:modelValue', false);
    emit('criado', conversa);
  } catch (err) {
    error.value = err || 'Erro ao criar conversa';
  } finally {
    criando.value = false;
  }
}

function toggleSelecionado(usuario) {
  const index = usuariosSelecionados.value.indexOf(usuario.id);
  if (index > -1) {
    usuariosSelecionados.value.splice(index, 1);
  } else {
    usuariosSelecionados.value.push(usuario.id);
  }
}

async function criar() {
  if (tipo.value === 'grupo') {
    criando.value = true;
    error.value = null;

    try {
      const grupo = await chatStore.criarGrupo(nomeGrupo.value.trim(), usuariosSelecionados.value);
      emit('update:modelValue', false);
      emit('criado', grupo);
    } catch (err) {
      error.value = err || 'Erro ao criar grupo';
    } finally {
      criando.value = false;
    }
  }
}

function isOnline(userId) {
  return chatStore.usuariosOnline.includes(userId);
}

function limpar() {
  busca.value = '';
  usuariosSelecionados.value = [];
  nomeGrupo.value = '';
  error.value = null;
}
</script>

<style scoped>
.tabs {
  display: flex;
  border-bottom: 2px solid #e0e0e0;
  margin-bottom: 1.5rem;
}

.tab {
  flex: 1;
  padding: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: #666;
  transition: all 0.2s;
}

.tab.active {
  color: #667eea;
  border-bottom: 2px solid #667eea;
  margin-bottom: -2px;
  font-weight: 600;
}

.form-section {
  max-height: 400px;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.search-input,
.form-group input {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
}

.search-input:focus,
.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.usuarios-list {
  margin-top: 1rem;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
}

.usuario-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s;
}

.usuario-item:hover {
  background-color: #f8f9fa;
}

.usuario-item:last-child {
  border-bottom: none;
}

.usuario-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.usuario-info > div {
  display: flex;
  flex-direction: column;
}

.usuario-info strong {
  color: #333;
  font-size: 0.95rem;
}

.email {
  color: #999;
  font-size: 0.85rem;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #ccc;
}

.status-dot.online {
  background-color: #28a745;
}

.selecionados {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #e8eaf6;
  color: #667eea;
  border-radius: 6px;
  font-weight: 500;
  text-align: center;
}

.empty {
  padding: 2rem;
  text-align: center;
  color: #999;
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

