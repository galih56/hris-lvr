import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { getShiftAssignmentsQueryOptions } from './get-shift-assignments';

export type DeleteShiftAssignmentDTO = {
  shiftId: string;
};

export const deleteShiftAssignment = ({
  shiftId,
}: DeleteShiftAssignmentDTO) => {
  return api.delete(`/shift_assignments/${shiftId}`);
};

type UseDeleteShiftAssignmentOptions = {
  mutationConfig?: MutationConfig<typeof deleteShiftAssignment>;
};

export const useDeleteShiftAssignment = ({
  mutationConfig,
}: UseDeleteShiftAssignmentOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args : any) => {
      queryClient.invalidateQueries({
        queryKey: getShiftAssignmentsQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteShiftAssignment,
  });
};
