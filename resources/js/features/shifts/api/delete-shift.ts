import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { getShiftsQueryOptions } from './get-shifts';

export type DeleteShiftDTO = {
  shiftId: string;
};

export const deleteShift = ({
  shiftId,
}: DeleteShiftDTO) => {
  return api.delete(`/shifts/${shiftId}`);
};

type UseDeleteShiftOptions = {
  mutationConfig?: MutationConfig<typeof deleteShift>;
};

export const useDeleteShift = ({
  mutationConfig,
}: UseDeleteShiftOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args : any) => {
      queryClient.invalidateQueries({
        queryKey: getShiftsQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteShift,
  });
};
