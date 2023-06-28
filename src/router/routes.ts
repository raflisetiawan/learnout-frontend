import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        name: 'Home',
      },
    ],
  },
  {
    path: '/contact',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/ContactPage.vue'),
        name: 'ContactPage',
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

  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    meta: { requiresdAdmin: true },
    children: [
      {
        path: '',
        component: () => import('pages/admin/IndexPage.vue'),
        name: 'Admin',
      },
      {
        path: 'universities/create',
        component: () => import('pages/admin/universities/CreatePage.vue'),
        name: 'CreateUniversity',
      },
      {
        path: 'universities',
        component: () => import('pages/admin/universities/IndexPage.vue'),
        name: 'Universities',
      },
      {
        path: 'universities/:id',
        component: () => import('pages/admin/universities/ShowPage.vue'),
        name: 'ShowUniversities',
      },
      {
        path: 'universities/:id/edit',
        component: () => import('pages/admin/universities/EditPage.vue'),
        name: 'EditUniversities',
      },
      {
        path: 'categories',
        component: () => import('pages/admin/categories/IndexPage.vue'),
        name: 'Categories',
      },
      {
        path: 'categories/create',
        component: () => import('pages/admin/categories/CreatePage.vue'),
        name: 'CreateCategory',
      },
      {
        path: 'categories/:id',
        component: () => import('pages/admin/categories/ShowPage.vue'),
        name: 'ShowCategory',
      },
      {
        path: 'categories/:id/edit',
        component: () => import('pages/admin/categories/EditPage.vue'),
        name: 'EditCategory',
      },
      {
        path: 'contact',
        component: () => import('pages/admin/contact/IndexPage.vue'),
        name: 'AdminContact',
      },
    ],
  },
  {
    path: '/company',
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/company/IndexPage.vue'),
        name: 'Company',
        meta: { requiresCompany: true },
      },
      {
        path: 'create',
        component: () => import('pages/company/job/CreateJob.vue'),
        name: 'CreateJob',
        meta: { requiresCompany: true },
      },
      {
        path: 'history',
        component: () => import('pages/company/job/HistoryPage.vue'),
        name: 'HistoryJobCompany',
        meta: { requiresCompany: true },
      },
      {
        path: 'job',
        component: () => import('pages/company/job/IndexPage.vue'),
        name: 'ListJob',
        meta: { requiresCompany: true },
      },
      {
        path: 'job/:id',
        component: () => import('pages/company/job/DetailPage.vue'),
        name: 'DetailJob',
        meta: { requiresCompany: true },
      },
      {
        path: 'job/edit/:id',
        component: () => import('pages/company/job/CompanyEditPage.vue'),
        name: 'CompanyEditJob',
        meta: { requiresCompany: true },
      },
      {
        path: 'job/student-application-list/:id',
        component: () => import('pages/company/job/ApplicationStudentList.vue'),
        name: 'StudentApplicationList',
        meta: { requiresCompany: true },
      },
      {
        path: 'job/student-application-list/student/:id',
        component: () => import('pages/company/job/StudentDetail.vue'),
        name: 'StudentDetailApplication',
        meta: { requiresCompany: true },
      },
    ],
  },

  {
    path: '/my-profile',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/my_profile/ProfilePage.vue'),
        meta: { requiresAuth: true },
        name: 'MyProfile',
      },
      {
        path: 'student/:id',
        component: () => import('src/pages/student/DetailPage.vue'),
        meta: { requiresAuth: true },
        name: 'StudentDetailProfile',
      },
    ],
  },
  {
    path: '/job',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/jobs/IndexPage.vue'),
        name: 'AllJob',
      },
      {
        path: ':id',
        component: () => import('src/pages/jobs/JobDetailPage.vue'),
        name: 'JobDetail',
      },
    ],
  },

  {
    path: '/application/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: ':id',
        component: () => import('src/pages/applications/IndexPage.vue'),
        meta: { requiresAuth: true },
        name: 'Application',
      },
      {
        path: 'success',
        component: () => import('src/pages/applications/SuccessPage.vue'),
        meta: { requiresAuth: true },
        name: 'ApplicationSuccess',
      },
    ],
  },
  {
    path: '/student/application',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/student/history/IndexPage.vue'),
        meta: { requiresAuth: true },
        name: 'HistoryApplication',
      },
      {
        path: ':id',
        component: () => import('src/pages/applications/EditPage.vue'),
        meta: { requiresAuth: true },
        name: 'EditHistoryApplication',
      },
    ],
  },
  {
    path: '/student/edit',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/student/EditPage.vue'),
        meta: { requiresAuth: true },
        name: 'EditStudent',
      },
    ],
  },
  {
    path: '/student/resume/create',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/student/resume/CreatePage.vue'),
        meta: { requiresAuth: true },
        name: 'CreateResumeStudent',
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/unauthorized',
    component: () => import('pages/NotAuthorized.vue'),
    name: 'Unauthorized',
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
