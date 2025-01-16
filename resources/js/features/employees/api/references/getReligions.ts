import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';

export const getReligions = (): Promise<{ data: any[] }> => {
  return api.get('/religions');
};

export const getReligionsQueryOptions = () => {
  return queryOptions({
    queryKey: ['religions'],
    queryFn: () => getReligions(),
  });
};

type UseReligionsOptions = {
  queryConfig?: QueryConfig<typeof getReligionsQueryOptions>;
};

export const useReligions = ({ queryConfig = {} }: UseReligionsOptions = {}) => {
  return useQuery({
    ...getReligionsQueryOptions(),
    ...queryConfig,
  });
};
