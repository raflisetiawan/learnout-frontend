import { defineStore } from 'pinia';

export const useFilterSearchStore = defineStore('filterSearch', {
  state: () => ({
    keyword: '' as string,
    regency: '' as string | undefined,
    categories: [] as string[],
    isFilter: false as boolean,
  }),
});
