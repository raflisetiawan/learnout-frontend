import { api } from 'src/boot/axios';
import getUser from './getUser';

const getStudentByUserId = async (token: string | null) => {
  try {
    const user = await getUser(token);
    try {
      const response = await api.get(`students/user-id/${user.data.id}`);
      return response;
    } catch (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
};

export default getStudentByUserId;
