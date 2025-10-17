<template>
  <span class="message-status" :class="statusClass" :title="statusTitle">
    <span v-if="status === 'enviada'" class="check single">✓</span>
    <span v-else-if="status === 'entregue'" class="check double">✓✓</span>
    <span v-else-if="status === 'lida'" class="check double read">✓✓</span>
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  status: {
    type: String,
    default: 'enviada',
    validator: (value) => ['enviada', 'entregue', 'lida'].includes(value)
  },
  enviadaEm: {
    type: [String, Date],
    default: null
  },
  entregueEm: {
    type: [String, Date],
    default: null
  },
  lidaEm: {
    type: [String, Date],
    default: null
  }
});

const statusClass = computed(() => {
  return `status-${props.status}`;
});

const statusTitle = computed(() => {
  if (props.status === 'lida' && props.lidaEm) {
    return `Lida em ${formatarDataHora(props.lidaEm)}`;
  }
  if (props.status === 'entregue' && props.entregueEm) {
    return `Entregue em ${formatarDataHora(props.entregueEm)}`;
  }
  if (props.enviadaEm) {
    return `Enviada em ${formatarDataHora(props.enviadaEm)}`;
  }
  return '';
});

function formatarDataHora(data) {
  const d = new Date(data);
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}
</script>

<style scoped>
.message-status {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
  font-size: 0.75rem;
  user-select: none;
}

.check {
  display: inline-block;
  font-weight: 600;
}

.check.single {
  color: #95a5a6;
}

.check.double {
  color: #95a5a6;
  letter-spacing: -3px;
}

.check.double.read {
  color: #34c759; /* Verde do WhatsApp */
}

/* Ajuste para mensagens próprias (fundo escuro) */
.mensagem.propria .message-status .check {
  color: rgba(255, 255, 255, 0.7);
}

.mensagem.propria .message-status .check.read {
  color: #6affb4; /* Verde mais claro para fundo escuro */
}
</style>

