

import { Spinner } from '@/components/ui/spinner';
import { useShift } from '../api/get-shift';

export const ShiftView = ({ shiftId }: { shiftId: string | undefined }) => {
  
  if(!shiftId){
    return <h1>Unrecognized Request</h1>
  }
  
  const shiftQuery = useShift({
    shiftId,
  });

  if (shiftQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const shift = shiftQuery?.data?.data;
  if (!shift) return null;

  return (
    <div className="mt-6 flex flex-col px-6 space-y-2">
      <div className="grid grid-cols-2 gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Name</p>
              <p className="text-sm text-muted-foreground">
                {shift.name} 
                <br />
                {shift.code ?? <span className='text-red'>No Shift Code Found</span>}
              </p>
            </div>
          </div>
      </div>
    </div>
  );
};
