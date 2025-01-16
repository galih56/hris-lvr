import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { LeaveType, Meta } from '@/types/api';


export const getLeaveTypes = (
  page = 1,
): Promise<{
  data: LeaveType[];
  meta?: Meta;
}> => {
  return api.get(`/leave_types`);
};

export const getLeaveTypesQueryOptions = () => {
  return queryOptions({
    queryKey: ['leave-requests'],
    queryFn: () => getLeaveTypes(),
  });
};

type UseLeaveTypesOptions = {
  queryConfig?: QueryConfig<typeof getLeaveTypesQueryOptions>;
};

export const useLeaveTypes = ({
  queryConfig,
}: UseLeaveTypesOptions) => {
  return useQuery({
    ...getLeaveTypesQueryOptions(), 
    ...queryConfig,
    select: (data) => {
      return {
        data: data.data
      };
    },
  });
};
