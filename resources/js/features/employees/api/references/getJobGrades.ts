import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';

export const getJobGrades = (): Promise<{ data: any[] }> => {
  return api.get('/job_grades');
};

export const getJobGradesQueryOptions = () => {
  return queryOptions({
    queryKey: ['job_grades'],
    queryFn: () => getJobGrades(),
  });
};

type UseJobGradesOptions = {
  queryConfig?: QueryConfig<typeof getJobGradesQueryOptions>;
};

export const useJobGrades = ({ queryConfig = {} }: UseJobGradesOptions = {}) => {
  return useQuery({
    ...getJobGradesQueryOptions(),
    ...queryConfig,
  });
};
