import { api } from '@/lib/axios';

export async function markPunch(token: string) {
  const response = await api.post(
    '/punches/punch',
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
}

export async function getPunchHistory(token: string) {
  const response = await api.get('/punches/history', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
