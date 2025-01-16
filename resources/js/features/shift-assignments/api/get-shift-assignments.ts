import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { ShiftAssignment, Meta } from '@/types/api';


export const getShiftAssignments = (
  page = 1,
  perPage = 15,
  search?: string
): Promise<{
  data: ShiftAssignment[];
  meta?: Meta;
}> => {
  return api.get(`/shift_assignments`, {
    params: {
      page,
      per_page: perPage,
      search,
    },
  });
};

export const getShiftAssignmentsQueryOptions = ({
  page,
  perPage = 15,
  search, 
}: { page?: number; perPage?: number; search?: string } = {}) => {
  return queryOptions({
    queryKey: ['shift-assignments', { page, perPage, search }],
    queryFn: () => getShiftAssignments(page, perPage, search),
  });
};

type UseShiftAssignmentsOptions = {
  page?: number;
  perPage?: number;
  search?: string; 
  queryConfig?: QueryConfig<typeof getShiftAssignmentsQueryOptions>;
};

export const useShiftAssignments = ({
  queryConfig,
  page = 1,
  perPage = 15,
  search, 
}: UseShiftAssignmentsOptions) => {
  return useQuery({
    ...getShiftAssignmentsQueryOptions({ page, perPage, search }), 
    ...queryConfig,
    select: (data) => {
      return {
        data: data.data,
        meta: data.meta,
      };
    },
  });
};
