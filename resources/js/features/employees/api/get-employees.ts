import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Employee, Meta } from '@/types/api';

type Filters = {
  departmentId?: string;
};

export const getEmployees = (
  page?: number,
  perPage?: number,
  search?: string,
  filters?: Filters
): Promise<{
  data: Employee[];
  meta?: Meta;
}> => {
  return api.get(`/employees`, {
    params: {
      ...(page && perPage ? { page, per_page: perPage } : {}), 
      search,
      ...filters,
    },
  });
};

export const getEmployeesQueryOptions = ({
  page,
  perPage,
  search,
  filters,
}: { page?: number; perPage?: number; search?: string; filters?: Filters } = {}) => {
  return queryOptions({
    queryKey: ['employees', { page, perPage, search, filters }],
    queryFn: () => getEmployees(page, perPage, search, filters), // Pass filters directly
  });
};

type UseEmployeesOptions = {
  page?: number;
  perPage?: number;
  search?: string;
  filters?: Filters; // Use simplified filter type directly
  queryConfig?: QueryConfig<typeof getEmployeesQueryOptions>;
};

export const useEmployees = ({
  page,
  perPage,
  search,
  filters, // Pass filters directly
  queryConfig = {},
}: UseEmployeesOptions = {}) => {
  return useQuery({
    ...getEmployeesQueryOptions({ page, perPage, search, filters }), // Pass filters correctly
    ...queryConfig,
    select: (data) => ({
      data: data.data,
      meta: data.meta,
    }),
  });
};
