import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/LoginPage.vue'),
    meta: { requiresAuth: false, guestOnly: true },
  },
  {
    path: '/login/forgot',
    name: 'ForgotPassword',
    component: () => import('@/pages/LoginPage.vue'),
    meta: { requiresAuth: false, guestOnly: true },
  },
  {
    path: '/login/verify-code',
    name: 'VerifyResetCode',
    component: () => import('@/pages/LoginPage.vue'),
    meta: { requiresAuth: false, guestOnly: true },
  },
  {
    path: '/login/new-password',
    name: 'NewPassword',
    component: () => import('@/pages/LoginPage.vue'),
    meta: { requiresAuth: false, guestOnly: true },
  },
  {
    path: '/login/verify-account',
    name: 'VerifyAccount',
    component: () => import('@/pages/LoginPage.vue'),
    meta: { requiresAuth: false, guestOnly: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/pages/SignUpPage.vue'),
    meta: { requiresAuth: false, guestOnly: true },
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/pages/DashboardPage.vue'),
      },
      {
        path: 'assets',
        name: 'AssetManagement',
        component: () => import('@/pages/AssetManagementPage.vue'),
      },
      {
        path: 'assets/new',
        name: 'CreateAsset',
        component: () => import('@/components/Inventory/AssetForm.vue'),
      },
      {
        path: 'assets/:id',
        name: 'AssetDetail',
        component: () => import('@/pages/AssetDetailPage.vue'),
        props: true,
      },
      {
        path: 'assets/:id/edit',
        name: 'EditAsset',
        component: () => import('@/components/Inventory/AssetForm.vue'),
        props: true,
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/pages/ProfilePage.vue'),
      },
      {
        path: 'profile/edit',
        name: 'ProfileEdit',
        component: () => import('@/pages/ProfileEditPage.vue'),
      },

      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/pages/SettingsPage.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();

  const redirect = await authStore.resolveRouteGuard(to);

  if (redirect) {
    next(redirect);
  } else {
    next();
  }
});

export default router;
