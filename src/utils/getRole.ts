import { api } from 'src/boot/axios';
import getUser from './getUser';

const getRole = async (token: string | null) => {
  try {
    const user = await getUser(token);
    try {
      const response = await api.get(`users/${user.data.id}`);
      return response;
    } catch (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
};

export default getRole;
