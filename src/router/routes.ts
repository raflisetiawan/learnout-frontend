import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },

  {
    path: '/signin',
    component: () => import('layouts/AuthLayout.vue'),
    meta: { requiresGuest: true },
    children: [
      {
        path: '',
        component: () => import('src/pages/auth/SignIn.vue'),
        name: 'SignIn',
        meta: {
          requiresGuest: true,
        },
      },
    ],
  },
  {
    path: '/signup',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/auth/SignUp.vue'),
        name: 'SignUp',
        meta: { requiresGuest: true },
      },
    ],
  },
  {
    path: '/choose-role',
    component: () => import('src/pages/auth/ChooseRole.vue'),
    meta: { requiresSignUp: true },
    name: 'ChooseRole',
  },
  {
    path: '/choose-role/student',
    component: () => import('src/pages/auth/StudentRegistration.vue'),
    meta: { requiresSignUp: true },
    name: 'StudentRegistration',
  },
  {
    path: '/choose-role/company',
    component: () => import('src/pages/auth/CompaniesRegistration.vue'),
    meta: { requiresSignUp: true },
    name: 'CompanyRegistration',
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
