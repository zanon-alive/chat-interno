<template>
  <div class="table-container">
    <table class="table">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key">
            {{ column.label }}
          </th>
          <th v-if="$slots.actions">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td :colspan="columns.length + ($slots.actions ? 1 : 0)" class="loading-row">
            Carregando...
          </td>
        </tr>
        <tr v-else-if="!data || data.length === 0">
          <td :colspan="columns.length + ($slots.actions ? 1 : 0)" class="empty-row">
            {{ emptyMessage }}
          </td>
        </tr>
        <tr v-else v-for="item in data" :key="item.id">
          <td v-for="column in columns" :key="column.key">
            <slot :name="`cell-${column.key}`" :item="item">
              {{ getValue(item, column.key) }}
            </slot>
          </td>
          <td v-if="$slots.actions" class="actions-cell">
            <slot name="actions" :item="item"></slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  columns: {
    type: Array,
    required: true,
    // Format: [{ key: 'nome', label: 'Nome' }]
  },
  data: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  emptyMessage: {
    type: String,
    default: 'Nenhum registro encontrado'
  }
});

function getValue(item, key) {
  return key.split('.').reduce((obj, k) => obj?.[k], item);
}
</script>

<style scoped>
.table-container {
  overflow-x: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.table {
  width: 100%;
  min-width: 600px;
  border-collapse: collapse;
}

@media (max-width: 768px) {
  .table {
    min-width: 100%;
    font-size: 0.9rem;
  }

  th, td {
    padding: 0.75rem 0.5rem;
  }
}

thead {
  background-color: #f8f9fa;
}

th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #333;
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
}

td {
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  color: #212529;
  background-color: #fff;
}

tbody tr {
  background-color: #fff;
}

tbody tr:nth-child(even) {
  background-color: #f8f9fa;
}

tbody tr:hover {
  background-color: #f8f9fa;
}

.loading-row,
.empty-row {
  text-align: center;
  color: #6c757d;
  padding: 2rem;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}
</style>

