import { defineStore } from 'pinia';
import { JobWithCompanyWithCategoriesInfo } from 'src/components/models';

export const useJobStore = defineStore('job', {
  state: () => ({
    temporaryJob: null as JobWithCompanyWithCategoriesInfo | null,
  }),
});
