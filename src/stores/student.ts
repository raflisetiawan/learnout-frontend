import { defineStore } from 'pinia';

export const useStudentStore = defineStore('student', {
  state: () => ({
    studentId: '',
  }),
});
