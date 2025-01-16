import { useMutation, useQueryClient } from  '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { Shift } from '@/types/api';

import { getShiftQueryOptions } from './get-shift';

export const updateShiftInputSchema = z.object({
  code: z.string().min(1, { message: 'Code is required.' }),
  name: z.string().min(1, { message: 'Name is required.' }),
});

export type UpdateShiftInput = z.infer<typeof updateShiftInputSchema>;

export const updateShift = ({
  data,
  shiftId,
}: {
  data: UpdateShiftInput;
  shiftId: string;
}): Promise<Shift> => {
  return api.patch(`/shifts/${shiftId}`, data);
};

type UseUpdateShiftOptions = {
  mutationConfig?: MutationConfig<typeof updateShift>;
};

export const useUpdateShift = ({
  mutationConfig,
}: UseUpdateShiftOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data : any, ...args ) => {
      queryClient.refetchQueries({
        queryKey: getShiftQueryOptions(data.id).queryKey,
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateShift,
  });
};
