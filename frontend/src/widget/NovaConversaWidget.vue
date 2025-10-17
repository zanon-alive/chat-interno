<template>
  <div v-if="modelValue" class="modal-overlay" @click.self="fechar">
    <div class="modal-content">
      <div class="modal-header">
        <h3>💬 Nova Conversa</h3>
        <button @click="fechar" class="btn-close">×</button>
      </div>

      <div class="modal-body">
        <!-- Tabs -->
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

        <!-- Loading -->
        <div v-if="loading" class="loading">
          ⏳ Carregando usuários...
        </div>

        <!-- Erro -->
        <div v-else-if="error" class="error-message">
          {{ error }}
        </div>

        <!-- Individual -->
        <div v-else-if="tipo === 'individual'" class="form-section">
          <div class="busca-container">
            <input
              v-model="busca"
              type="text"
              placeholder="🔍 Buscar usuário..."
              class="input-busca"
            />
          </div>

          <div class="usuarios-lista">
            <div
              v-for="usuario in usuariosFiltrados"
              :key="usuario.id"
              class="usuario-item"
              @click="selecionarUsuario(usuario)"
            >
              <div class="usuario-avatar">
                {{ usuario.nome_completo.charAt(0).toUpperCase() }}
              </div>
              <div class="usuario-info">
                <strong>{{ usuario.nome_completo }}</strong>
                <p>{{ usuario.email }}</p>
              </div>
            </div>

            <div v-if="usuariosFiltrados.length === 0" class="empty">
              Nenhum usuário encontrado
            </div>
          </div>
        </div>

        <!-- Grupo -->
        <div v-else class="form-section">
          <div class="form-group">
            <label>Nome do Grupo *</label>
            <input 
              v-model="nomeGrupo" 
              type="text" 
              placeholder="Ex: Equipe de Projetos"
              class="input-busca"
            />
          </div>

          <div class="busca-container">
            <input
              v-model="busca"
              type="text"
              placeholder="🔍 Buscar participantes..."
              class="input-busca"
            />
          </div>

          <div class="usuarios-lista">
            <div
              v-for="usuario in usuariosFiltrados"
              :key="usuario.id"
              class="usuario-item checkbox-item"
              @click="toggleSelecionado(usuario)"
            >
              <input 
                type="checkbox" 
                :checked="usuariosSelecionados.includes(usuario.id)"
                @click.stop="toggleSelecionado(usuario)"
                class="usuario-checkbox"
              />
              <div class="usuario-avatar">
                {{ usuario.nome_completo.charAt(0).toUpperCase() }}
              </div>
              <div class="usuario-info">
                <strong>{{ usuario.nome_completo }}</strong>
                <p>{{ usuario.email }}</p>
              </div>
            </div>

            <div v-if="usuariosFiltrados.length === 0" class="empty">
              Nenhum usuário encontrado
            </div>
          </div>

          <div v-if="usuariosSelecionados.length > 0" class="selecionados">
            ✅ {{ usuariosSelecionados.length }} participante(s) selecionado(s)
          </div>
        </div>

        <!-- Botão Criar Grupo -->
        <div v-if="tipo === 'grupo'" class="modal-footer">
          <button @click="fechar" class="btn-cancelar">Cancelar</button>
          <button 
            @click="criarGrupo" 
            :disabled="!podeCriarGrupo || criando"
            class="btn-criar"
          >
            {{ criando ? 'Criando...' : 'Criar Grupo' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import apiWidget from '../services/apiWidget';

const props = defineProps({
  modelValue: Boolean
});

const emit = defineEmits(['update:modelValue', 'conversa-criada']);

const usuarios = ref([]);
const busca = ref('');
const loading = ref(false);
const error = ref(null);
const criando = ref(false);
const tipo = ref('individual'); // 'individual' ou 'grupo'
const nomeGrupo = ref('');
const usuariosSelecionados = ref([]);

const usuariosFiltrados = computed(() => {
  if (!busca.value) return usuarios.value;
  
  const termo = busca.value.toLowerCase();
  return usuarios.value.filter(u =>
    u.nome_completo.toLowerCase().includes(termo) ||
    u.email.toLowerCase().includes(termo)
  );
});

const podeCriarGrupo = computed(() => {
  return nomeGrupo.value.trim().length >= 3 && usuariosSelecionados.value.length >= 2;
});

// Se abrir com modelValue true, carregar imediatamente
// (v-if cria componente já com modelValue=true, watch não dispara)
if (props.modelValue) {
  carregarUsuarios();
}

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    carregarUsuarios();
  } else {
    limpar();
  }
});

async function carregarUsuarios() {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await apiWidget.get('/chat/usuarios-disponiveis');
    
    // Resposta vem em { success: true, data: [...], total: N }
    usuarios.value = response.data?.data || response.data || [];
    
    if (usuarios.value.length === 0) {
      error.value = '⚠️ Nenhum usuário disponível para conversa. Entre em contato com o administrador.';
    }
  } catch (err) {
    console.error('Erro ao carregar usuários para widget:', err);
    error.value = 'Erro ao carregar usuários disponíveis: ' + (err.message || 'Erro desconhecido');
  } finally {
    loading.value = false;
  }
}

async function selecionarUsuario(usuario) {
  if (criando.value) return;
  
  criando.value = true;
  error.value = null;

  try {
    const response = await apiWidget.post('/chat/conversas/individual', {
      participante_id: usuario.id
    });
    
    // Resposta vem em { success: true, data: {...} }
    const conversa = response.data?.data || response.data;
    
    emit('conversa-criada', conversa);
    fechar();
  } catch (err) {
    console.error('Erro ao criar conversa no widget:', err);
    error.value = err.response?.data?.message || err.message || 'Erro ao criar conversa';
    alert('❌ Erro ao criar conversa:\n\n' + error.value);
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

async function criarGrupo() {
  if (!podeCriarGrupo.value || criando.value) return;
  
  criando.value = true;
  error.value = null;

  try {
    const response = await apiWidget.post('/chat/conversas/grupo', {
      nome: nomeGrupo.value.trim(),
      participantes: usuariosSelecionados.value
    });
    
    const conversa = response.data?.data || response.data;
    
    emit('conversa-criada', conversa);
    fechar();
  } catch (err) {
    console.error('Erro ao criar grupo no widget:', err);
    error.value = err.response?.data?.message || err.message || 'Erro ao criar grupo';
    alert('❌ Erro ao criar grupo:\n\n' + error.value);
  } finally {
    criando.value = false;
  }
}

function fechar() {
  emit('update:modelValue', false);
}

function limpar() {
  busca.value = '';
  usuarios.value = [];
  error.value = null;
  tipo.value = 'individual';
  nomeGrupo.value = '';
  usuariosSelecionados.value = [];
}
</script>

<style scoped>
.tabs {
  display: flex;
  border-bottom: 2px solid #e0e0e0;
  margin-bottom: 1.5rem;
  gap: 0;
}

.tab {
  flex: 1;
  padding: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
  color: #666;
  transition: all 0.2s;
  font-weight: 500;
}

.tab.active {
  color: #667eea;
  border-bottom: 3px solid #667eea;
  margin-bottom: -2px;
  font-weight: 600;
}

.tab:hover:not(.active) {
  color: #555;
  background: #f8f9fa;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 450px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.btn-close {
  width: 32px;
  height: 32px;
  border: none;
  background: #f8f9fa;
  color: #6c757d;
  border-radius: 6px;
  cursor: pointer;
  font-size: 24px;
  line-height: 1;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #e9ecef;
  color: #495057;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.busca-container {
  margin-bottom: 1rem;
}

.input-busca {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
}

.input-busca:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.loading, .empty {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

.error-message {
  background: #fff3cd;
  color: #856404;
  padding: 1rem;
  border-radius: 6px;
  text-align: center;
}

.usuarios-lista {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.usuario-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.usuario-item:hover {
  background: #f8f9fa;
  border-color: #667eea;
  transform: translateX(4px);
}

.usuario-item.checkbox-item {
  cursor: pointer;
  user-select: none;
}

.usuario-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #667eea;
}

.usuario-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.1rem;
}

.usuario-info {
  flex: 1;
  min-width: 0;
}

.usuario-info strong {
  display: block;
  color: #2c3e50;
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
}

.usuario-info p {
  margin: 0;
  color: #6c757d;
  font-size: 0.85rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.selecionados {
  padding: 0.75rem 1rem;
  background: #e7f3ff;
  color: #0066cc;
  border-radius: 6px;
  text-align: center;
  font-weight: 500;
  font-size: 0.9rem;
}

.modal-footer {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.btn-cancelar,
.btn-criar {
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancelar {
  background: #f8f9fa;
  color: #495057;
}

.btn-cancelar:hover {
  background: #e9ecef;
}

.btn-criar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-criar:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-criar:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

