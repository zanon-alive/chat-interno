<template>
  <div class="configuracao-tema">
    <div class="tema-header">
      <h2>🎨 Personalização Visual (White-Label)</h2>
      <p>Configure as cores e logo da sua instância</p>
    </div>

    <div v-if="carregando" class="loading">
      <span>⏳ Carregando configurações...</span>
    </div>

    <div v-else class="tema-container">
      <!-- Logo -->
      <div class="tema-section">
        <h3>📸 Logo da Empresa</h3>
        <div class="logo-config">
          <div v-if="tema.logo_url" class="logo-preview">
            <img 
              :src="tema.logo_url" 
              :width="tema.logo_width" 
              :height="tema.logo_height" 
              alt="Logo"
            />
          </div>
          
          <div class="logo-inputs">
            <div class="form-group">
              <label>URL do Logo</label>
              <input 
                v-model="tema.logo_url" 
                type="url" 
                placeholder="https://exemplo.com/logo.png"
                class="input-text"
              />
              <small>Informe a URL da imagem do logo</small>
            </div>
            
            <div class="logo-dimensions">
              <div class="form-group">
                <label>Largura (px)</label>
                <input 
                  v-model.number="tema.logo_width" 
                  type="number" 
                  min="50" 
                  max="500"
                  class="input-number"
                />
              </div>
              <div class="form-group">
                <label>Altura (px)</label>
                <input 
                  v-model.number="tema.logo_height" 
                  type="number" 
                  min="20" 
                  max="200"
                  class="input-number"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cores Primárias -->
      <div class="tema-section">
        <h3>🎨 Cores Primárias</h3>
        <div class="cores-grid">
          <div class="cor-item">
            <label>Cor Primária</label>
            <input v-model="tema.cor_primaria" type="color" class="color-picker" />
            <input v-model="tema.cor_primaria" type="text" class="color-text" />
          </div>
          
          <div class="cor-item">
            <label>Cor Primária (Hover)</label>
            <input v-model="tema.cor_primaria_hover" type="color" class="color-picker" />
            <input v-model="tema.cor_primaria_hover" type="text" class="color-text" />
          </div>
          
          <div class="cor-item">
            <label>Cor Secundária</label>
            <input v-model="tema.cor_secundaria" type="color" class="color-picker" />
            <input v-model="tema.cor_secundaria" type="text" class="color-text" />
          </div>
        </div>
      </div>

      <!-- Cores de Fundo -->
      <div class="tema-section">
        <h3>🖼️ Cores de Fundo</h3>
        <div class="cores-grid">
          <div class="cor-item">
            <label>Fundo Principal</label>
            <input v-model="tema.cor_fundo" type="color" class="color-picker" />
            <input v-model="tema.cor_fundo" type="text" class="color-text" />
          </div>
          
          <div class="cor-item">
            <label>Fundo Secundário</label>
            <input v-model="tema.cor_fundo_secundario" type="color" class="color-picker" />
            <input v-model="tema.cor_fundo_secundario" type="text" class="color-text" />
          </div>
        </div>
      </div>

      <!-- Cores de Texto -->
      <div class="tema-section">
        <h3>📝 Cores de Texto</h3>
        <div class="cores-grid">
          <div class="cor-item">
            <label>Texto Primário</label>
            <input v-model="tema.cor_texto_primaria" type="color" class="color-picker" />
            <input v-model="tema.cor_texto_primaria" type="text" class="color-text" />
          </div>
          
          <div class="cor-item">
            <label>Texto Secundário</label>
            <input v-model="tema.cor_texto_secundaria" type="color" class="color-picker" />
            <input v-model="tema.cor_texto_secundaria" type="text" class="color-text" />
          </div>
        </div>
      </div>

      <!-- Cores do Chat -->
      <div class="tema-section">
        <h3>💬 Cores do Chat</h3>
        <div class="cores-grid">
          <div class="cor-item">
            <label>Mensagem Enviada</label>
            <input v-model="tema.cor_mensagem_enviada" type="color" class="color-picker" />
            <input v-model="tema.cor_mensagem_enviada" type="text" class="color-text" />
          </div>
          
          <div class="cor-item">
            <label>Mensagem Recebida</label>
            <input v-model="tema.cor_mensagem_recebida" type="color" class="color-picker" />
            <input v-model="tema.cor_mensagem_recebida" type="text" class="color-text" />
          </div>
        </div>
      </div>

      <!-- Cores de Estado -->
      <div class="tema-section">
        <h3>✨ Cores de Estado</h3>
        <div class="cores-grid">
          <div class="cor-item">
            <label>Sucesso</label>
            <input v-model="tema.cor_sucesso" type="color" class="color-picker" />
            <input v-model="tema.cor_sucesso" type="text" class="color-text" />
          </div>
          
          <div class="cor-item">
            <label>Erro</label>
            <input v-model="tema.cor_erro" type="color" class="color-picker" />
            <input v-model="tema.cor_erro" type="text" class="color-text" />
          </div>
          
          <div class="cor-item">
            <label>Alerta</label>
            <input v-model="tema.cor_alerta" type="color" class="color-picker" />
            <input v-model="tema.cor_alerta" type="text" class="color-text" />
          </div>
          
          <div class="cor-item">
            <label>Info</label>
            <input v-model="tema.cor_info" type="color" class="color-picker" />
            <input v-model="tema.cor_info" type="text" class="color-text" />
          </div>
        </div>
      </div>

      <!-- Configurações Adicionais -->
      <div class="tema-section">
        <h3>⚙️ Configurações Adicionais</h3>
        <div class="config-grid">
          <div class="form-group">
            <label>Fonte Principal</label>
            <input 
              v-model="tema.fonte_principal" 
              type="text" 
              placeholder="Inter, sans-serif"
              class="input-text"
            />
          </div>
          
          <div class="form-group">
            <label>Border Radius (px)</label>
            <input 
              v-model.number="tema.border_radius" 
              type="range" 
              min="0" 
              max="50" 
              class="input-range"
            />
            <span class="range-value">{{ tema.border_radius }}px</span>
          </div>
        </div>
      </div>

      <!-- Ações -->
      <div class="tema-actions">
        <button @click="visualizar" class="btn btn-secondary">
          👁️ Visualizar
        </button>
        <button @click="resetar" class="btn btn-warning" :disabled="salvando">
          🔄 Resetar para Padrão
        </button>
        <button @click="salvar" class="btn btn-primary" :disabled="salvando">
          {{ salvando ? '💾 Salvando...' : '💾 Salvar Alterações' }}
        </button>
      </div>

      <!-- Mensagens -->
      <div v-if="mensagem" :class="['mensagem', mensagem.tipo]">
        {{ mensagem.texto }}
      </div>
    </div>

    <!-- Histórico de Alterações -->
    <div v-if="mostrarLogs" class="logs-section">
      <h3>📋 Histórico de Alterações</h3>
      <div v-if="carregandoLogs" class="loading-logs">Carregando...</div>
      <div v-else-if="logs.length === 0" class="empty-logs">Nenhuma alteração registrada</div>
      <div v-else class="logs-lista">
        <div v-for="log in logs" :key="log.id" class="log-item">
          <div class="log-header">
            <span class="log-acao">{{ log.acao }}</span>
            <span class="log-data">{{ formatarData(log.created_at) }}</span>
          </div>
          <div class="log-usuario">
            Por: {{ log.usuario?.nome_completo || 'Sistema' }}
          </div>
          <div v-if="log.descricao" class="log-descricao">
            {{ log.descricao }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useTheme } from '../../composables/useTheme';
import temaService from '../../services/temaService';

const { atualizarTema, temaPadrao } = useTheme();

const carregando = ref(true);
const salvando = ref(false);
const mensagem = ref(null);
const mostrarLogs = ref(false);
const logs = ref([]);
const carregandoLogs = ref(false);

const tema = ref({
  logo_url: null,
  logo_width: 150,
  logo_height: 50,
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
  border_radius: 8
});

onMounted(async () => {
  await carregarTema();
  await carregarLogs();
});

async function carregarTema() {
  try {
    carregando.value = true;
    const response = await temaService.obterTema();
    if (response.success && response.data) {
      tema.value = { ...tema.value, ...response.data };
    }
  } catch (error) {
    console.error('Erro ao carregar tema:', error);
    mostrarMensagem('Erro ao carregar configurações', 'erro');
  } finally {
    carregando.value = false;
  }
}

async function salvar() {
  try {
    salvando.value = true;
    const response = await temaService.atualizarTema(tema.value);
    
    if (response.success) {
      // Atualizar tema na aplicação
      atualizarTema(response.data);
      mostrarMensagem('✅ Tema atualizado com sucesso!', 'sucesso');
      await carregarLogs();
    }
  } catch (error) {
    console.error('Erro ao salvar tema:', error);
    mostrarMensagem('❌ Erro ao salvar tema', 'erro');
  } finally {
    salvando.value = false;
  }
}

async function resetar() {
  if (!confirm('Deseja realmente resetar o tema para as configurações padrão?')) {
    return;
  }

  try {
    salvando.value = true;
    const response = await temaService.resetarTema();
    
    if (response.success) {
      tema.value = { ...tema.value, ...response.data };
      atualizarTema(response.data);
      mostrarMensagem('✅ Tema resetado para padrão!', 'sucesso');
      await carregarLogs();
    }
  } catch (error) {
    console.error('Erro ao resetar tema:', error);
    mostrarMensagem('❌ Erro ao resetar tema', 'erro');
  } finally {
    salvando.value = false;
  }
}

function visualizar() {
  // Preview em tempo real
  atualizarTema(tema.value);
  mostrarMensagem('👁️ Visualizando tema (não salvo ainda)', 'info');
}

async function carregarLogs() {
  try {
    carregandoLogs.value = true;
    mostrarLogs.value = true;
    const response = await temaService.listarLogs(1, 10);
    if (response.success) {
      logs.value = response.logs || [];
    }
  } catch (error) {
    console.error('Erro ao carregar logs:', error);
  } finally {
    carregandoLogs.value = false;
  }
}

function mostrarMensagem(texto, tipo) {
  mensagem.value = { texto, tipo };
  setTimeout(() => {
    mensagem.value = null;
  }, 5000);
}

function formatarData(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('pt-BR');
}
</script>

<style scoped>
.configuracao-tema {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.tema-header {
  margin-bottom: 2rem;
}

.tema-header h2 {
  font-size: 2rem;
  color: var(--cor-texto-primaria);
  margin-bottom: 0.5rem;
}

.tema-header p {
  color: var(--cor-texto-secundaria);
}

.loading {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: var(--cor-texto-secundaria);
}

.tema-container {
  background: var(--cor-fundo-secundario);
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tema-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.tema-section:last-child {
  border-bottom: none;
}

.tema-section h3 {
  font-size: 1.3rem;
  color: var(--cor-texto-primaria);
  margin-bottom: 1rem;
}

/* Logo */
.logo-config {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.logo-preview {
  padding: 1rem;
  background: #f9fafb;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  min-width: 200px;
  text-align: center;
}

.logo-preview img {
  max-width: 100%;
  height: auto;
}

.logo-inputs {
  flex: 1;
}

.logo-dimensions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
}

/* Cores */
.cores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.cor-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.cor-item label {
  font-weight: 500;
  color: var(--cor-texto-primaria);
  font-size: 0.9rem;
}

.color-picker {
  width: 100%;
  height: 60px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
}

.color-text {
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-family: monospace;
  text-transform: uppercase;
}

/* Form Groups */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: var(--cor-texto-primaria);
}

.input-text, .input-number {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
}

.input-range {
  width: 100%;
}

.range-value {
  display: inline-block;
  margin-left: 1rem;
  font-weight: 600;
  color: var(--cor-primaria);
}

.config-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

/* Ações */
.tema-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e2e8f0;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--cor-primaria);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--cor-primaria-hover);
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-warning {
  background: var(--cor-alerta);
  color: white;
}

/* Mensagens */
.mensagem {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 8px;
  font-weight: 500;
}

.mensagem.sucesso {
  background: #d1fae5;
  color: #065f46;
}

.mensagem.erro {
  background: #fee2e2;
  color: #991b1b;
}

.mensagem.info {
  background: #dbeafe;
  color: #1e40af;
}

/* Logs */
.logs-section {
  margin-top: 3rem;
  background: var(--cor-fundo-secundario);
  border-radius: var(--border-radius);
  padding: 2rem;
}

.logs-section h3 {
  margin-bottom: 1.5rem;
}

.logs-lista {
  max-height: 400px;
  overflow-y: auto;
}

.log-item {
  padding: 1rem;
  border-left: 4px solid var(--cor-primaria);
  background: #f9fafb;
  margin-bottom: 1rem;
  border-radius: 4px;
}

.log-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.log-acao {
  font-weight: 600;
  color: var(--cor-primaria);
  text-transform: uppercase;
  font-size: 0.85rem;
}

.log-data {
  color: var(--cor-texto-secundaria);
  font-size: 0.85rem;
}

.log-usuario {
  color: var(--cor-texto-secundaria);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.log-descricao {
  color: var(--cor-texto-primaria);
  font-size: 0.95rem;
}

.empty-logs {
  text-align: center;
  padding: 2rem;
  color: var(--cor-texto-secundaria);
}

small {
  color: var(--cor-texto-secundaria);
  font-size: 0.85rem;
}
</style>

