<template>
  <div 
    class="widget-minimized"
    :class="positionClass"
    @click="expand"
  >
    <div class="widget-header">
      <span class="widget-icon">💬</span>
      <span class="widget-title">Chat</span>
      <span v-if="totalNaoLidas > 0" class="widget-badge">{{ totalNaoLidas }}</span>
    </div>
    
    <div v-if="hasConversas" class="widget-preview">
      <template v-if="conversas.length === 1">
        <!-- Uma única conversa -->
        <div class="preview-single">
          <strong>{{ getNomeConversa(conversas[0]) }}</strong>
          <span v-if="conversas[0].mensagens_nao_lidas" class="preview-badge">
            ({{ conversas[0].mensagens_nao_lidas }})
          </span>
        </div>
      </template>
      
      <template v-else>
        <!-- Múltiplas conversas -->
        <div class="preview-multiple">
          <div class="preview-names">{{ nomesResumidos }}</div>
          <div class="preview-count">
            {{ conversas.length }} {{ conversas.length === 1 ? 'conversa' : 'conversas' }}
          </div>
        </div>
      </template>
    </div>
    
    <div v-else class="widget-preview">
      <span class="preview-empty">Nenhuma conversa ativa</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  conversas: {
    type: Array,
    default: () => []
  },
  totalNaoLidas: {
    type: Number,
    default: 0
  },
  position: {
    type: String,
    default: 'bottom-right'
  }
});

const emit = defineEmits(['expand']);

const hasConversas = computed(() => props.conversas.length > 0);

const positionClass = computed(() => {
  return `position-${props.position}`;
});

const nomesResumidos = computed(() => {
  if (!props.conversas.length) return '';
  
  const nomes = props.conversas
    .map(c => getNomeConversa(c))
    .join(', ');
  
  // Limitar a 50 caracteres
  return nomes.length > 50 ? nomes.substring(0, 47) + '...' : nomes;
});

function getNomeConversa(conversa) {
  if (conversa.nome_conversa) return conversa.nome_conversa;
  
  // Para 1-on-1, pegar nome do outro participante
  const outros = conversa.participantes?.filter(p => !p.is_current_user);
  return outros?.[0]?.nome_completo || 'Conversa';
}

function expand() {
  emit('expand');
}
</script>

<style scoped>
.widget-minimized {
  position: fixed;
  width: 320px;
  background: white;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.widget-minimized:hover {
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

.position-bottom-right {
  bottom: 0;
  right: 20px;
}

.position-bottom-left {
  bottom: 0;
  left: 20px;
}

.widget-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
}

.widget-icon {
  font-size: 20px;
}

.widget-title {
  flex: 1;
  font-size: 16px;
}

.widget-badge {
  background: rgba(255, 255, 255, 0.3);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
}

.widget-preview {
  padding: 12px 16px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
  font-size: 13px;
  color: #495057;
}

.preview-single {
  display: flex;
  align-items: center;
  gap: 6px;
}

.preview-single strong {
  color: #212529;
}

.preview-badge {
  color: #667eea;
  font-weight: 600;
}

.preview-multiple {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.preview-names {
  color: #212529;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.preview-count {
  font-size: 11px;
  color: #6c757d;
}

.preview-empty {
  color: #adb5bd;
  font-style: italic;
}
</style>

