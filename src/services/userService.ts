import { api } from '@/lib/axios';

export async function getProfile(token: string) {
  const response = await api.get('/users/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function registerUser(data: {
  name: string;
  email: string;
  username: string;
  password: string;
}) {
  const response = await api.post('/users/register', data);
  return response.data;
}
