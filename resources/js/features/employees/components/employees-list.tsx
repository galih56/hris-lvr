import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

import { Link } from '@/components/ui/link';
import { Spinner } from '@/components/ui/spinner';
import { Table } from '@/components/ui/table';
import { paths } from '@/apps/hris-dashboard/paths';
import { getEmployeeQueryOptions } from '../api/get-employee';
import { useEmployees } from '../api/get-employees';
import { formatDate } from '@/lib/datetime';

export type EmployeesListProps = {
  onEmployeePrefetch?: (id: string) => void;
};

export const EmployeesList = ({
  onEmployeePrefetch,
}: EmployeesListProps) => {
  const [searchParams] = useSearchParams();

  const employeesQuery = useEmployees({
    page: +(searchParams.get('page') || 1),
  });
  const queryClient = useQueryClient();

  if (employeesQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const employees = employeesQuery.data?.data;
  const meta = employeesQuery.data?.meta;

  if (!employees) return null;

  return (
    <Table
      data={employees}
      columns={[
        {
          title: 'Title',
          field: 'title',
        },
        {
          title: 'Created At',
          field: 'createdAt',
          Cell({ entry: { createdAt } }) {
            return <span>{formatDate(createdAt)}</span>;
          },
        },
        {
          title: '',
          field: 'id',
          Cell({ entry: { id } }) {
            return (
              <Link
                onMouseEnter={() => {
                  // Prefetch the employee data when the user hovers over the link
                  queryClient.prefetchQuery(getEmployeeQueryOptions(id));
                  onEmployeePrefetch?.(id);
                }}
                to={paths.app.employee.getHref(id)}
              >
                View
              </Link>
            );
          },
        },
      ]}
      pagination={
        meta && {
          totalPages: meta.totalPages,
          currentPage: meta.page,
          rootUrl: '',
        }
      }
    />
  );
};
