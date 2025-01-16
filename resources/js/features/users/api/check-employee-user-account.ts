import { useQuery, queryOptions } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { User } from '@/types/api';

export const checkEmployeeUserAccount = ({
  employeeId,
}: {
  employeeId: string;
}): Promise<{ data: User }> => {
  return api.get(`/check_employee_user_account//${employeeId}`, { skipNotification: true });
};

export const checkEmployeeUserAccountQueryOptions = (employeeId: string) => {
  return queryOptions({
    queryKey: ['check-employee-user-account', employeeId],
    queryFn: () => checkEmployeeUserAccount({ employeeId }),
  });
};

type UseUserOptions = {
  employeeId: string;
  queryConfig?: QueryConfig<typeof checkEmployeeUserAccountQueryOptions>;
};

export const useCheckEmployeeUserAccount = ({
  employeeId,
  queryConfig,
}: UseUserOptions) => {
  return useQuery({
    ...checkEmployeeUserAccountQueryOptions(employeeId),
    ...queryConfig,
    enabled: !!employeeId, // Only run the query if `employeeId` is provided
    staleTime: 300000, // Cache data for 5 minutes
  });
};
