import { Spinner } from '@/components/ui/spinner';
import { useAttendance } from '../api/get-attendance';
import { formatDate, formatDateTime } from '@/lib/datetime';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { capitalizeFirstChar } from '@/lib/common';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { adjustActiveBreadcrumbs } from '@/components/layout/breadcrumbs/breadcrumbs-store';
import { useImagePreviewerStore } from '@/components/ui/image-previewer';
import { InfoIcon } from 'lucide-react';

export const AttendanceView = ({ attendanceId }: { attendanceId: string }) => {
  const { setSelectedImage } = useImagePreviewerStore()
  const attendanceQuery = useAttendance({
    attendanceId,
  });
  const attendance = attendanceQuery?.data?.data;
  adjustActiveBreadcrumbs(`/attendances/:id`,`/attendances/${attendanceId}`, (attendance?.employee ? attendance?.employee?.name : ""), [ attendance ]);
  
  if (attendanceQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!attendance) return null;

  return (
    <div className="mt-6 flex flex-col px-6 space-y-2">
      <div className="grid grid-cols-2 gap-6">
        {/* First column: Attendance Data */}
        <Card className="col-span-1 shadow-sm">
          <CardHeader>
            <CardTitle>Attendance Information</CardTitle>
            <CardDescription>Details about employee's attendance, check-in/check-out time, and photos.</CardDescription>
          </CardHeader>
          <CardContent>
            {attendance.corrected &&
              <Alert className='mb-4' variant={'info'}>
                <AlertTitle className='inline-flex content-center'><InfoIcon/> <span className='my-auto mx-2'>This attendance record has been corrected</span></AlertTitle>
                <AlertDescription>
                  Corrected By {attendance.correctedBy?.name} [{attendance.correctedBy?.username}] at {attendance.correctedAt ? formatDateTime(attendance.correctedAt) : "-"}
                </AlertDescription>
              </Alert>
            }
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Check-in Time</p>
                  <p className="text-sm text-muted-foreground">
                    {attendance.checkIn ? formatDate(attendance.checkIn) : '-'}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Check-in Photo</p>
                  {attendance.checkInPhoto ? (
                    <img
                      src={`${import.meta.env.VITE_BASE_URL}/storage/${attendance.checkInPhoto}`}
                      alt="Check-in"
                      className="w-32 h-32 object-cover rounded-md"
                      onClick={() => setSelectedImage(`${import.meta.env.VITE_BASE_URL}/storage/${attendance.checkInPhoto}`)}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">No photo available</p>
                  )}
                </div>
              </div>
              <div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Check-out Time</p>
                  <p className="text-sm text-muted-foreground">
                    {attendance.checkOut ? formatDate(attendance.checkOut) : '-'}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Check-out Photo</p>
                  {attendance.checkOutPhoto ? (
                    <img
                      src={`${import.meta.env.VITE_BASE_URL}/storage/${attendance.checkOutPhoto}`}
                      alt="Check-out"
                      className="w-32 h-32 object-cover rounded-md"
                      onClick={() => setSelectedImage(`${import.meta.env.VITE_BASE_URL}/storage/${attendance.checkOutPhoto}`)}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">No photo available</p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Hours Worked</p>
                <p className="text-sm text-muted-foreground">{attendance.hoursWorked.toFixed(2)} hours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Second column: Employee Info */}
        {
          attendance.employee ? 
          <Card className="col-span-1 shadow-sm">
            <CardHeader>
              <CardTitle>Employee Information</CardTitle>
              <CardDescription>Details about the employee such as name, position, department, etc.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 p-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Name</p>
                  <p className="text-sm text-muted-foreground">
                    {attendance.employee.name} ({capitalizeFirstChar(attendance.employee.gender)})
                  </p>
                </div>
  
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Employee Code</p>
                  <p className="text-sm text-muted-foreground">{attendance.employee.code}</p>
                </div>
  
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Job Grade</p>
                  <p className="text-sm text-muted-foreground">{attendance.employee?.jobGrade?.name ?? '-'}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Position</p>
                  <p className="text-sm text-muted-foreground">{attendance.employee?.jobPosition?.name ?? '-'}</p>
                </div>
  
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Department</p>
                  <p className="text-sm text-muted-foreground">{attendance.employee?.jobPosition?.department?.name ?? '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          : 
          <Card className="col-span-1 shadow-sm">
            <CardHeader>
              <CardTitle>Employee Information</CardTitle>
              <CardDescription>Details about the employee such as name, position, department, etc.</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert variant={'destructive'}>
                <AlertTitle>Employee Not Found</AlertTitle>
                <AlertDescription>It seems this attendance record isn't associated with any employee. Please check the details and try again.</AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        }
      </div>
    </div>
  );
};
