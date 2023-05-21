import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
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
      },
    ],
  },
  // {
  //   path: '/signup',
  //   component: () => import('layouts/AuthLayout.vue'),
  //   children: [
  //     {
  //       path: '',
  //       component: () => import('src/pages/auth/SignUp.vue'),
  //       name: 'SignUp',
  //       meta: { requiresGuest: true },
  //     },
  //   ],
  // },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
