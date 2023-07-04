import { defineStore } from 'pinia';
import { StudentInfo, UserInfo } from 'src/components/models';

export const useCompanyStore = defineStore('company', {
  state: () => ({
    companyId: 0,
    data: {
      company: {} as StudentInfo,
      user: { image: '' } as UserInfo,
    },
  }),
});
