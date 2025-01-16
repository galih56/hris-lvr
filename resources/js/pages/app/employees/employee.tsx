import { QueryClient } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { useParams, LoaderFunctionArgs } from 'react-router-dom';

import { Spinner } from '@/components/ui/spinner';
import {
  useEmployee,
  getEmployeeQueryOptions,
} from '@/features/employees/api/get-employee';
import { EmployeeView } from '@/features/employees/components/employee-view';
import { UpdateEmployee } from '@/features/employees/components/update-employee';
import { Button } from '@/components/ui/button';
import DialogOrDrawer from '@/components/layout/dialog-or-drawer';
import { Edit } from 'lucide-react';

export const employeeLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const employeeId = params.id as string;

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
  const employeeId = params.id;

  return (
    <div className='mt-6'>
        <DialogOrDrawer 
          title={"Edit Employee"}
          description={"Pastikan data yang anda masukan sudah benar sesuai!"}
          trigger={ <Button variant="outline"> <Edit/> Edit Employee</Button>}
          >
            <UpdateEmployee employeeId={employeeId}/>
        </DialogOrDrawer>
        <EmployeeView employeeId={employeeId} />
        <div className="mt-8">
          <ErrorBoundary
            fallback={
              <div>Failed to load comments. Try to refresh the page.</div>
            }
          >
          </ErrorBoundary>
        </div>
    </div>
  );
};
