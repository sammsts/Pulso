import { api } from '@/lib/axios';

interface PunchDto {
  type: string;
}

export async function markPunch(token: string, dto: PunchDto) {
  const response = await api.post('/punches', dto, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function getPunchHistory(token: string) {
  const response = await api.get('/punches/history', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
