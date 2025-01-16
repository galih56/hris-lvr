import { QueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Outlet, RouterProvider, createBrowserRouter, useLocation, useRouteError } from 'react-router-dom';

import { paths } from '@/apps/employee-services/paths';
import { AuthLoader, ProtectedRoute } from '@/lib/auth';

import { queryClient } from '@/lib/react-query';
import { Layout } from './layout';

const AppRootErrorBoundary = () => {
  const error = useRouteError();
  return <div>Something went wrong!</div>;
};

export const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
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
          path: paths.home.path,
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
  });

export const AppRouter = () => {
  const router = useMemo(() => createAppRouter(queryClient), [queryClient]);
  
  return <RouterProvider router={router} />;
};
