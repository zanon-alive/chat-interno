<template>
  <Modal :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" title="Token de Widget">
    <div class="token-widget-content">
      <div class="info-box">
        <h3>🔑 Token para Widget Embarcável</h3>
        <p>Gere um token especial para que este usuário possa usar o widget de chat em sistemas legados.</p>
      </div>

      <!-- Token Existente -->
      <div v-if="tokenInfo && tokenInfo.tem_token" class="token-existente">
        <h4>Token Atual:</h4>
        
        <div class="token-display">
          <input 
            :value="mostrarToken ? tokenInfo.token : '•'.repeat(50)" 
            readonly 
            class="token-input"
            @click="copiarToken"
          />
          <button @click="mostrarToken = !mostrarToken" class="btn-toggle" type="button">
            {{ mostrarToken ? '🙈 Ocultar' : '👁️ Mostrar' }}
          </button>
          <button @click="copiarToken" class="btn-copy" type="button">
            📋 Copiar
          </button>
        </div>

        <div class="token-info">
          <p>
            <strong>Gerado em:</strong> 
            {{ formatarData(tokenInfo.gerado_em) }}
          </p>
          <p v-if="tokenInfo.sempre_valido" class="valido-sempre">
            ✅ <strong>Sempre Válido</strong> (nunca expira)
          </p>
          <p v-else>
            <strong>Expira em:</strong> 
            {{ formatarData(tokenInfo.expira_em) }}
            <span :class="tokenExpirado ? 'expirado' : 'valido'">
              {{ tokenExpirado ? '❌ Expirado' : '✅ Válido' }}
            </span>
          </p>
        </div>

        <div class="token-actions">
          <Button variant="danger" @click="confirmarRevogar" size="sm">
            🗑️ Revogar Token
          </Button>
        </div>
      </div>

      <!-- Gerar Novo Token -->
      <div v-else class="gerar-token">
        <h4>Gerar Novo Token:</h4>
        
        <div class="form-group">
          <label>
            <input type="checkbox" v-model="form.sempre_valido" />
            <strong>Sempre Válido</strong> (token nunca expira)
          </label>
          <p class="hint">
            ⚠️ Use com cuidado! Tokens permanentes podem representar risco de segurança.
          </p>
        </div>

        <div v-if="!form.sempre_valido" class="form-group">
          <label>Validade (dias):</label>
          <select v-model="form.dias_expiracao">
            <option :value="7">7 dias</option>
            <option :value="30">30 dias</option>
            <option :value="90">90 dias</option>
            <option :value="365">1 ano (padrão)</option>
            <option :value="730">2 anos</option>
          </select>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </div>

      <!-- Instruções de Uso -->
      <div class="instrucoes">
        <h4>📖 Como Usar:</h4>
        <div class="code-example">
<pre>&lt;script src="chat-widget.js"&gt;&lt;/script&gt;
&lt;script&gt;
  ChatWidget.init({
    token: '<span class="highlight">{{ tokenInfo?.token?.substring(0, 20) || 'SEU_TOKEN_AQUI' }}...</span>',
    apiUrl: 'https://api.chat.empresa.com'
  });
&lt;/script&gt;</pre>
        </div>
      </div>
    </div>

    <template #footer>
      <Button variant="secondary" @click="$emit('update:modelValue', false)">Fechar</Button>
      <Button 
        v-if="!tokenInfo || !tokenInfo.tem_token"
        @click="gerarToken" 
        :loading="gerando"
      >
        🔑 Gerar Token
      </Button>
    </template>
  </Modal>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import Modal from '../common/Modal.vue';
import Button from '../common/Button.vue';
import api from '../../services/api';

const props = defineProps({
  modelValue: Boolean,
  usuario: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'token-gerado', 'token-revogado']);

const tokenInfo = ref(null);
const mostrarToken = ref(false);
const gerando = ref(false);
const error = ref(null);

const form = ref({
  sempre_valido: false,
  dias_expiracao: 365
});

const tokenExpirado = computed(() => {
  if (!tokenInfo.value || !tokenInfo.value.expira_em || tokenInfo.value.sempre_valido) {
    return false;
  }
  return new Date() > new Date(tokenInfo.value.expira_em);
});

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    carregarToken();
  }
});

async function carregarToken() {
  try {
    const response = await api.get(`/admin/usuarios/${props.usuario.id}/token-widget`);
    tokenInfo.value = response.data;
  } catch (err) {
    console.error('Erro ao carregar token:', err);
  }
}

async function gerarToken() {
  gerando.value = true;
  error.value = null;

  try {
    const response = await api.post(`/admin/usuarios/${props.usuario.id}/gerar-token-widget`, {
      sempre_valido: form.value.sempre_valido,
      dias_expiracao: form.value.dias_expiracao
    });

    tokenInfo.value = {
      tem_token: true,
      ...response.data
    };

    mostrarToken.value = true;
    emit('token-gerado', response.data);
    
    alert('✅ Token gerado com sucesso!\n\nCopie o token agora e guarde em local seguro.');
  } catch (err) {
    error.value = err.response?.data?.error || 'Erro ao gerar token';
    alert('❌ Erro ao gerar token:\n\n' + error.value);
  } finally {
    gerando.value = false;
  }
}

async function confirmarRevogar() {
  if (!confirm('⚠️ Tem certeza que deseja revogar o token?\n\nO widget parará de funcionar imediatamente para este usuário.')) {
    return;
  }

  try {
    await api.delete(`/admin/usuarios/${props.usuario.id}/token-widget`);
    tokenInfo.value = { tem_token: false };
    emit('token-revogado');
    alert('✅ Token revogado com sucesso!');
  } catch (err) {
    alert('❌ Erro ao revogar token:\n\n' + (err.response?.data?.error || 'Erro desconhecido'));
  }
}

function copiarToken() {
  if (tokenInfo.value?.token) {
    navigator.clipboard.writeText(tokenInfo.value.token);
    alert('✅ Token copiado para área de transferência!');
  }
}

function formatarData(data) {
  if (!data) return '-';
  return new Date(data).toLocaleString('pt-BR');
}
</script>

<style scoped>
.token-widget-content {
  max-height: 70vh;
  overflow-y: auto;
}

.info-box {
  background: #e3f2fd;
  border-left: 4px solid #2196f3;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 6px;
}

.info-box h3 {
  margin: 0 0 0.5rem 0;
  color: #1976d2;
  font-size: 1.1rem;
}

.info-box p {
  margin: 0;
  color: #555;
  font-size: 0.9rem;
}

.token-existente, .gerar-token {
  margin-bottom: 1.5rem;
}

h4 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.token-display {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.token-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: monospace;
  font-size: 0.85rem;
  background: #f8f9fa;
  cursor: pointer;
}

.btn-toggle, .btn-copy {
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.btn-toggle:hover, .btn-copy:hover {
  background: #f0f0f0;
  border-color: #667eea;
}

.token-info {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.token-info p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.valido-sempre {
  color: #28a745;
  font-weight: 600;
}

.valido {
  color: #28a745;
  font-weight: 600;
  margin-left: 0.5rem;
}

.expirado {
  color: #dc3545;
  font-weight: 600;
  margin-left: 0.5rem;
}

.token-actions {
  display: flex;
  justify-content: flex-end;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.form-group input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
}

.hint {
  font-size: 0.85rem;
  color: #856404;
  background: #fff3cd;
  padding: 0.5rem;
  border-radius: 4px;
  margin-top: 0.5rem;
}

.instrucoes {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  margin-top: 1.5rem;
}

.code-example {
  background: #282c34;
  color: #abb2bf;
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
  font-family: monospace;
  font-size: 0.85rem;
  line-height: 1.5;
  margin-top: 0.5rem;
}

.code-example .highlight {
  color: #98c379;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 6px;
  margin-top: 1rem;
}
</style>

