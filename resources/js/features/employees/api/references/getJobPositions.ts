import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';

export const getJobPositions = (): Promise<{ data: any[] }> => {
  return api.get('/job_positions');
};

export const getJobPositionsQueryOptions = () => {
  return queryOptions({
    queryKey: ['job_positions'],
    queryFn: () => getJobPositions(),
  });
};

type UseJobPositionsOptions = {
  queryConfig?: QueryConfig<typeof getJobPositionsQueryOptions>;
};

export const useJobPositions = ({ queryConfig = {} }: UseJobPositionsOptions = {}) => {
  return useQuery({
    ...getJobPositionsQueryOptions(),
    ...queryConfig,
  });
};
