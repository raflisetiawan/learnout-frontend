import { defineStore } from 'pinia';
import { StudentInfo, UserInfo, UniversitiesInfo } from 'src/components/models';

export const useStudentStore = defineStore('student', {
  state: () => ({
    studentId: '',
    data: {
      student: {} as StudentInfo,
      university: {} as UniversitiesInfo,
      user: {} as UserInfo,
    },
  }),
});

// const getData = async () => {
//   const roleStore = useRoleStore();
//   const userStore = useUserStore();
//   if (roleStore.$state.role === 'company') {
//     try {
//       const response = await api.get(`/users/getUserAndCompanyByUserId/${userStore.$state.userId}`);
//       // userData.value = { ...userData.value, ...response.data.user }
//       // companyData.value = { ...companyData.value, ...response.data.data };
//     } catch (error) {
//       throw error;
//     }
//   } else if (roleStore.$state.role === 'user') {
//     try {
//       const response = await api.get(`/users/getUserAndStudentByUserId/${userStore.$state.userId}`);
//       userData.value = { ...userData.value, ...response.data.user }
//       studentData.value = { ...studentData.value, ...response.data.student };
//       studentStore.$state.data = studentStore.$state.data || {}; // Ensure `data` is not null
//       studentStore.$state.data.student = response.data.student;
//       studentStore.$state.data.user = response.data.user;
//       try {
//         const response = await api.get(`universities/${studentData.value.university_id}`);
//         universityData.value = { ...universityData.value, ...response.data.data };
//       } catch (error) {
//         throw error;
//       }
//     } catch (error) {
//       throw error;
//     }
//   }
// }
