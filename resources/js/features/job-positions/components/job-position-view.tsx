

import { Spinner } from '@/components/ui/spinner';
import { useJobPosition } from '../api/get-job-position';
import { formatDate } from '@/lib/datetime';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { capitalizeFirstChar } from '@/lib/common';

export const JobPositionView = ({ jobPositionId }: { jobPositionId: string | undefined }) => {
  
  if(!jobPositionId){
    return <h1>Unrecognized Request</h1>
  }
  
  const jobPositionQuery = useJobPosition({
    jobPositionId,
  });

  if (jobPositionQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const jobPosition = jobPositionQuery?.data?.data;

  if (!jobPosition) return null;

  return (
    <div className="mt-6 flex flex-col px-6 space-y-2">
      <div className="grid grid-cols-2 gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Name</p>
              <p className="text-sm text-muted-foreground">
                {jobPosition.name} 
                <br />
                {jobPosition.code ?? <span className='text-red'>No Job Position Code Found</span>}
              </p>
            </div>
          </div>
      </div>
    </div>
  );
};
