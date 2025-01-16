

import { Spinner } from '@/components/ui/spinner';
import { useShiftAssignment } from '../api/get-shift-assignment';

export const ShiftAssignmentView = ({ shiftAssignmentId }: { shiftAssignmentId: string | undefined }) => {
  
  if(!shiftAssignmentId){
    return <h1>Unrecognized Request</h1>
  }
  
  const shiftAssignmentQuery = useShiftAssignment({
    shiftAssignmentId,
  });

  if (shiftAssignmentQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const shiftAssignment = shiftAssignmentQuery?.data?.data;
  if (!shiftAssignment) return null;

  return (
    <div className="mt-6 flex flex-col px-6 space-y-2">
      <div className="grid grid-cols-2 gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Name</p>
              <p className="text-sm text-muted-foreground">
                {shiftAssignment.name} 
                <br />
                {shiftAssignment.code ?? <span className='text-red'>No ShiftAssignment Code Found</span>}
              </p>
            </div>
          </div>
      </div>
    </div>
  );
};
