<template>
  <div class="kpi-card" :class="cardClass">
    <div class="kpi-icon">{{ icon }}</div>
    <div class="kpi-content">
      <div class="kpi-value">{{ formatValue(value) }}</div>
      <div class="kpi-label">{{ label }}</div>
      <div v-if="change" class="kpi-change" :class="changeClass">
        <span class="change-arrow">{{ changeArrow }}</span>
        <span>{{ Math.abs(change) }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  icon: {
    type: String,
    default: '📊'
  },
  label: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    required: true
  },
  change: {
    type: Number,
    default: null
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'success', 'warning', 'danger', 'info'].includes(value)
  }
});

const cardClass = computed(() => `kpi-card-${props.variant}`);

const changeClass = computed(() => {
  if (!props.change) return '';
  return props.change > 0 ? 'change-positive' : 'change-negative';
});

const changeArrow = computed(() => {
  if (!props.change) return '';
  return props.change > 0 ? '↑' : '↓';
});

function formatValue(value) {
  if (typeof value === 'number') {
    return value.toLocaleString('pt-BR');
  }
  return value;
}
</script>

<style scoped>
.kpi-card {
  background: var(--cor-fundo-secundario);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  border-left: 4px solid var(--cor-primaria);
}

.kpi-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.kpi-card-success {
  border-left-color: var(--cor-sucesso);
}

.kpi-card-warning {
  border-left-color: var(--cor-alerta);
}

.kpi-card-danger {
  border-left-color: var(--cor-erro);
}

.kpi-card-info {
  border-left-color: var(--cor-info);
}

.kpi-icon {
  font-size: 2.5rem;
  line-height: 1;
}

.kpi-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.kpi-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--cor-texto-primaria);
  line-height: 1;
}

.kpi-label {
  font-size: 0.9rem;
  color: var(--cor-texto-secundaria);
  font-weight: 500;
}

.kpi-change {
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.25rem;
}

.change-positive {
  color: var(--cor-sucesso);
}

.change-negative {
  color: var(--cor-erro);
}

.change-arrow {
  font-size: 1rem;
}

@media (max-width: 768px) {
  .kpi-card {
    padding: 1rem;
  }

  .kpi-icon {
    font-size: 2rem;
  }

  .kpi-value {
    font-size: 1.5rem;
  }
}
</style>

