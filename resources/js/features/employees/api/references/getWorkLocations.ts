import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';

export const getWorkLocations = (): Promise<{ data: any[] }> => {
  return api.get('/work_locations');
};

export const getWorkLocationsQueryOptions = () => {
  return queryOptions({
    queryKey: ['work_locations'],
    queryFn: () => getWorkLocations(),
  });
};

type UseWorkLocationsOptions = {
  queryConfig?: QueryConfig<typeof getWorkLocationsQueryOptions>;
};

export const useWorkLocations = ({ queryConfig = {} }: UseWorkLocationsOptions = {}) => {
  return useQuery({
    ...getWorkLocationsQueryOptions(),
    ...queryConfig,
  });
};
