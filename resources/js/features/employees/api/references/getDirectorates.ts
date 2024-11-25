import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';

export const getDirectorates = (): Promise<{ data: any[] }> => {
  return api.get('/directorates');
};

export const getDirectoratesQueryOptions = () => {
  return queryOptions({
    queryKey: ['directorates'],
    queryFn: () => getDirectorates(),
  });
};

type UseDirectoratesOptions = {
  queryConfig?: QueryConfig<typeof getDirectoratesQueryOptions>;
};

export const useDirectorates = ({ queryConfig = {} }: UseDirectoratesOptions = {}) => {
  return useQuery({
    ...getDirectoratesQueryOptions(),
    ...queryConfig,
  });
};
