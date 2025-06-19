import { useMutation } from '@tanstack/react-query';
import { registerClockIn } from '../api';

export const useClockIn = () =>
  useMutation({
    mutationFn: (userId: string) => registerClockIn(userId),
  });
