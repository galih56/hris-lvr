import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { LoaderFunctionArgs } from 'react-router-dom';

import { getEmployeesQueryOptions } from '@/features/employees/api/get-employees';
import { EmployeesList } from '@/features/employees/components/employees-list';
import { lazy } from 'react';
import DialogOrDrawer from '@/components/layout/dialog-or-drawer';
import { Button } from '@/components/ui/button';
import { useDisclosure } from '@/hooks/use-disclosure';
const CreateEmployee = lazy(() => import('@/features/employees/components/create-employee'));

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
  const { isOpen, open, close, toggle } = useDisclosure();

  return (
    <>
      <div className="mt-4">
        <DialogOrDrawer 
          open={isOpen}
          onOpenChange={toggle}
          title={"Create Employee"}
          description={"Pastikan data yang anda masukan sudah benar sesuai!"}
          trigger={ <Button variant="outline">Create Employee</Button>}
          >
            <CreateEmployee onSuccess={close} onError={close}/>
        </DialogOrDrawer>
        <div className='w-full my-2 p4'>
          <EmployeesList />          
        </div>
      </div>
    </>
  );
};
