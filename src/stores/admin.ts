import { defineStore } from 'pinia';
import { UserInfo } from 'src/components/models';

export const useAdminStore = defineStore('admin', {
  state: () => ({
    data: {
      user: {
        image: 'http://127.0.0.1:8000/storage/users/images/user.png',
      } as UserInfo,
    },
  }),
});
