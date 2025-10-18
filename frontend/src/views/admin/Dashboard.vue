<template>
  <DashboardLayout>
    <div class="admin-dashboard">
      <!-- Header -->
      <div class="dashboard-header">
        <div class="header-content">
          <h1>📊 Dashboard</h1>
          <p>Visão geral da sua instância</p>
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
            label="Conversas Ativas" 
            :value="estatisticas?.conversasAtivas || 0"
            variant="info"
          />
          <KPICard 
            icon="📨" 
            label="Mensagens Hoje" 
            :value="estatisticas?.mensagensHoje || 0"
            variant="default"
          />
          <KPICard 
            icon="⚡" 
            label="Taxa de Resposta" 
            :value="`${estatisticas?.taxaResposta || 0}%`"
            variant="warning"
          />
        </div>

        <!-- Gráficos -->
        <div class="charts-grid">
          <LineChart 
            title="📈 Usuários Online (Últimas 24h)" 
            :data="usuariosOnline"
            color="#48bb78"
          />
          <LineChart 
            title="📈 Conversas (Últimas 24h)" 
            :data="conversas"
            color="#667eea"
          />
          <LineChart 
            title="📈 Mensagens (Últimas 24h)" 
            :data="mensagens"
            color="#4299e1"
          />
          <BarChart 
            title="👥 Equipes Mais Ativas" 
            :data="equipes"
            labelKey="nome"
            valueKey="total_mensagens"
            color="#ed8936"
          />
        </div>

        <!-- Atalhos de Relatórios -->
        <div class="reports-section">
          <h3>📋 Relatórios e Ações Rápidas</h3>
          <div class="reports-grid">
            <router-link to="/admin/tema" class="report-card">
              <span class="report-icon">🎨</span>
              <h4>Personalização Visual</h4>
              <p>Configure o tema da sua instância</p>
            </router-link>

            <router-link to="/admin/usuarios" class="report-card">
              <span class="report-icon">👥</span>
              <h4>Gerenciar Usuários</h4>
              <p>Adicionar e editar usuários</p>
            </router-link>

            <router-link to="/admin/equipes" class="report-card">
              <span class="report-icon">👥</span>
              <h4>Gerenciar Equipes</h4>
              <p>Organizar equipes e hierarquia</p>
            </router-link>

            <router-link to="/chat" class="report-card">
              <span class="report-icon">💬</span>
              <h4>Ir para o Chat</h4>
              <p>Acessar conversas</p>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { onMounted } from 'vue';
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
  equipes,
  carregarDadosAdmin
} = useDashboard();

onMounted(async () => {
  await carregarDadosAdmin();
});

async function refresh() {
  await carregarDadosAdmin();
}
</script>

<style scoped>
.admin-dashboard {
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
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 1.5rem;
}

.reports-section h3 {
  font-size: 1.3rem;
  color: var(--cor-texto-primaria);
  margin-bottom: 1rem;
}

.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.report-card {
  background: var(--cor-fundo-secundario);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.report-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.report-icon {
  font-size: 2rem;
}

.report-card h4 {
  font-size: 1.1rem;
  color: var(--cor-texto-primaria);
  font-weight: 600;
}

.report-card p {
  font-size: 0.9rem;
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

  .reports-grid {
    grid-template-columns: 1fr;
  }
}
</style>
