import { QueryClient } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { useParams, LoaderFunctionArgs } from 'react-router-dom';

import {
  useDepartment,
  getDepartmentQueryOptions,
} from '@/features/departments/api/get-department';
import { DepartmentView } from '@/features/departments/components/department-view';
import { UpdateDepartment } from '@/features/departments/components/update-department';
import { Button } from '@/components/ui/button';
import DialogOrDrawer from '@/components/layout/dialog-or-drawer';
import { Edit } from 'lucide-react';

export const departmentLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const departmentId = params.id as string;

    const departmentQuery = getDepartmentQueryOptions(departmentId);
    
    const promises = [
      queryClient.getQueryData(departmentQuery.queryKey) ??
        (await queryClient.fetchQuery(departmentQuery)),
    ] as const;

    const [department] = await Promise.all(promises);

    return {
      department,
    };
};

export const DepartmentRoute = () => {
  const params = useParams();
  const departmentId = params.id;

  return (
    <div className='mt-6'>
        <DialogOrDrawer 
          title={"Edit Department"}
          description={"Pastikan data yang anda masukan sudah benar sesuai!"}
          trigger={ <Button variant="outline"> <Edit/> Edit Department</Button>}
          >
            <UpdateDepartment departmentId={departmentId}/>
        </DialogOrDrawer>
        <DepartmentView departmentId={departmentId} />
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
