import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { LeaveRequest, Meta } from '@/types/api';


export const getLeaveRequests = (
  page = 1,
  perPage = 15,
  search?: string
): Promise<{
  data: LeaveRequest[];
  meta?: Meta;
}> => {
  return api.get(`/leave_requests`, {
    params: {
      page,
      per_page: perPage,
      search,
    },
  });
};

export const getLeaveRequestsQueryOptions = ({
  page,
  perPage = 15,
  search, 
}: { page?: number; perPage?: number; search?: string } = {}) => {
  return queryOptions({
    queryKey: ['leave-requests', { page, perPage, search }],
    queryFn: () => getLeaveRequests(page, perPage, search),
  });
};

type UseLeaveRequestsOptions = {
  page?: number;
  perPage?: number;
  search?: string; 
  queryConfig?: QueryConfig<typeof getLeaveRequestsQueryOptions>;
};

export const useLeaveRequests = ({
  queryConfig,
  page = 1,
  perPage = 15,
  search, 
}: UseLeaveRequestsOptions) => {
  return useQuery({
    ...getLeaveRequestsQueryOptions({ page, perPage, search }), 
    ...queryConfig,
    select: (data) => {
      return {
        data: data.data,
        meta: data.meta,
      };
    },
  });
};
