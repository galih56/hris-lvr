import { useQuery, queryOptions } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Shift } from '@/types/api';

export const getShift = ({
  shiftId,
}: {
  shiftId: string;
}): Promise<{ data: Shift }> => {
  return api.get(`/shifts/${shiftId}`);
};

export const getShiftQueryOptions = (shiftId: string) => {
  return queryOptions({
    queryKey: ['shifts', shiftId],
    queryFn: () => getShift({ shiftId }),
  });
};

type UseShiftOptions = {
  shiftId: string;
  queryConfig?: QueryConfig<typeof getShiftQueryOptions>;
};

export const useShift = ({
  shiftId,
  queryConfig,
}: UseShiftOptions) => {
  return useQuery({
    ...getShiftQueryOptions(shiftId),
    ...queryConfig,
  });
};
