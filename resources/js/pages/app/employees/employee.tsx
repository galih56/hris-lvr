import { QueryClient } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { useParams, LoaderFunctionArgs } from 'react-router-dom';

import { Spinner } from '@/components/ui/spinner';
import {
  useEmployee,
  getEmployeeQueryOptions,
} from '@/features/employees/api/get-employee';
import { EmployeeView } from '@/features/employees/components/employee-view';

export const employeeLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const employeeId = params.employeeId as string;

    const employeeQuery = getEmployeeQueryOptions(employeeId);

    const promises = [
      queryClient.getQueryData(employeeQuery.queryKey) ??
        (await queryClient.fetchQuery(employeeQuery)),
    ] as const;

    const [employee] = await Promise.all(promises);

    return {
      employee,
    };
};

export const EmployeeRoute = () => {
  const params = useParams();
  const employeeId = params.employeeId as string;
  const employeeQuery = useEmployee({
    employeeId,
  });

  if (employeeQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const employee = employeeQuery.data?.data;

  if (!employee) return null;

  return (
    <>
        <EmployeeView employeeId={employeeId} />
        <div className="mt-8">
          <ErrorBoundary
            fallback={
              <div>Failed to load comments. Try to refresh the page.</div>
            }
          >
          </ErrorBoundary>
        </div>
    </>
  );
};
