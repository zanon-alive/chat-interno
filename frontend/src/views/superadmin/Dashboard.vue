<template>
  <DashboardLayout>
    <div class="superadmin-dashboard">
      <!-- Header -->
      <div class="dashboard-header">
        <div class="header-content">
          <h1>📊 Dashboard - Super Administrador</h1>
          <p>Visão geral de todo o sistema</p>
        </div>
        <button @click="refresh" class="btn-refresh" :disabled="loading">
          🔄 {{ loading ? 'Atualizando...' : 'Atualizar' }}
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading && !estatisticas" class="loading-state">
        <div class="spinner">⏳</div>
        <p>Carregando dados...</p>
      </div>

      <!-- Content -->
      <div v-else class="dashboard-content">
        <!-- KPIs -->
        <div class="kpi-grid">
          <KPICard 
            icon="🏢" 
            label="Empresas Cadastradas" 
            :value="estatisticas?.totalEmpresas || 0"
            variant="default"
          />
          <KPICard 
            icon="👥" 
            label="Total de Usuários" 
            :value="estatisticas?.totalUsuarios || 0"
            variant="default"
          />
          <KPICard 
            icon="🟢" 
            label="Usuários Online" 
            :value="estatisticas?.usuariosOnline || 0"
            variant="success"
          />
          <KPICard 
            icon="💬" 
            label="Conversas Hoje" 
            :value="estatisticas?.conversasHoje || 0"
            variant="info"
          />
          <KPICard 
            icon="📨" 
            label="Mensagens Hoje" 
            :value="estatisticas?.mensagensHoje || 0"
            variant="warning"
          />
        </div>

        <!-- Filtro por Empresa -->
        <div class="filter-section">
          <label for="empresa-filter">🔍 Filtrar gráficos por empresa:</label>
          <select id="empresa-filter" v-model="empresaSelecionada" @change="handleFiltroChange" class="select-filter">
            <option :value="null">Todas as Empresas</option>
            <option v-for="emp in empresas" :key="emp.id" :value="emp.id">
              {{ emp.nome }}
            </option>
          </select>
        </div>

        <!-- Gráficos -->
        <div class="charts-grid">
          <LineChart 
            title="📈 Usuários Online por Hora" 
            :data="usuariosOnline"
            color="#48bb78"
          />
          <LineChart 
            title="📈 Conversas por Hora" 
            :data="conversas"
            color="#667eea"
          />
          <LineChart 
            title="📈 Mensagens por Hora" 
            :data="mensagens"
            color="#4299e1"
          />
          <BarChart 
            title="🏆 Top 5 Empresas Mais Ativas" 
            :data="top5Empresas"
            labelKey="nome"
            valueKey="mensagens_hoje"
            color="#ed8936"
          />
        </div>

        <!-- Tabela de Empresas -->
        <div class="empresas-section">
          <h3>📋 Detalhamento por Empresa</h3>
          <div class="table-responsive">
            <table class="empresas-table">
              <thead>
                <tr>
                  <th>Empresa</th>
                  <th>Usuários</th>
                  <th>Online</th>
                  <th>Conversas</th>
                  <th>Mensagens</th>
                  <th>Tema</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="emp in empresas" :key="emp.id">
                  <td class="empresa-nome">{{ emp.nome }}</td>
                  <td>{{ emp.total_usuarios }}</td>
                  <td>
                    <span class="badge-online">🟢 {{ emp.usuarios_online }}</span>
                  </td>
                  <td>{{ emp.conversas_ativas }}</td>
                  <td>{{ emp.mensagens_hoje }}</td>
                  <td>
                    <router-link 
                      v-if="emp.id_instancia"
                      :to="`/superadmin/tema/${emp.id_instancia}`" 
                      class="btn-tema"
                    >
                      🎨 Editar Tema
                    </router-link>
                    <span v-else class="text-muted">-</span>
                  </td>
                </tr>
                <tr v-if="empresas.length === 0">
                  <td colspan="6" class="empty-state">Nenhuma empresa cadastrada</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import DashboardLayout from '../../components/layout/DashboardLayout.vue';
import KPICard from '../../components/dashboard/KPICard.vue';
import LineChart from '../../components/dashboard/LineChart.vue';
import BarChart from '../../components/dashboard/BarChart.vue';
import { useDashboard } from '../../composables/useDashboard';

const {
  loading,
  estatisticas,
  usuariosOnline,
  conversas,
  mensagens,
  empresas,
  empresaSelecionada,
  carregarDadosSuperAdmin,
  selecionarEmpresa
} = useDashboard();

const top5Empresas = computed(() => {
  return empresas.value.slice(0, 5);
});

onMounted(async () => {
  await carregarDadosSuperAdmin();
});

async function refresh() {
  await carregarDadosSuperAdmin();
}

function handleFiltroChange() {
  selecionarEmpresa(empresaSelecionada.value);
}
</script>

<style scoped>
.superadmin-dashboard {
  width: 100%;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-content h1 {
  font-size: 2rem;
  color: var(--cor-texto-primaria);
  margin-bottom: 0.25rem;
}

.header-content p {
  color: var(--cor-texto-secundaria);
  font-size: 1rem;
}

.btn-refresh {
  padding: 0.75rem 1.5rem;
  background: var(--cor-primaria);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-refresh:hover:not(:disabled) {
  background: var(--cor-primaria-hover);
}

.btn-refresh:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-state {
  text-align: center;
  padding: 4rem 2rem;
}

.spinner {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}

.filter-section {
  background: var(--cor-fundo-secundario);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.filter-section label {
  font-weight: 600;
  color: var(--cor-texto-primaria);
  white-space: nowrap;
}

.select-filter {
  flex: 1;
  max-width: 400px;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: var(--border-radius);
  font-size: 1rem;
  background: white;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 1.5rem;
}

.empresas-section {
  background: var(--cor-fundo-secundario);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.empresas-section h3 {
  font-size: 1.3rem;
  color: var(--cor-texto-primaria);
  margin-bottom: 1.5rem;
}

.table-responsive {
  overflow-x: auto;
}

.empresas-table {
  width: 100%;
  border-collapse: collapse;
}

.empresas-table thead {
  background: var(--cor-fundo);
}

.empresas-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: var(--cor-texto-primaria);
  border-bottom: 2px solid #e2e8f0;
}

.empresas-table td {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  color: var(--cor-texto-primaria);
}

.empresa-nome {
  font-weight: 600;
}

.badge-online {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  background: #d1fae5;
  color: #065f46;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.btn-tema {
  padding: 0.5rem 1rem;
  background: var(--cor-primaria);
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  transition: background 0.2s;
  display: inline-block;
}

.btn-tema:hover {
  background: var(--cor-primaria-hover);
}

.text-muted {
  color: var(--cor-texto-secundaria);
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--cor-texto-secundaria);
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .kpi-grid {
    grid-template-columns: 1fr;
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }

  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }

  .select-filter {
    max-width: 100%;
  }
}
</style>
