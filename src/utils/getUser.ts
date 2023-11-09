import { api } from 'src/boot/axios';
import { Router } from '../router';
import { AxiosError } from 'axios';

const getUser = async (token: null | string) => {
  try {
    const response = await api.get('user', {
      headers: { Authorization: 'Bearer ' + token },
    });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.status !== 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('signedIn');
        Router.push({ name: 'SignIn' });
      } else {
        throw new Error('An error occurred.');
      }
    }
  }
};

export default getUser;
