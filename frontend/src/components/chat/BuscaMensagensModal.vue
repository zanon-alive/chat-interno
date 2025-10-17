<template>
  <Modal :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" title="Buscar Mensagens">
    <div class="busca-container">
      <div class="form-group">
        <input
          v-model="termoBusca"
          type="text"
          placeholder="Digite para buscar mensagens..."
          @input="buscar"
          class="search-input"
          autofocus
        />
      </div>

      <div v-if="buscando" class="loading">
        Buscando...
      </div>

      <div v-else-if="resultados.length === 0 && termoBusca" class="empty">
        Nenhuma mensagem encontrada
      </div>

      <div v-else class="resultados-list">
        <div
          v-for="mensagem in resultados"
          :key="mensagem.id"
          class="resultado-item"
          @click="selecionarMensagem(mensagem)"
        >
          <div class="resultado-header">
            <strong>{{ mensagem.remetente?.nome_completo }}</strong>
            <span class="timestamp">{{ formatarData(mensagem.created_at) }}</span>
          </div>
          <div class="resultado-conteudo">
            {{ mensagem.conteudo_texto }}
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { ref } from 'vue';
import Modal from '../common/Modal.vue';
import conversaService from '../../services/conversaService';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'mensagem-selecionada']);

const termoBusca = ref('');
const resultados = ref([]);
const buscando = ref(false);

let timeoutBusca = null;

function buscar() {
  // Debounce - esperar 500ms após parar de digitar
  if (timeoutBusca) {
    clearTimeout(timeoutBusca);
  }

  if (!termoBusca.value || termoBusca.value.length < 3) {
    resultados.value = [];
    return;
  }

  timeoutBusca = setTimeout(async () => {
    buscando.value = true;
    try {
      const response = await conversaService.buscarMensagensGlobal(termoBusca.value, { limit: 50 });
      resultados.value = response.data;
    } catch (err) {
      console.error('Erro ao buscar mensagens:', err);
    } finally {
      buscando.value = false;
    }
  }, 500);
}

function selecionarMensagem(mensagem) {
  emit('mensagem-selecionada', mensagem);
  emit('update:modelValue', false);
}

function formatarData(data) {
  const d = new Date(data);
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
</script>

<style scoped>
.busca-container {
  min-height: 300px;
  max-height: 500px;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.loading,
.empty {
  padding: 3rem;
  text-align: center;
  color: #999;
}

.resultados-list {
  margin-top: 1rem;
  max-height: 400px;
  overflow-y: auto;
}

.resultado-item {
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.resultado-item:hover {
  background-color: #f8f9fa;
  border-color: #667eea;
  transform: translateX(4px);
}

.resultado-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.resultado-header strong {
  color: #333;
  font-size: 0.95rem;
}

.timestamp {
  color: #999;
  font-size: 0.8rem;
}

.resultado-conteudo {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
}
</style>

