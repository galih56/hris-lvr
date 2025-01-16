import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { LoaderFunctionArgs } from 'react-router-dom';

import { getDepartmentsQueryOptions } from '@/features/departments/api/get-departments';
import { DepartmentsList } from '@/features/departments/components/departments-list';
import { lazy } from 'react';
import DialogOrDrawer from '@/components/layout/dialog-or-drawer';
import { Button } from '@/components/ui/button';
import { useDisclosure } from '@/hooks/use-disclosure';
const CreateDepartment = lazy(() => import('@/features/departments/components/create-department'));

export const departmentsLoader =
  (queryClient: QueryClient) =>
  async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);

    const page = Number(url.searchParams.get('page') || 1);

    const query = getDepartmentsQueryOptions({ page });

    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export const DepartmentsRoute = () => {
  const { isOpen, open, close, toggle } = useDisclosure();

  return (
    <>
      <div className="mt-4">
        <DialogOrDrawer 
          open={isOpen}
          onOpenChange={toggle}
          title={"Create Department"}
          description={"Pastikan data yang anda masukan sudah benar sesuai!"}
          trigger={ <Button variant="outline">Create Department</Button>}
          >
            <CreateDepartment onSuccess={close} onError={close}/>
        </DialogOrDrawer>
        <div className='w-full my-2 p4'>
          <DepartmentsList />          
        </div>
      </div>
    </>
  );
};
