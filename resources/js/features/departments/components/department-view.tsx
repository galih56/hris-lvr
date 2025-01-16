

import { Spinner } from '@/components/ui/spinner';
import { useDepartment } from '../api/get-department';

export const DepartmentView = ({ departmentId }: { departmentId: string | undefined }) => {
  
  if(!departmentId){
    return <h1>Unrecognized Request</h1>
  }
  
  const departmentQuery = useDepartment({
    departmentId,
  });

  if (departmentQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const department = departmentQuery?.data?.data;
  if (!department) return null;

  return (
    <div className="mt-6 flex flex-col px-6 space-y-2">
      <div className="grid grid-cols-2 gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Name</p>
              <p className="text-sm text-muted-foreground">
                {department.name} 
                <br />
                {department.code ?? <span className='text-red'>No Department Code Found</span>}
              </p>
            </div>
          </div>
      </div>
    </div>
  );
};
