import { ROLES } from '@/lib/authorization';
import useAuth from '@/store/useAuth';

export const DashboardRoute = () => {
  const { user } = useAuth();

  return (
    <>
      <h1 className="text-xl">
        Welcome <b>{`${user?.name}`}</b>
      </h1>
      <p className="font-medium">In this application you can:</p>
      {user?.role?.code === ROLES.EMP && (
        <ul className="my-4 list-inside list-disc">
          <li>Create comments in discussions</li>
          <li>Delete own comments</li>
        </ul>
      )}
      {user?.role?.code === ROLES.ADMIN && (
        <ul className="my-4 list-inside list-disc">
          <li>Create discussions</li>
          <li>Edit discussions</li>
          <li>Delete discussions</li>
          <li>Comment on discussions</li>
          <li>Delete all comments</li>
        </ul>
      )}
    </>
  );
};
