<template>
  <div class="chart-container">
    <h3 v-if="title" class="chart-title">{{ title }}</h3>
    <div class="chart-wrapper">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue';
import {
  Chart,
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Registrar componentes do Chart.js
Chart.register(
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  data: {
    type: Array,
    default: () => []
  },
  labelKey: {
    type: String,
    default: 'nome'
  },
  valueKey: {
    type: String,
    default: 'total'
  },
  color: {
    type: String,
    default: '#667eea'
  },
  horizontal: {
    type: Boolean,
    default: false
  }
});

const chartCanvas = ref(null);
let chartInstance = null;

function createChart() {
  if (!chartCanvas.value || !props.data || props.data.length === 0) return;

  const ctx = chartCanvas.value.getContext('2d');

  // Destruir gráfico anterior
  if (chartInstance) {
    chartInstance.destroy();
  }

  const labels = props.data.map(item => item[props.labelKey]);
  const values = props.data.map(item => item[props.valueKey]);

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: props.title,
          data: values,
          backgroundColor: `${props.color}CC`,
          borderColor: props.color,
          borderWidth: 1,
          borderRadius: 6,
          barThickness: 'flex',
          maxBarThickness: 50
        }
      ]
    },
    options: {
      indexAxis: props.horizontal ? 'y' : 'x',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

onMounted(() => {
  createChart();
});

watch(() => props.data, () => {
  createChart();
}, { deep: true });

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});
</script>

<style scoped>
.chart-container {
  background: var(--cor-fundo-secundario);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.chart-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--cor-texto-primaria);
  margin-bottom: 1rem;
}

.chart-wrapper {
  position: relative;
  height: 300px;
}

@media (max-width: 768px) {
  .chart-wrapper {
    height: 250px;
  }
}
</style>

