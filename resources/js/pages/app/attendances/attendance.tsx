import { QueryClient } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { useParams, LoaderFunctionArgs } from 'react-router-dom';

import { Spinner } from '@/components/ui/spinner';
import {
  useAttendance,
  getAttendanceQueryOptions,
} from '@/features/attendances/api/get-attendance';
import { AttendanceView } from '@/features/attendances/components/attendance-view';
import { UpdateAttendance } from '@/features/attendances/components/update-attendance';
import { Button } from '@/components/ui/button';
import DialogOrDrawer from '@/components/layout/dialog-or-drawer';
import { Edit } from 'lucide-react';

export const attendanceLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const attendanceId = params.id as string;

    const attendanceQuery = getAttendanceQueryOptions(attendanceId);
    
    const promises = [
      queryClient.getQueryData(attendanceQuery.queryKey) ??
        (await queryClient.fetchQuery(attendanceQuery)),
    ] as const;

    const [attendance] = await Promise.all(promises);

    return {
      attendance,
    };
};

export const AttendanceRoute = () => {
  const params = useParams();
  const attendanceId = params.id;

  if (!attendanceId) {
    return <h1>Unrecognized Request</h1>;
  }
  
  return (
    <div className='mt-6'>
        <DialogOrDrawer 
          title={"Edit Attendance"}
          description={"Pastikan data yang anda masukan sudah benar sesuai!"}
          trigger={ <Button variant="outline"> <Edit/> Edit Attendance</Button>}
          >
            <UpdateAttendance attendanceId={attendanceId}/>
        </DialogOrDrawer>
        <AttendanceView attendanceId={attendanceId} />
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
