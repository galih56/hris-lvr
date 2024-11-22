import ContentLayout from '@/components/layout/dashboard-layout';
import { Spinner } from '@/components/ui/spinner';
import { AuthLoader } from '@/lib/auth';
import { Navigate, Outlet, useRouteError } from 'react-router-dom';

export const AppRoot = () => {
  return (
    
    <AuthLoader
      renderLoading={() => (
        <div className="flex h-screen w-screen items-center justify-center">
          <Spinner size="xl" />
        </div>
      )}
    >
      <ContentLayout>
        <Outlet />
      </ContentLayout>
    </AuthLoader>
  );
};

export const AppRootErrorBoundary = () => {
  const error = useRouteError();
  console.error(error);
  return <div>Something went wrong!</div>;
};
