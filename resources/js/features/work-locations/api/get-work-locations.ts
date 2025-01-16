import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { WorkLocation, Meta } from '@/types/api';


export const getWorkLocations = (
  page = 1,
  perPage = 15,
  search?: string
): Promise<{
  data: WorkLocation[];
  meta?: Meta;
}> => {
  return api.get(`/work_locations`, {
    params: {
      page,
      per_page: perPage,
      search,
    },
  });
};

export const getWorkLocationsQueryOptions = ({
  page,
  perPage = 15,
  search, 
}: { page?: number; perPage?: number; search?: string } = {}) => {
  return queryOptions({
    queryKey: ['work-locations', { page, perPage, search }],
    queryFn: () => getWorkLocations(page, perPage, search),
  });
};

type UseWorkLocationsOptions = {
  page?: number;
  perPage?: number;
  search?: string; 
  queryConfig?: QueryConfig<typeof getWorkLocationsQueryOptions>;
};

export const useWorkLocations = ({
  queryConfig,
  page = 1,
  perPage = 15,
  search, 
}: UseWorkLocationsOptions) => {
  return useQuery({
    ...getWorkLocationsQueryOptions({ page, perPage, search }), 
    ...queryConfig,
    select: (data) => {
      return {
        data: data.data,
        meta: data.meta,
      };
    },
  });
};
