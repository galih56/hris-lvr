import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';

export const getEmploymentStatuses = (): Promise<{ data: any[] }> => {
  return api.get('/employment_statuses');
};

export const getEmploymentStatusesQueryOptions = () => {
  return queryOptions({
    queryKey: ['employment_statuses'],
    queryFn: () => getEmploymentStatuses(),
  });
};

type UseEmploymentStatusesOptions = {
  queryConfig?: QueryConfig<typeof getEmploymentStatusesQueryOptions>;
};

export const useEmploymentStatuses = ({ queryConfig = {} }: UseEmploymentStatusesOptions = {}) => {
  return useQuery({
    ...getEmploymentStatusesQueryOptions(),
    ...queryConfig,
  });
};
