import { QueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { RouterProvider, createBrowserRouter, useLocation } from 'react-router-dom';

import { paths } from '@/apps/hris-dashboard/paths';
import { ProtectedRoute } from '@/lib/auth';

import { AppRoot, AppRootErrorBoundary } from '@/pages/app/root';
import { queryClient } from '@/lib/react-query';

export const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: paths.app.root.path,
      element: (
        <ProtectedRoute>
          <AppRoot />
        </ProtectedRoute>
      ),
      ErrorBoundary: AppRootErrorBoundary,
      children: [
        {
          path: paths.app.employees.path,
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
          path: paths.app.employee.path,
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
          path: paths.app.users.path,
          lazy: async () => {
            const { UsersRoute, usersLoader } = await import(
              '@/pages/app/users'
            );
            return {
              Component: UsersRoute,
              loader: usersLoader(queryClient),
            };
          },
          ErrorBoundary: AppRootErrorBoundary,
        },
        {
          path: paths.app.profile.path,
          lazy: async () => {
            const { ProfileRoute } = await import('@/pages/app/profile');
            return {
              Component: ProfileRoute,
            };
          },
          ErrorBoundary: AppRootErrorBoundary,
        },
        {
          path: paths.app.dashboard.path,
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
    basename : '/hris'
  });

export const AppRouter = () => {
  const router = useMemo(() => createAppRouter(queryClient), [queryClient]);
  
  return <RouterProvider router={router} />;
};
