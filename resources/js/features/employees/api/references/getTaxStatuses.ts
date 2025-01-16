import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';

export const getTaxStatuses = (): Promise<{ data: any[] }> => {
  return api.get('/tax_statuses');
};

export const getTaxStatusesQueryOptions = () => {
  return queryOptions({
    queryKey: ['tax_statuses'],
    queryFn: () => getTaxStatuses(),
  });
};

type UseTaxStatusesOptions = {
  queryConfig?: QueryConfig<typeof getTaxStatusesQueryOptions>;
};

export const useTaxStatuses = ({ queryConfig = {} }: UseTaxStatusesOptions = {}) => {
  return useQuery({
    ...getTaxStatusesQueryOptions(),
    ...queryConfig,
  });
};
