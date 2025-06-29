import { api } from '@/lib/axios';
import { PunchDto } from '@/types/dtos/punchDto';

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

export async function getPunchesOfDay(token: string) {
  const response = await api.get('/punches/day', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function updatePunch(token: string, dto: PunchDto) {
  const response = await api.post('/punches/update', dto, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function deletePunch(token: string, punchId: string) {
  const response = await api.delete(`/punches/${punchId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
