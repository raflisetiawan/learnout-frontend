import { defineStore } from 'pinia';
import { TimeFilter } from 'src/components/models';

export const useFilterSearchStore = defineStore('filterSearch', {
  state: () => ({
    keyword: '' as string,
    regency: '' as string | undefined,
    categories: [] as string[],
    isFilter: false as boolean,
    timeFilter: {
      startTime: '17:00',
      endTime: '20:00',
    } as TimeFilter,
    isTimeFilter: false,
  }),
});
