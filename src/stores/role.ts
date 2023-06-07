import { defineStore } from 'pinia';

export const useRoleStore = defineStore('role', {
  state: () => ({
    role: '',
  }),
});
