import { useMutation, useQueryClient } from  '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { ShiftAssignment } from '@/types/api';

import { getShiftAssignmentQueryOptions } from './get-shift-assignment';

export const updateShiftAssignmentInputSchema = z.object({
  code: z.string().min(1, { message: 'Code is required.' }),
  name: z.string().min(1, { message: 'Name is required.' }),
});

export type UpdateShiftAssignmentInput = z.infer<typeof updateShiftAssignmentInputSchema>;

export const updateShiftAssignment = ({
  data,
  shiftAssignmentId,
}: {
  data: UpdateShiftAssignmentInput;
  shiftAssignmentId: string;
}): Promise<ShiftAssignment> => {
  return api.patch(`/shift_assignments/${shiftAssignmentId}`, data);
};

type UseUpdateShiftAssignmentOptions = {
  mutationConfig?: MutationConfig<typeof updateShiftAssignment>;
};

export const useUpdateShiftAssignment = ({
  mutationConfig,
}: UseUpdateShiftAssignmentOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data : any, ...args ) => {
      queryClient.refetchQueries({
        queryKey: getShiftAssignmentQueryOptions(data.id).queryKey,
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateShiftAssignment,
  });
};
