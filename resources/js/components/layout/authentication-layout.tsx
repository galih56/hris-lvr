import * as React from 'react';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Head } from '@/components/seo';
import { Link } from '@/components/ui/link';
import { paths } from '@/apps/hris-dashboard/paths';
import logo from '@/assets/logo.png';
import { useBaseName } from '@/hooks/use-basename';
import useAuth from '@/store/useAuth';

type LayoutProps = {
  children: React.ReactNode;
  title?: string;
};

export const AuthenticationLayout = ({ children, title }: LayoutProps) => {
  const user = useAuth();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  
  useEffect(() => {
    if (user.authenticated) {
       window.location.href = paths.home.getHref()
    }
  }, [
    user.authenticated, 
    redirectTo
  ]);

    return (
    <>
      <Head title={title} />
      <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Link className="flex items-center text-white" to={'/'} >
              <img className="h-24 w-auto" src={logo} alt="Workflow" />
            </Link>
          </div>

          {title && 
            <h2 className="mt-3 text-center text-3xl font-extrabold text-gray-900">
              {title}
            </h2>}
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};
