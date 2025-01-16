import { QueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Outlet, RouterProvider, createBrowserRouter, useLocation, useRouteError } from 'react-router-dom';

import { paths } from '@/apps/hris-dashboard/paths';
import { ProtectedRoute } from '@/lib/auth';
import { queryClient } from '@/lib/react-query';
import { Layout } from './layout';

const AppRootErrorBoundary = () => {
  const error = useRouteError();
  return <div>Something went wrong!</div>;
};

export const createAppRouter = (queryClient: QueryClient) => {
  return createBrowserRouter([
    {
      path: paths.home.path,
      element: (
        <ProtectedRoute>
          <Layout>
            <Outlet />
          </Layout>
        </ProtectedRoute>
      ),
      ErrorBoundary: AppRootErrorBoundary,
      children: [
        {
          path: paths.employees.path,
          lazy: async () => {
            const { EmployeesRoute, employeesLoader } = await import(
              '@/pages/app/employees/employees'
            );
            return {
              Component: EmployeesRoute,
              loader: employeesLoader(queryClient),
            };
          },
          ErrorBoundary: AppRootErrorBoundary,
        },
        {
          path: paths.employee.path,
          lazy: async () => {
            const { EmployeeRoute, employeeLoader } = await import(
              '@/pages/app/employees/employee'
            );
            return {
              Component: EmployeeRoute,
              loader: employeeLoader(queryClient),
            };
          },
          ErrorBoundary: AppRootErrorBoundary,
        },
        {
          path: paths.attendances.path,
          lazy: async () => {
            const { AttendancesRoute, attendancesLoader } = await import(
              '@/pages/app/attendances/attendances'
            );
            return {
              Component: AttendancesRoute,
              loader: attendancesLoader(queryClient),
            };
          },
          ErrorBoundary: AppRootErrorBoundary,
        },
        {
          path: paths.attendance.path,
          lazy: async () => {
            const { AttendanceRoute, attendanceLoader } = await import(
              '@/pages/app/attendances/attendance'
            );
            return {
              Component: AttendanceRoute,
              loader: attendanceLoader(queryClient),
            };
          },
          ErrorBoundary: AppRootErrorBoundary,
        },
        {
          path: paths.leaveRequests.path,
          lazy: async () => {
            const { LeaveRequestsRoute, leaveRequestsLoader } = await import(
              '@/pages/app/leave-requests/leave-requests'
            );
            return {
              Component: LeaveRequestsRoute,
              loader: leaveRequestsLoader(queryClient),
            };
          },
          ErrorBoundary: AppRootErrorBoundary,
        },
        {
          path: paths.leaveRequest.path,
          lazy: async () => {
            const { LeaveRequestRoute, leaveRequestLoader } = await import(
              '@/pages/app/leave-requests/leave-request'
            );
            return {
              Component: LeaveRequestRoute,
              loader: leaveRequestLoader(queryClient),
            };
          },
          ErrorBoundary: AppRootErrorBoundary,
        },
        {
          path: paths.shifts.path,
          lazy: async () => {
            const { ShiftsRoute, shiftsLoader } = await import(
              '@/pages/app/shifts/shifts'
            );
            return {
              Component: ShiftsRoute,
              loader: shiftsLoader(queryClient),
            };
          },
          ErrorBoundary: AppRootErrorBoundary,
        },
        {
          path: paths.shift.path,
          lazy: async () => {
            const { ShiftRoute, shiftLoader } = await import(
              '@/pages/app/shifts/shift'
            );
            return {
              Component: ShiftRoute,
              loader: shiftLoader(queryClient),
            };
          },
          ErrorBoundary: AppRootErrorBoundary,
        },
        {
          path: paths.shiftAssignments.path,
          lazy: async () => {
            const { ShiftAssignmentsRoute, shiftAssignmentsLoader } = await import(
              '@/pages/app/shift-assignments/shift-assignments'
            );
            return {
              Component: ShiftAssignmentsRoute,
              loader: shiftAssignmentsLoader(queryClient),
            };
          },
          ErrorBoundary: AppRootErrorBoundary,
        },
        {
          path: paths.shiftAssignment.path,
          lazy: async () => {
            const { ShiftAssignmentRoute, shiftAssignmentLoader } = await import(
              '@/pages/app/shift-assignments/shift-assignment'
            );
            return {
              Component: ShiftAssignmentRoute,
              loader: shiftAssignmentLoader(queryClient),
            };
          },
          ErrorBoundary: AppRootErrorBoundary,
        },
        {
          path: paths.departments.path,
          lazy: async () => {
            const { DepartmentsRoute, departmentsLoader } = await import(
              '@/pages/app/departments/departments'
            );
            return {
              Component: DepartmentsRoute,
              loader: departmentsLoader(queryClient),
            };
          },
          ErrorBoundary: AppRootErrorBoundary,
        },
        {
          path: paths.department.path,
          lazy: async () => {
            const { DepartmentRoute, departmentLoader } = await import(
              '@/pages/app/departments/department'
            );
            return {
              Component: DepartmentRoute,
              loader: departmentLoader(queryClient),
            };
          },
          ErrorBoundary: AppRootErrorBoundary,
        },
        {
          path: paths.jobPositions.path,
          lazy: async () => {
            const { JobPositionsRoute, jobPositionsLoader } = await import(
              '@/pages/app/job-positions/job-positions'
            );
            return {
              Component: JobPositionsRoute,
              loader: jobPositionsLoader(queryClient),
            };
          },
          ErrorBoundary: AppRootErrorBoundary,
        },
        {
          path: paths.jobPosition.path,
          lazy: async () => {
            const { JobPositionRoute, jobPositionLoader } = await import(
              '@/pages/app/job-positions/job-position'
            );
            return {
              Component: JobPositionRoute,
              loader: jobPositionLoader(queryClient),
            };
          },
          ErrorBoundary: AppRootErrorBoundary,
        },
        {
          path: paths.workLocations.path,
          lazy: async () => {
            const { WorkLocationsRoute, workLocationsLoader } = await import(
              '@/pages/app/work-locations/work-locations'
            );
            return {
              Component: WorkLocationsRoute,
              loader: workLocationsLoader(queryClient),
            };
          },
          ErrorBoundary: AppRootErrorBoundary,
        },
        {
          path: paths.workLocation.path,
          lazy: async () => {
            const { WorkLocationRoute, workLocationLoader } = await import(
              '@/pages/app/work-locations/work-location'
            );
            return {
              Component: WorkLocationRoute,
              loader: workLocationLoader(queryClient),
            };
          },
          ErrorBoundary: AppRootErrorBoundary,
        },
        {
          path: paths.users.path,
          lazy: async () => {
            const { UsersRoute, usersLoader } = await import(
              '@/pages/app/users/users'
            );
            return {
              Component: UsersRoute,
              loader: usersLoader(queryClient),
            };
          },
          ErrorBoundary: AppRootErrorBoundary,
        },
        {
          path: paths.user.path,
          lazy: async () => {
            const { UserRoute, userLoader } = await import(
              '@/pages/app/users/user'
            );
            return {
              Component: UserRoute,
              loader: userLoader(queryClient),
            };
          },
          ErrorBoundary: AppRootErrorBoundary,
        },
        {
          path: paths.profile.path,
          lazy: async () => {
            const { ProfileRoute } = await import('@/pages/app/users/profile');
            return {
              Component: ProfileRoute,
            };
          },
          ErrorBoundary: AppRootErrorBoundary,
        },
        {
          path: paths.dashboard.path,
          lazy: async () => {
            const { DashboardRoute } = await import('@/pages/app/dashboard');
            return {
              Component: DashboardRoute,
            };
          },
          ErrorBoundary: AppRootErrorBoundary,
        },
      ],
    },
    {
      path: '*',
      lazy: async () => {
        const { NotFoundRoute } = await import('@/pages/not-found');
        return {
          Component: NotFoundRoute,
        };
      },
      ErrorBoundary: AppRootErrorBoundary,
    },
  ], {
    basename : '/'
  })
};

export const AppRouter = () => {
  const router = useMemo(() => createAppRouter(queryClient), [queryClient]);
  
  return <RouterProvider router={router} />;
};
