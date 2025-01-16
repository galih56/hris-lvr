import { useQuery, queryOptions } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Employee } from '@/types/api';

export const getEmployee = ({
  employeeId,
}: {
  employeeId: string;
}): Promise<{ data: Employee }> => {
  return api.get(`/employees/${employeeId}`);
};

export const getEmployeeQueryOptions = (employeeId: string) => {
  return queryOptions({
    queryKey: ['employees', employeeId],
    queryFn: () => getEmployee({ employeeId }),
  });
};

type UseEmployeeOptions = {
  employeeId: string;
  queryConfig?: QueryConfig<typeof getEmployeeQueryOptions>;
};

export const useEmployee = ({
  employeeId,
  queryConfig,
}: UseEmployeeOptions) => {
  return useQuery({
    ...getEmployeeQueryOptions(employeeId),
    ...queryConfig,
  });
};
