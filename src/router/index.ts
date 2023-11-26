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
import getRole from 'src/utils/getRole';
import { useRoleStore } from 'src/stores/role';
import { useUserStore } from 'src/stores/user';

// Define the router instance outside of the route function
const createHistory = process.env.SERVER
  ? createMemoryHistory
  : process.env.VUE_ROUTER_MODE === 'history'
  ? createWebHistory
  : createWebHashHistory;

const Router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  routes,
  history: createHistory(process.env.VUE_ROUTER_BASE),
});

// Use the router instance in the route function
export default route(function () {
  let role: string;
  const roleStore = useRoleStore();
  const userStore = useUserStore();

  Router.beforeEach(async (to, from, next) => {
    if (!userStore.$state.userId) {
      if (localStorage.getItem('token')) {
        try {
          const response = await getRole(localStorage.getItem('token'));
          userStore.$state.userId = response.data.data.id;
          userStore.$state.userImage = response.data.data.image;
          role = response.data.data.role.name;
          roleStore.$state.role = role;
        } catch (error) {
          throw error;
        }
      }
    }

    // Your navigation guard logic
    if (to.meta.requiresAuth && !isAuthenticated()) {
      next({ name: 'SignIn' });
    } else if (to.meta.requiresGuest && isAuthenticated()) {
      next('/');
    } else {
      if (to.meta.requiresSignUp) {
        const [student, company] = await Promise.all([
          getStudentByUserId(localStorage.getItem('token')),
          getCompanyByUserId(localStorage.getItem('token')),
        ]);
        if (student.data.isRegistered || company.data.isRegistered) {
          next('/');
        } else {
          next();
        }
      } else if (to.meta.requiresCompany) {
        if (roleStore.$state.role === 'company') next();
        else next({ name: 'Unauthorized' });
      } else if (to.meta.requiresdAdmin) {
        if (roleStore.$state.role === 'admin') next();
        else next({ name: 'Unauthorized' }); // Lanjutkan navigasi ke rute berikutnya
      } else {
        next();
      }
    }
  });

  return Router;
});

export { Router };
