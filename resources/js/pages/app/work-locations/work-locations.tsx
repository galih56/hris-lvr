import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { LoaderFunctionArgs } from 'react-router-dom';

import { getWorkLocationsQueryOptions } from '@/features/work-locations/api/get-work-locations';
import { WorkLocationsList } from '@/features/work-locations/components/work-locations-list';
import { lazy } from 'react';
import DialogOrDrawer from '@/components/layout/dialog-or-drawer';
import { Button } from '@/components/ui/button';
import { useDisclosure } from '@/hooks/use-disclosure';
const CreateWorkLocation = lazy(() => import('@/features/work-locations/components/create-work-location'));

export const workLocationsLoader =
  (queryClient: QueryClient) =>
  async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);

    const page = Number(url.searchParams.get('page') || 1);

    const query = getWorkLocationsQueryOptions({ page });

    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export const WorkLocationsRoute = () => {
  const { isOpen, open, close, toggle } = useDisclosure();

  return (
    <>
      <div className="mt-4">
        <DialogOrDrawer 
          open={isOpen}
          onOpenChange={toggle}
          title={"Create WorkLocation"}
          description={"Pastikan data yang anda masukan sudah benar sesuai!"}
          trigger={ <Button variant="outline">Create WorkLocation</Button>}
          >
            <CreateWorkLocation onSuccess={close} onError={close}/>
        </DialogOrDrawer>
        <div className='w-full my-2 p4'>
          <WorkLocationsList />          
        </div>
      </div>
    </>
  );
};
