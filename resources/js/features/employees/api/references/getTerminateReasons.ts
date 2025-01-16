import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';

export const getTerminateReasons = (): Promise<{ data: any[] }> => {
  return api.get('/terminate_reasons');
};

export const getTerminateReasonsQueryOptions = () => {
  return queryOptions({
    queryKey: ['terminate_reasons'],
    queryFn: () => getTerminateReasons(),
  });
};

type UseTerminateReasonsOptions = {
  queryConfig?: QueryConfig<typeof getTerminateReasonsQueryOptions>;
};

export const useTerminateReasons = ({ queryConfig = {} }: UseTerminateReasonsOptions = {}) => {
  return useQuery({
    ...getTerminateReasonsQueryOptions(),
    ...queryConfig,
  });
};
