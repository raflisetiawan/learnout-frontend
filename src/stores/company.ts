import { defineStore } from 'pinia';

export const useCompanyStore = defineStore('company', {
  state: () => ({
    companyId: 0,
  }),
});
