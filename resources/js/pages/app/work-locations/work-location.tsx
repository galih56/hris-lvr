import { QueryClient } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { useParams, LoaderFunctionArgs } from 'react-router-dom';

import {
  useWorkLocation,
  getWorkLocationQueryOptions,
} from '@/features/work-locations/api/get-work-location';
import { WorkLocationView } from '@/features/work-locations/components/work-location-view';
import { UpdateWorkLocation } from '@/features/work-locations/components/update-work-location';
import { Button } from '@/components/ui/button';
import DialogOrDrawer from '@/components/layout/dialog-or-drawer';
import { Edit } from 'lucide-react';

export const workLocationLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const workLocationId = params.id as string;

    const workLocationQuery = getWorkLocationQueryOptions(workLocationId);
    
    const promises = [
      queryClient.getQueryData(workLocationQuery.queryKey) ??
        (await queryClient.fetchQuery(workLocationQuery)),
    ] as const;

    const [workLocation] = await Promise.all(promises);

    return {
      workLocation,
    };
};

export const WorkLocationRoute = () => {
  const params = useParams();
  const workLocationId = params.id;

  return (
    <div className='mt-6'>
        <DialogOrDrawer 
          title={"Edit WorkLocation"}
          description={"Pastikan data yang anda masukan sudah benar sesuai!"}
          trigger={ <Button variant="outline"> <Edit/> Edit WorkLocation</Button>}
          >
            <UpdateWorkLocation workLocationId={workLocationId}/>
        </DialogOrDrawer>
        <WorkLocationView workLocationId={workLocationId} />
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
