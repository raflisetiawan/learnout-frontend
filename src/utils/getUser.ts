import { api } from 'src/boot/axios';
import { Router } from '../router';

const getUser = async (token: null | string) => {
  try {
    const response = await api.get('user', {
      headers: { Authorization: 'Bearer ' + token },
    });
    return response;
  } catch (error) {
    Router.push({ name: 'SignIn' });
    throw new Error('An error occurred.');
  }
};

export default getUser;
