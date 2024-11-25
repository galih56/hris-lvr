import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';

export const getOrganizationUnits = (): Promise<{ data: any[] }> => {
  return api.get('/organization_units');
};

export const getOrganizationUnitsQueryOptions = () => {
  return queryOptions({
    queryKey: ['organization_units'],
    queryFn: () => getOrganizationUnits(),
  });
};

type UseOrganizationUnitsOptions = {
  queryConfig?: QueryConfig<typeof getOrganizationUnitsQueryOptions>;
};

export const useOrganizationUnits = ({ queryConfig = {} }: UseOrganizationUnitsOptions = {}) => {
  return useQuery({
    ...getOrganizationUnitsQueryOptions(),
    ...queryConfig,
  });
};
