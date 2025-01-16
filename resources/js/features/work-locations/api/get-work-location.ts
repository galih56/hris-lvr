import { useQuery, queryOptions } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { WorkLocation } from '@/types/api';

export const getWorkLocation = ({
  workLocationId,
}: {
  workLocationId: string;
}): Promise<{ data: WorkLocation }> => {
  return api.get(`/work_locations/${workLocationId}`);
};

export const getWorkLocationQueryOptions = (workLocationId: string) => {
  return queryOptions({
    queryKey: ['work-locations', workLocationId],
    queryFn: () => getWorkLocation({ workLocationId }),
  });
};

type UseWorkLocationOptions = {
  workLocationId: string;
  queryConfig?: QueryConfig<typeof getWorkLocationQueryOptions>;
};

export const useWorkLocation = ({
  workLocationId,
  queryConfig,
}: UseWorkLocationOptions) => {
  return useQuery({
    ...getWorkLocationQueryOptions(workLocationId),
    ...queryConfig,
  });
};
