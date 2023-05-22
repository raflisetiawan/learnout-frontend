import { api } from 'src/boot/axios';

const getUser = async (token: null | string) => {
  try {
    const response = await api.get('user', {
      headers: { Authorization: 'Bearer ' + token },
    });
    return response;
  } catch (error) {
    throw new Error('An error occurred.');
  }
};

export default getUser;
