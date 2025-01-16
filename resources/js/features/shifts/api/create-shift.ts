import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { Shift } from '@/types/api';

import { getShiftsQueryOptions } from './get-shifts';


export const createShiftInputSchema = z.object({
  code: z.string().min(1, { message: 'Code is required.' }),
  name: z.string().min(1, { message: 'Name is required.' }),
  description: z.string(),
});

export type CreateShiftInput = z.infer<typeof createShiftInputSchema>;

export const createShift = (data : CreateShiftInput): Promise<Shift> => {
  return api.post(`/shifts`, data);
};

type UseCreateShiftOptions = {
  mutationConfig?: MutationConfig<typeof createShift>;
};

export const useCreateShift = ({
  mutationConfig,
}: UseCreateShiftOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args : any) => {
      queryClient.invalidateQueries({
        queryKey: getShiftsQueryOptions().queryKey,
      });
      onSuccess?.(args);
    },
    ...restConfig,
    mutationFn: createShift,
  });
};
