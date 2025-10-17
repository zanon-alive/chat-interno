<template>
  <div class="login-container">
    <div class="login-box">
      <h1>Chat Interno</h1>
      <p class="subtitle">Sistema Multi-tenant de Comunicação</p>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="seu@email.com"
            required
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="senha">Senha</label>
          <input
            id="senha"
            v-model="senha"
            type="password"
            placeholder="••••••••"
            required
            :disabled="loading"
          />
        </div>

        <button type="submit" :disabled="loading" class="btn-login">
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </form>

      <div class="test-users">
        <p><strong>Usuários de Teste:</strong></p>
        <p>Super Admin: admin@chatinterno.com / Admin@123456</p>
        <p>Admin Cliente: joao.silva@empresademo.com / Admin@123456</p>
        <p>Usuário: pedro.oliveira@empresademo.com / User@123456</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/auth';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const senha = ref('');
const loading = ref(false);
const error = ref(null);

async function handleLogin() {
  loading.value = true;
  error.value = null;

  try {
    await authStore.login(email.value, senha.value);

    // Redirecionar baseado no nível
    if (authStore.isSuperAdmin) {
      router.push('/superadmin');
    } else if (authStore.isAdminCliente) {
      router.push('/admin');
    } else {
      router.push('/chat');
    }
  } catch (err) {
    error.value = err || 'Erro ao fazer login';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
}

h1 {
  color: #333;
  margin-bottom: 0.5rem;
  text-align: center;
  font-size: 2rem;
}

.subtitle {
  color: #666;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #667eea;
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.btn-login {
  width: 100%;
  padding: 0.85rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #fee;
  color: #c33;
  border-radius: 6px;
  text-align: center;
  font-size: 0.9rem;
}

.test-users {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
  font-size: 0.8rem;
  color: #666;
}

.test-users p {
  margin: 0.3rem 0;
}

.test-users strong {
  color: #333;
}
</style>

