import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { LoaderFunctionArgs } from 'react-router-dom';

import { getLeaveRequestsQueryOptions } from '@/features/leave-requests/api/get-leave-requests';
import { LeaveRequestsList } from '@/features/leave-requests/components/leave-request-list';
import { lazy } from 'react';
import DialogOrDrawer from '@/components/layout/dialog-or-drawer';
import { Button } from '@/components/ui/button';
import { useDisclosure } from '@/hooks/use-disclosure';

const CreateLeaveRequest = lazy(() => import('@/features/leave-requests/components/create-leave-request'));

export const leaveRequestsLoader =
  (queryClient: QueryClient) =>
  async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);

    const page = Number(url.searchParams.get('page') || 1);

    const query = getLeaveRequestsQueryOptions({ page });

    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export const LeaveRequestsRoute = () => {
  const { isOpen, open, close, toggle } = useDisclosure();

  return (
    <>
      <div className="mt-4">
        <DialogOrDrawer 
          open={isOpen}
          onOpenChange={toggle}
          title={"Create Leave Request"}
          description={"Pastikan data yang anda masukan sudah benar sesuai!"}
          trigger={ <Button variant="outline">Create Leave Request</Button>}
          >
            <CreateLeaveRequest onSuccess={close} onError={close}/>
        </DialogOrDrawer>
        <div className='w-full my-2 p4'>
          <LeaveRequestsList />          
        </div>
      </div>
    </>
  );
};
