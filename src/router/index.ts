import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

import routes from './routes';
import isAuthenticated from 'src/utils/isAuthenticated';
import getStudentByUserId from 'src/utils/getStudentByUserId';
import getCompanyByUserId from 'src/utils/getCompanyByUserId';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(async (to, from, next) => {
    if (to.meta.requiresAuth && !isAuthenticated()) {
      next({ name: 'SignIn' });
    } else if (to.meta.requiresGuest && isAuthenticated()) {
      next('/');
    } else {
      if (to.meta.requiresSignUp) {
        const student = await getStudentByUserId(localStorage.getItem('token'));
        const company = await getCompanyByUserId(localStorage.getItem('token'));
        if (student.data.isRegistered) next('/');
        else if (company.data.isRegistered) next('/');
        else next();
      } else {
        next(); // Lanjutkan navigasi ke rute berikutnya
      }
    }
  });

  return Router;
});
