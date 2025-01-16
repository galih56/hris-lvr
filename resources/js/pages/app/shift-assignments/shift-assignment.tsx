import { QueryClient } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { useParams, LoaderFunctionArgs } from 'react-router-dom';

import {
  useShiftAssignment,
  getShiftAssignmentQueryOptions,
} from '@/features/shift-assignments/api/get-shift-assignment';
import { ShiftAssignmentView } from '@/features/shift-assignments/components/shift-assignment-view';
import { UpdateShiftAssignment } from '@/features/shift-assignments/components/update-shift-assignment';
import { Button } from '@/components/ui/button';
import DialogOrDrawer from '@/components/layout/dialog-or-drawer';
import { Edit } from 'lucide-react';

export const shiftAssignmentLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const shiftAssignmentId = params.id as string;

    const shiftAssignmentQuery = getShiftAssignmentQueryOptions(shiftAssignmentId);
    
    const promises = [
      queryClient.getQueryData(shiftAssignmentQuery.queryKey) ??
        (await queryClient.fetchQuery(shiftAssignmentQuery)),
    ] as const;

    const [shiftAssignment] = await Promise.all(promises);

    return {
      shiftAssignment,
    };
};

export const ShiftAssignmentRoute = () => {
  const params = useParams();
  const shiftAssignmentId = params.id;

  return (
    <div className='mt-6'>
        <DialogOrDrawer 
          title={"Edit ShiftAssignment"}
          description={"Pastikan data yang anda masukan sudah benar sesuai!"}
          trigger={ <Button variant="outline"> <Edit/> Edit ShiftAssignment</Button>}
          >
            <UpdateShiftAssignment shiftAssignmentId={shiftAssignmentId}/>
        </DialogOrDrawer>
        <ShiftAssignmentView shiftAssignmentId={shiftAssignmentId} />
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
