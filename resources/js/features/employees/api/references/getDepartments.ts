import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';

export const getDepartments = (): Promise<{ data: any[] }> => {
  return api.get('/departments');
};

export const getDepartmentsQueryOptions = () => {
  return queryOptions({
    queryKey: ['departments'],
    queryFn: () => getDepartments(),
  });
};

type UseDepartmentsOptions = {
  queryConfig?: QueryConfig<typeof getDepartmentsQueryOptions>;
};

export const useDepartments = ({ queryConfig = {} }: UseDepartmentsOptions = {}) => {
  return useQuery({
    ...getDepartmentsQueryOptions(),
    ...queryConfig,
  });
};
