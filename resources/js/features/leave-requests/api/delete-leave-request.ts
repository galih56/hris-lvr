import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { getLeaveRequestsQueryOptions } from './get-leave-requests';

export type DeleteLeaveRequestDTO = {
  leaveRequestId: string;
};

export const deleteLeaveRequest = ({
  leaveRequestId,
}: DeleteLeaveRequestDTO) => {
  return api.delete(`/leave_requests/${leaveRequestId}`);
};

type UseDeleteLeaveRequestOptions = {
  mutationConfig?: MutationConfig<typeof deleteLeaveRequest>;
};

export const useDeleteLeaveRequest = ({
  mutationConfig,
}: UseDeleteLeaveRequestOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args : any) => {
      queryClient.invalidateQueries({
        queryKey: getLeaveRequestsQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteLeaveRequest,
  });
};
