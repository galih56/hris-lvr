import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { LoaderFunctionArgs } from 'react-router-dom';

import { getShiftsQueryOptions } from '@/features/shifts/api/get-shifts';
import { ShiftsList } from '@/features/shifts/components/shifts-list';
import { lazy } from 'react';
import DialogOrDrawer from '@/components/layout/dialog-or-drawer';
import { Button } from '@/components/ui/button';
import { useDisclosure } from '@/hooks/use-disclosure';
const CreateShift = lazy(() => import('@/features/shifts/components/create-shift'));

export const shiftsLoader =
  (queryClient: QueryClient) =>
  async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);

    const page = Number(url.searchParams.get('page') || 1);

    const query = getShiftsQueryOptions({ page });

    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export const ShiftsRoute = () => {
  const { isOpen, open, close, toggle } = useDisclosure();

  return (
    <>
      <div className="mt-4">
        <DialogOrDrawer 
          open={isOpen}
          onOpenChange={toggle}
          title={"Create Shift"}
          description={"Pastikan data yang anda masukan sudah benar sesuai!"}
          trigger={ <Button variant="outline">Create Shift</Button>}
          >
            <CreateShift onSuccess={close} onError={close}/>
        </DialogOrDrawer>
        <div className='w-full my-2 p4'>
          <ShiftsList />          
        </div>
      </div>
    </>
  );
};
