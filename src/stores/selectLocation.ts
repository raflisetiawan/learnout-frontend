import { defineStore } from 'pinia';
import { DisctrictInfo, ProvincesInfo, RegenciesInfo } from 'components/models';

export const useSelectLocationStore = defineStore('selectLocation', {
  state: () => ({
    province: null as ProvincesInfo | null,
    regency: null as RegenciesInfo | null,
    district: null as DisctrictInfo | null,
  }),
  actions: {
    removeLocationValues() {
      this.regency = null;
      this.district = null;
    },
  },
});
