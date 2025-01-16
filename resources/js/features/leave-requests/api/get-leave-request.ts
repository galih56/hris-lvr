import { useQuery, queryOptions } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { LeaveRequest } from '@/types/api';

export const getLeaveRequest = ({
  leaveRequestId,
}: {
  leaveRequestId: string;
}): Promise<{ data: LeaveRequest }> => {
  return api.get(`/leave_requests/${leaveRequestId}`);
};

export const getLeaveRequestQueryOptions = (leaveRequestId: string) => {
  return queryOptions({
    queryKey: ['leave-requests', leaveRequestId],
    queryFn: () => getLeaveRequest({ leaveRequestId }),
  });
};

type UseLeaveRequestOptions = {
  leaveRequestId: string;
  queryConfig?: QueryConfig<typeof getLeaveRequestQueryOptions>;
};

export const useLeaveRequest = ({
  leaveRequestId,
  queryConfig,
}: UseLeaveRequestOptions) => {
  return useQuery({
    ...getLeaveRequestQueryOptions(leaveRequestId),
    ...queryConfig,
  });
};
