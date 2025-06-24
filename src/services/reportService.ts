import { api } from '@/lib/axios';

export async function generateReport(token: string) {
  const response = await api.post(
    '/report/generate',
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
}