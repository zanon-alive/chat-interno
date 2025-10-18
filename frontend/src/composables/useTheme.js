import { ref, computed, watch } from 'vue';
import { useAuthStore } from '../store/auth';

// Estado global do tema (reativo)
const temaAtual = ref(null);
const temaCarregado = ref(false);

export function useTheme() {
  const authStore = useAuthStore();

  /**
   * Tema padrão do sistema
   */
  const temaPadrao = {
    cor_primaria: '#667eea',
    cor_primaria_hover: '#5568d3',
    cor_secundaria: '#764ba2',
    cor_fundo: '#f7fafc',
    cor_fundo_secundario: '#ffffff',
    cor_texto_primaria: '#2d3748',
    cor_texto_secundaria: '#718096',
    cor_mensagem_enviada: '#667eea',
    cor_mensagem_recebida: '#e2e8f0',
    cor_sucesso: '#48bb78',
    cor_erro: '#f56565',
    cor_alerta: '#ed8936',
    cor_info: '#4299e1',
    fonte_principal: 'Inter, sans-serif',
    border_radius: 8,
    logo_url: null,
    logo_width: 150,
    logo_height: 50
  };

  /**
   * Aplicar tema no documento (CSS Variables)
   */
  const aplicarTema = (tema) => {
    if (!tema) {
      tema = temaPadrao;
    }

    const root = document.documentElement;

    // Aplicar cores
    root.style.setProperty('--cor-primaria', tema.cor_primaria);
    root.style.setProperty('--cor-primaria-hover', tema.cor_primaria_hover);
    root.style.setProperty('--cor-secundaria', tema.cor_secundaria);
    root.style.setProperty('--cor-fundo', tema.cor_fundo);
    root.style.setProperty('--cor-fundo-secundario', tema.cor_fundo_secundario);
    root.style.setProperty('--cor-texto-primaria', tema.cor_texto_primaria);
    root.style.setProperty('--cor-texto-secundaria', tema.cor_texto_secundaria);
    root.style.setProperty('--cor-mensagem-enviada', tema.cor_mensagem_enviada);
    root.style.setProperty('--cor-mensagem-recebida', tema.cor_mensagem_recebida);
    root.style.setProperty('--cor-sucesso', tema.cor_sucesso);
    root.style.setProperty('--cor-erro', tema.cor_erro);
    root.style.setProperty('--cor-alerta', tema.cor_alerta);
    root.style.setProperty('--cor-info', tema.cor_info);

    // Aplicar configurações
    root.style.setProperty('--fonte-principal', tema.fonte_principal || 'Inter, sans-serif');
    root.style.setProperty('--border-radius', `${tema.border_radius || 8}px`);

    // Aplicar ao body também
    document.body.style.backgroundColor = tema.cor_fundo;
    document.body.style.color = tema.cor_texto_primaria;

    temaAtual.value = tema;
    temaCarregado.value = true;

    console.log('🎨 Tema aplicado:', tema);
  };

  /**
   * Carregar tema do usuário autenticado
   */
  const carregarTema = () => {
    try {
      // Tentar pegar tema do authStore
      const tema = authStore.usuario?.tema || authStore.tema;

      if (tema) {
        console.log('✅ Tema encontrado no authStore');
        aplicarTema(tema);
      } else {
        console.log('⚠️ Nenhum tema encontrado, usando padrão');
        aplicarTema(temaPadrao);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar tema:', error);
      aplicarTema(temaPadrao);
    }
  };

  /**
   * Atualizar tema (usado após salvar configurações)
   */
  const atualizarTema = (novoTema) => {
    aplicarTema(novoTema);
    
    // Atualizar no authStore também
    if (authStore.usuario) {
      authStore.usuario.tema = novoTema;
    }
  };

  /**
   * Resetar para tema padrão
   */
  const resetarTema = () => {
    aplicarTema(temaPadrao);
  };

  /**
   * Obter CSS Variables como objeto
   */
  const getCSSVariables = computed(() => {
    if (!temaAtual.value) return {};

    return {
      '--cor-primaria': temaAtual.value.cor_primaria,
      '--cor-primaria-hover': temaAtual.value.cor_primaria_hover,
      '--cor-secundaria': temaAtual.value.cor_secundaria,
      '--cor-fundo': temaAtual.value.cor_fundo,
      '--cor-fundo-secundario': temaAtual.value.cor_fundo_secundario,
      '--cor-texto-primaria': temaAtual.value.cor_texto_primaria,
      '--cor-texto-secundaria': temaAtual.value.cor_texto_secundaria,
      '--cor-mensagem-enviada': temaAtual.value.cor_mensagem_enviada,
      '--cor-mensagem-recebida': temaAtual.value.cor_mensagem_recebida,
      '--cor-sucesso': temaAtual.value.cor_sucesso,
      '--cor-erro': temaAtual.value.cor_erro,
      '--cor-alerta': temaAtual.value.cor_alerta,
      '--cor-info': temaAtual.value.cor_info,
      '--fonte-principal': temaAtual.value.fonte_principal,
      '--border-radius': `${temaAtual.value.border_radius}px`
    };
  });

  /**
   * Logo da instância
   */
  const logo = computed(() => {
    if (!temaAtual.value || !temaAtual.value.logo_url) {
      return null;
    }

    return {
      url: temaAtual.value.logo_url,
      width: temaAtual.value.logo_width || 150,
      height: temaAtual.value.logo_height || 50
    };
  });

  /**
   * Verificar se tema está personalizado (diferente do padrão)
   */
  const isPersonalizado = computed(() => {
    if (!temaAtual.value) return false;
    return temaAtual.value.cor_primaria !== temaPadrao.cor_primaria;
  });

  // Watch para mudanças no authStore
  watch(
    () => authStore.usuario?.tema,
    (novoTema) => {
      if (novoTema) {
        console.log('🔄 Tema atualizado no authStore, reaplicando...');
        aplicarTema(novoTema);
      }
    },
    { deep: true }
  );

  return {
    // Estado
    temaAtual,
    temaCarregado,
    temaPadrao,
    
    // Computeds
    getCSSVariables,
    logo,
    isPersonalizado,
    
    // Métodos
    carregarTema,
    aplicarTema,
    atualizarTema,
    resetarTema
  };
}

