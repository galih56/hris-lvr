import { QueryClient } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { useParams, LoaderFunctionArgs } from 'react-router-dom';

import { Spinner } from '@/components/ui/spinner';
import {
  useJobPosition,
  getJobPositionQueryOptions,
} from '@/features/job-positions/api/get-job-position';
import { JobPositionView } from '@/features/job-positions/components/job-position-view';
import { UpdateJobPosition } from '@/features/job-positions/components/update-job-position';
import { Button } from '@/components/ui/button';
import DialogOrDrawer from '@/components/layout/dialog-or-drawer';
import { Edit } from 'lucide-react';

export const jobPositionLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const jobPositionId = params.id as string;

    const jobPositionQuery = getJobPositionQueryOptions(jobPositionId);
    
    const promises = [
      queryClient.getQueryData(jobPositionQuery.queryKey) ??
        (await queryClient.fetchQuery(jobPositionQuery)),
    ] as const;

    const [jobPosition] = await Promise.all(promises);

    return {
      jobPosition,
    };
};

export const JobPositionRoute = () => {
  const params = useParams();
  const jobPositionId = params.id;

  return (
    <div className='mt-6'>
        <DialogOrDrawer 
          title={"Edit Job Position"}
          description={"Pastikan data yang anda masukan sudah benar sesuai!"}
          trigger={ <Button variant="outline"> <Edit/> Edit Job Position</Button>}
          >
            <UpdateJobPosition jobPositionId={jobPositionId}/>
        </DialogOrDrawer>
        <JobPositionView jobPositionId={jobPositionId} />
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
