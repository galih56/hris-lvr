import { useQuery, queryOptions } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { JobPosition } from '@/types/api';

export const getJobPosition = ({
  jobPositionId,
}: {
  jobPositionId: string;
}): Promise<{ data: JobPosition }> => {
  return api.get(`/job_positions/${jobPositionId}`);
};

export const getJobPositionQueryOptions = (jobPositionId: string) => {
  return queryOptions({
    queryKey: ['job-positions', jobPositionId],
    queryFn: () => getJobPosition({ jobPositionId }),
  });
};

type UseJobPositionOptions = {
  jobPositionId: string;
  queryConfig?: QueryConfig<typeof getJobPositionQueryOptions>;
};

export const useJobPosition = ({
  jobPositionId,
  queryConfig,
}: UseJobPositionOptions) => {
  return useQuery({
    ...getJobPositionQueryOptions(jobPositionId),
    ...queryConfig,
  });
};
