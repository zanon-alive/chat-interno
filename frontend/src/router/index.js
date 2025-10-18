import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/auth';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/superadmin',
    name: 'SuperAdmin',
    component: () => import('../views/superadmin/Dashboard.vue'),
    meta: { requiresAuth: true, requiresRole: 'super_admin' }
  },
  {
    path: '/superadmin/empresas',
    name: 'SuperAdminEmpresas',
    component: () => import('../views/superadmin/Empresas.vue'),
    meta: { requiresAuth: true, requiresRole: 'super_admin' }
  },
  {
    path: '/superadmin/instancias',
    name: 'SuperAdminInstancias',
    component: () => import('../views/superadmin/Instancias.vue'),
    meta: { requiresAuth: true, requiresRole: 'super_admin' }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/admin/Dashboard.vue'),
    meta: { requiresAuth: true, requiresRole: 'admin_cliente' }
  },
  {
    path: '/admin/equipes',
    name: 'AdminEquipes',
    component: () => import('../views/admin/Equipes.vue'),
    meta: { requiresAuth: true, requiresRole: 'admin_cliente' }
  },
  {
    path: '/admin/usuarios',
    name: 'AdminUsuarios',
    component: () => import('../views/admin/Usuarios.vue'),
    meta: { requiresAuth: true, requiresRole: 'admin_cliente' }
  },
  {
    path: '/admin/tema',
    name: 'AdminTema',
    component: () => import('../views/admin/Tema.vue'),
    meta: { requiresAuth: true, requiresRole: 'admin_cliente' }
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('../views/chat/Chat.vue'),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresRole = to.meta.requiresRole;

  if (requiresAuth && !authStore.isAuthenticated) {
    // Não autenticado, redirecionar para login
    next('/login');
  } else if (requiresRole && authStore.usuario?.nivel_permissao !== requiresRole) {
    // Não tem permissão, redirecionar
    if (authStore.isSuperAdmin) {
      next('/superadmin');
    } else if (authStore.isAdminCliente) {
      next('/admin');
    } else {
      next('/chat');
    }
  } else {
    next();
  }
});

export default router;

