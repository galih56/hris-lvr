import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { LoaderFunctionArgs } from 'react-router-dom';

import { getEmployeesQueryOptions } from '@/features/employees/api/get-employees';
import { EmployeesList } from '@/features/employees/components/employees-list';

export const employeesLoader =
  (queryClient: QueryClient) =>
  async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);

    const page = Number(url.searchParams.get('page') || 1);

    const query = getEmployeesQueryOptions({ page });

    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export const EmployeesRoute = () => {
  const queryClient = useQueryClient();
  return (
    <>
      <div className="mt-4">
        <EmployeesList />
      </div>
    </>
  );
};