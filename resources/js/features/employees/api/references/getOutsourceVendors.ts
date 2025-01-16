import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';

export const getOutsourceVendors = (): Promise<{ data: any[] }> => {
  return api.get('/outsource_vendors');
};

export const getOutsourceVendorsQueryOptions = () => {
  return queryOptions({
    queryKey: ['outsource_vendors'],
    queryFn: () => getOutsourceVendors(),
  });
};

type UseOutsourceVendorsOptions = {
  queryConfig?: QueryConfig<typeof getOutsourceVendorsQueryOptions>;
};

export const useOutsourceVendors = ({ queryConfig = {} }: UseOutsourceVendorsOptions = {}) => {
  return useQuery({
    ...getOutsourceVendorsQueryOptions(),
    ...queryConfig,
  });
};
