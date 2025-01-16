import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { ShiftAssignment, Meta } from '@/types/api';


export const CheckActiveShiftAssignment = (): Promise<{
  data: ShiftAssignment[];
}> => {
  return api.get(`/shift_assignments/check`);
};

export const CheckActiveShiftAssignmentQueryOptions = () => {
  return queryOptions({
    queryKey: ['check-active-shift-assignment'],
    queryFn: () => CheckActiveShiftAssignment(),
  });
};

type UseCheckActiveShiftAssignmentOptions = {
  queryConfig?: QueryConfig<typeof CheckActiveShiftAssignmentQueryOptions>;
};

export const useCheckActiveShiftAssignment = ({
  queryConfig
}: UseCheckActiveShiftAssignmentOptions) => {
  return useQuery({
    ...CheckActiveShiftAssignmentQueryOptions(), 
    ...queryConfig,
    select: (data) => {
      return {
        data: data.data,
      };
    },
  });
};
