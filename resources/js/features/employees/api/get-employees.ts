import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Employee, Meta } from '@/types/api';

export const getEmployees = (
  page = 1,
): Promise<{
  data: Employee[];
  meta: Meta;
}> => {
  return api.get(`/employees`, {
    params: {
      page,
    },
  });
};

export const getEmployeesQueryOptions = ({
  page,
}: { page?: number } = {}) => {
  return queryOptions({
    queryKey: page ? ['employees', { page }] : ['employees'],
    queryFn: () => getEmployees(page),
  });
};

type UseEmployeesOptions = {
  page?: number;
  queryConfig?: QueryConfig<typeof getEmployeesQueryOptions>;
};

export const useEmployees = ({
  queryConfig,
  page,
}: UseEmployeesOptions) => {
  return useQuery({
    ...getEmployeesQueryOptions({ page }),
    ...queryConfig,
  });
};
