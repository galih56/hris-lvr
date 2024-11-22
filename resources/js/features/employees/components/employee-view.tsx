

import { Spinner } from '@/components/ui/spinner';
import { useEmployee } from '../api/get-employee';
import { UpdateEmployee } from './update-employee';
import { MDPreview } from '@/components/ui/md-preview';
import { formatDate } from '@/lib/datetime';

export const EmployeeView = ({ employeeId }: { employeeId: string }) => {
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

  const employee = employeeQuery?.data?.data;

  if (!employee) return null;

  return (
    <div>
      <span className="text-xs font-bold">
        {formatDate(employee.createdAt)}
      </span>
      {employee.author && (
        <span className="ml-2 text-sm font-bold">
          by {employee.author.firstName} {employee.author.lastName}
        </span>
      )}
      <div className="mt-6 flex flex-col space-y-16">
        <div className="flex justify-end">
          <UpdateEmployee employeeId={employeeId} />
        </div>
        <div>
          <div className="overflow-hidden bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <div className="mt-1 max-w-2xl text-sm text-gray-500">
                <MDPreview value={employee.body} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
