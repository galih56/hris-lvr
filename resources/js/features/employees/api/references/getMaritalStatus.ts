import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';

export const getMaritalStatuses = (): Promise<{ data: any[] }> => {
  return api.get('/marital_statuses');
};

export const getMaritalStatusesQueryOptions = () => {
  return queryOptions({
    queryKey: ['marital_statuses'],
    queryFn: () => getMaritalStatuses(),
  });
};

type UseMaritalStatusesOptions = {
  queryConfig?: QueryConfig<typeof getMaritalStatusesQueryOptions>;
};

export const useMaritalStatuses = ({ queryConfig = {} }: UseMaritalStatusesOptions = {}) => {
  return useQuery({
    ...getMaritalStatusesQueryOptions(),
    ...queryConfig,
  });
};
