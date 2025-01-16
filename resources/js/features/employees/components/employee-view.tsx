

import { Spinner } from '@/components/ui/spinner';
import { useEmployee } from '../api/get-employee';
// import { UpdateEmployee } from './update-employee';
import { formatDate } from '@/lib/datetime';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { capitalizeFirstChar } from '@/lib/common';
import { UpdateEmployeeStatus } from './update-employee-status';
import { adjustActiveBreadcrumbs } from '@/components/layout/breadcrumbs/breadcrumbs-store';
import { Authorization, ROLES } from '@/lib/authorization';

export const EmployeeView = ({ employeeId }: { employeeId: string | undefined }) => {
  
  if(!employeeId){
    return <h1>Unrecognized Request</h1>
  }
  
  const employeeQuery = useEmployee({
    employeeId,
  });
  const employee = employeeQuery?.data?.data;

  adjustActiveBreadcrumbs(`/employees/:id`,`/employees/${employeeId}`, employee?.name, [ employee ]);

  if (employeeQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }


  if (!employee) return null;

  return (
    <div className="mt-6 flex flex-col px-6 space-y-2">
      <div className="grid grid-cols-2 gap-6">
        <Card className="col-span-1 shadow-sm">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Informasi dasar mengenai identitas pribadi karyawan seperti alamat, email, nomor telepon dan lain-lain.</CardDescription>
          </CardHeader>
          <CardContent> 
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Name</p>
              <p className="text-sm text-muted-foreground">
                {employee.name} ({capitalizeFirstChar(employee.gender)})
                <br />
                {employee.code ?? <span className='text-red'>No Employee Code Found</span>}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Birth Place/Date</p>
              <p className="text-sm text-muted-foreground">
                {employee.birthPlace} {employee.birthDate && `, ${formatDate(employee.birthDate)}`}
                {!(employee.birthPlace && employee.birthDate) && '-'}
              </p>
            </div>


            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Religion</p>
              <p className="text-sm text-muted-foreground">
                {employee.religion?.name ?? '-'}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">ID Number (KTP)</p>
              <p className="text-sm text-muted-foreground">{employee.idNumber ?? '-'}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Marital Status</p>
              <p className="text-sm text-muted-foreground">
                {capitalizeFirstChar(employee.maritalStatus)}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Bank Account/Number</p>
              <p className="text-sm text-muted-foreground">
                {employee.bankBranch} {employee.bankAccount}
                {!(employee.bankBranch && employee.bankAccount) && '-'}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Insurance Number</p>
              <p className="text-sm text-muted-foreground">{employee.insuranceNumber ?? '-'}</p>
            </div>

            {employee.taxNumber &&
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Tax Number</p>
                <p className="text-sm text-muted-foreground">{employee.taxNumber}</p>
              </div>}

            {employee.taxStatus &&
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Tax Status</p>
                <p className="text-sm text-muted-foreground">{employee.taxStatus.name ?? '-'}</p>
              </div>}
          </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 shadow-sm">
          <CardHeader>
            <CardTitle>Employment Information</CardTitle>
            <CardDescription>Informasi mengenai status pekerjan karyawan seperti divisi, jabatan, masa kerja dan lain-lain.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* First Item, spans 2 columns */}
              <div className="space-y-1 col-span-2">
                <p className="text-sm font-medium leading-none">Length of Service (Masa Kerja)</p>
                <p className="text-sm text-muted-foreground">
                  {employee.employmentStartDate && formatDate(employee.employmentStartDate)} - {employee.employmentEndDate && formatDate(employee.employmentEndDate)} 
                </p>
              </div>
                {/* First Item, spans 2 columns */}
                
              <div className="space-y-1 col-span-2">
                <p className="text-sm font-medium leading-none">Employment Status</p>
                <p className="text-sm text-muted-foreground">
                  {employee.employmentStatus?.name ?? "-"}
                </p>
              </div> 
              <div className="space-y-1 col-span-1">
                <p className="text-sm font-medium leading-none">Outsource Vendor</p>
                <p className="text-sm text-muted-foreground">
                  {employee.outsourceVendor?.name ?? "-"}
                </p>
              </div>
              
              <div className="space-y-1 col-span-1">
                <p className="text-sm font-medium leading-none">Job Grade</p>
                <p className="text-sm text-muted-foreground">
                  {employee.jobGrade?.name ?? "-"}
                </p>
              </div>
              <div className="space-y-1 col-span-1">
                <p className="text-sm font-medium leading-none">Department</p>
                <p className="text-sm text-muted-foreground">
                  {employee.jobPosition?.department?.name ?? "-"}
                </p>
              </div> 
              
              <div className="space-y-1 col-span-1">
                <p className="text-sm font-medium leading-none">Job Position</p>
                <p className="text-sm text-muted-foreground">
                  {employee.jobPosition?.name  ?? "-"}
                </p>
              </div>
              {employee.organizationUnit &&
              <div className="space-y-1 col-span-1">
                <p className="text-sm font-medium leading-none">Organization Unit</p>
                <p className="text-sm text-muted-foreground">
                {employee.organizationUnit.name} [{employee.organizationUnit.code}]
                </p>
              </div>}
              
              <div className="space-y-1 col-span-1">
                <p className="text-sm font-medium leading-none">Work Location</p>
                <p className="text-sm text-muted-foreground">
                  {employee.workLocation?.name ?? "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
    <Authorization allowedRoles={[ROLES.ADMIN, ROLES.HR]}>
      <Card className="col-span-1 shadow-sm mt-4">
        <CardHeader>
          <CardTitle>Terminate Employee</CardTitle>
          <CardDescription>This action must be considered carefully</CardDescription>
        </CardHeader>
        <CardContent>
          <UpdateEmployeeStatus employee={employee}/>
        </CardContent>
      </Card>
    </Authorization>
    </div>
  );
};
