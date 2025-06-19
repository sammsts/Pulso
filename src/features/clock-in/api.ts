import { api } from '@/lib/axios';

export const registerClockIn = async (userId: string) => {
  return api.post(`/ponto/marcar`, { userId });
};

export const fetchUserClockIns = async (userId: string) => {
  return api.get(`/ponto/historico/${userId}`);
};
