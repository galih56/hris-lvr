import { useMutation, useQueryClient } from  '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { LeaveRequest } from '@/types/api';

import { getLeaveRequestQueryOptions } from './get-leave-request';

export const updateLeaveRequestInputSchema = z.object({
  code: z.string().min(1, { message: 'Code is required.' }),
  name: z.string().min(1, { message: 'Name is required.' }),
});

export type UpdateLeaveRequestInput = z.infer<typeof updateLeaveRequestInputSchema>;

export const updateLeaveRequest = ({
  data,
  leaveRequestId,
}: {
  data: UpdateLeaveRequestInput;
  leaveRequestId: string;
}): Promise<LeaveRequest> => {
  return api.patch(`/leaveRequests/${leaveRequestId}`, data);
};

type UseUpdateLeaveRequestOptions = {
  mutationConfig?: MutationConfig<typeof updateLeaveRequest>;
};

export const useUpdateLeaveRequest = ({
  mutationConfig,
}: UseUpdateLeaveRequestOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data : any, ...args ) => {
      queryClient.refetchQueries({
        queryKey: getLeaveRequestQueryOptions(data.id).queryKey,
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateLeaveRequest,
  });
};
