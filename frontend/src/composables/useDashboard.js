import { ref, computed } from 'vue';
import { useAuthStore } from '../store/auth';
import estatisticasService from '../services/estatisticasService';

export function useDashboard() {
  const authStore = useAuthStore();
  
  const loading = ref(false);
  const estatisticas = ref(null);
  const usuariosOnline = ref([]);
  const conversas = ref([]);
  const mensagens = ref([]);
  const equipes = ref([]);
  const empresas = ref([]);
  const empresaSelecionada = ref(null);

  const isSuperAdmin = computed(() => authStore.isSuperAdmin);
  const isAdmin = computed(() => authStore.isAdminCliente);

  /**
   * Carregar todos os dados do dashboard (Admin)
   */
  async function carregarDadosAdmin() {
    loading.value = true;
    try {
      const [
        respostaGeral,
        respostaOnline,
        respostaConversas,
        respostaMensagens,
        respostaEquipes
      ] = await Promise.all([
        estatisticasService.obterGeral(),
        estatisticasService.usuariosOnlinePorHora(),
        estatisticasService.conversasPorHora(),
        estatisticasService.mensagensPorHora(),
        estatisticasService.equipesAtividade()
      ]);

      estatisticas.value = respostaGeral.data;
      usuariosOnline.value = respostaOnline.data || [];
      conversas.value = respostaConversas.data || [];
      mensagens.value = respostaMensagens.data || [];
      equipes.value = respostaEquipes.data || [];

      console.log('✅ Dados do dashboard Admin carregados');
    } catch (error) {
      console.error('❌ Erro ao carregar dados do dashboard:', error);
    } finally {
      loading.value = false;
    }
  }

  /**
   * Carregar todos os dados do dashboard (SuperAdmin)
   */
  async function carregarDadosSuperAdmin() {
    loading.value = true;
    try {
      const [
        respostaGeral,
        respostaOnline,
        respostaConversas,
        respostaMensagens,
        respostaEmpresas
      ] = await Promise.all([
        estatisticasService.obterGeralSuperAdmin(),
        estatisticasService.usuariosOnlinePorHoraSuperAdmin(empresaSelecionada.value),
        estatisticasService.conversasPorHoraSuperAdmin(empresaSelecionada.value),
        estatisticasService.mensagensPorHoraSuperAdmin(empresaSelecionada.value),
        estatisticasService.detalheEmpresas()
      ]);

      estatisticas.value = respostaGeral.data;
      usuariosOnline.value = respostaOnline.data || [];
      conversas.value = respostaConversas.data || [];
      mensagens.value = respostaMensagens.data || [];
      empresas.value = respostaEmpresas.data || [];

      console.log('✅ Dados do dashboard SuperAdmin carregados');
    } catch (error) {
      console.error('❌ Erro ao carregar dados do dashboard:', error);
    } finally {
      loading.value = false;
    }
  }

  /**
   * Recarregar gráficos quando filtro de empresa mudar (SuperAdmin)
   */
  async function recarregarGraficosSuperAdmin() {
    try {
      const [respostaOnline, respostaConversas, respostaMensagens] = await Promise.all([
        estatisticasService.usuariosOnlinePorHoraSuperAdmin(empresaSelecionada.value),
        estatisticasService.conversasPorHoraSuperAdmin(empresaSelecionada.value),
        estatisticasService.mensagensPorHoraSuperAdmin(empresaSelecionada.value)
      ]);

      usuariosOnline.value = respostaOnline.data || [];
      conversas.value = respostaConversas.data || [];
      mensagens.value = respostaMensagens.data || [];

      console.log('🔄 Gráficos atualizados para empresa:', empresaSelecionada.value);
    } catch (error) {
      console.error('❌ Erro ao recarregar gráficos:', error);
    }
  }

  /**
   * Carregar dados iniciais baseado no role
   */
  async function carregarDados() {
    if (isSuperAdmin.value) {
      await carregarDadosSuperAdmin();
    } else if (isAdmin.value) {
      await carregarDadosAdmin();
    }
  }

  /**
   * Atualizar empresa selecionada (SuperAdmin)
   */
  function selecionarEmpresa(empresaId) {
    empresaSelecionada.value = empresaId;
    recarregarGraficosSuperAdmin();
  }

  return {
    // Estado
    loading,
    estatisticas,
    usuariosOnline,
    conversas,
    mensagens,
    equipes,
    empresas,
    empresaSelecionada,

    // Computed
    isSuperAdmin,
    isAdmin,

    // Métodos
    carregarDados,
    carregarDadosAdmin,
    carregarDadosSuperAdmin,
    recarregarGraficosSuperAdmin,
    selecionarEmpresa
  };
}

