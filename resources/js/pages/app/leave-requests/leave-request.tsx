import { QueryClient } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { useParams, LoaderFunctionArgs } from 'react-router-dom';

import { Spinner } from '@/components/ui/spinner';
import {
  useLeaveRequest,
  getLeaveRequestQueryOptions,
} from '@/features/leave-requests/api/get-leave-request';
import { LeaveRequestView } from '@/features/leave-requests/components/leave-request-view';
import { UpdateLeaveRequest } from '@/features/leave-requests/components/update-leave-request';
import { Button } from '@/components/ui/button';
import DialogOrDrawer from '@/components/layout/dialog-or-drawer';
import { Edit } from 'lucide-react';

export const leaveRequestLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const leaveRequestId = params.id as string;

    const leaveRequestQuery = getLeaveRequestQueryOptions(leaveRequestId);
    
    const promises = [
      queryClient.getQueryData(leaveRequestQuery.queryKey) ??
        (await queryClient.fetchQuery(leaveRequestQuery)),
    ] as const;

    const [leaveRequest] = await Promise.all(promises);

    return {
      leaveRequest,
    };
};

export const LeaveRequestRoute = () => {
  const params = useParams();
  const leaveRequestId = params.id;

  return (
    <div className='mt-6'>
        <DialogOrDrawer 
          title={"Edit Leave Request"}
          description={"Pastikan data yang anda masukan sudah benar sesuai!"}
          trigger={ <Button variant="outline"> <Edit/> Edit LeaveRequest</Button>}
          >
            <UpdateLeaveRequest leaveRequestId={leaveRequestId}/>
        </DialogOrDrawer>
        <LeaveRequestView leaveRequestId={leaveRequestId} />
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
