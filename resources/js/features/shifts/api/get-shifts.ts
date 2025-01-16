import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Shift, Meta } from '@/types/api';


export const getShifts = (
  page = 1,
  perPage = 15,
  search?: string
): Promise<{
  data: Shift[];
  meta?: Meta;
}> => {
  return api.get(`/shifts`, {
    params: {
      page,
      per_page: perPage,
      search,
    },
  });
};

export const getShiftsQueryOptions = ({
  page,
  perPage = 15,
  search, 
}: { page?: number; perPage?: number; search?: string } = {}) => {
  return queryOptions({
    queryKey: ['shifts', { page, perPage, search }],
    queryFn: () => getShifts(page, perPage, search),
  });
};

type UseShiftsOptions = {
  page?: number;
  perPage?: number;
  search?: string; 
  queryConfig?: QueryConfig<typeof getShiftsQueryOptions>;
};

export const useShifts = ({
  queryConfig,
  page = 1,
  perPage = 15,
  search, 
}: UseShiftsOptions) => {
  return useQuery({
    ...getShiftsQueryOptions({ page, perPage, search }), 
    ...queryConfig,
    select: (data) => {
      return {
        data: data.data,
        meta: data.meta,
      };
    },
  });
};
