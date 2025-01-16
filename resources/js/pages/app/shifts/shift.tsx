import { QueryClient } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { useParams, LoaderFunctionArgs } from 'react-router-dom';

import {
  useShift,
  getShiftQueryOptions,
} from '@/features/shifts/api/get-shift';
import { ShiftView } from '@/features/shifts/components/shift-view';
import { UpdateShift } from '@/features/shifts/components/update-shift';
import { Button } from '@/components/ui/button';
import DialogOrDrawer from '@/components/layout/dialog-or-drawer';
import { Edit } from 'lucide-react';

export const shiftLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const shiftId = params.id as string;

    const shiftQuery = getShiftQueryOptions(shiftId);
    
    const promises = [
      queryClient.getQueryData(shiftQuery.queryKey) ??
        (await queryClient.fetchQuery(shiftQuery)),
    ] as const;

    const [shift] = await Promise.all(promises);

    return {
      shift,
    };
};

export const ShiftRoute = () => {
  const params = useParams();
  const shiftId = params.id;

  return (
    <div className='mt-6'>
        <DialogOrDrawer 
          title={"Edit Shift"}
          description={"Pastikan data yang anda masukan sudah benar sesuai!"}
          trigger={ <Button variant="outline"> <Edit/> Edit Shift</Button>}
          >
            <UpdateShift shiftId={shiftId}/>
        </DialogOrDrawer>
        <ShiftView shiftId={shiftId} />
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
