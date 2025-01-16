import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { LoaderFunctionArgs } from 'react-router-dom';

import { getShiftAssignmentsQueryOptions } from '@/features/shift-assignments/api/get-shift-assignments';
import { ShiftAssignmentsList } from '@/features/shift-assignments/components/shift-assignment-list';
import { lazy } from 'react';
import DialogOrDrawer from '@/components/layout/dialog-or-drawer';
import { Button } from '@/components/ui/button';
import { useDisclosure } from '@/hooks/use-disclosure';
const CreateShiftAssignment = lazy(() => import('@/features/shift-assignments/components/create-shift-assignment'));

export const shiftAssignmentsLoader =
  (queryClient: QueryClient) =>
  async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);

    const page = Number(url.searchParams.get('page') || 1);

    const query = getShiftAssignmentsQueryOptions({ page });

    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export const ShiftAssignmentsRoute = () => {
  const { isOpen, open, close, toggle } = useDisclosure();

  return (
    <>
      <div className="mt-4">
        <DialogOrDrawer 
          open={isOpen}
          onOpenChange={toggle}
          title={"Create Shift Assignment"}
          description={"Pastikan data yang anda masukan sudah benar sesuai!"}
          trigger={ <Button variant="outline">Create Shift Assignment</Button>}
          >
            <CreateShiftAssignment onSuccess={close} onError={close}/>
        </DialogOrDrawer>
        <div className='w-full my-2 p4'>
          <ShiftAssignmentsList />          
        </div>
      </div>
    </>
  );
};
