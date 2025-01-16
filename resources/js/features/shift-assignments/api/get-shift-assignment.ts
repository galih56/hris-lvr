import { useQuery, queryOptions } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { ShiftAssignment } from '@/types/api';

export const getShiftAssignment = ({
  shiftAssignmentId,
}: {
  shiftAssignmentId: string;
}): Promise<{ data: ShiftAssignment }> => {
  return api.get(`/shift_assignments/${shiftAssignmentId}`);
};

export const getShiftAssignmentQueryOptions = (shiftAssignmentId: string) => {
  return queryOptions({
    queryKey: ['shift-assignments', shiftAssignmentId],
    queryFn: () => getShiftAssignment({ shiftAssignmentId }),
  });
};

type UseShiftAssignmentOptions = {
  shiftAssignmentId: string;
  queryConfig?: QueryConfig<typeof getShiftAssignmentQueryOptions>;
};

export const useShiftAssignment = ({
  shiftAssignmentId,
  queryConfig,
}: UseShiftAssignmentOptions) => {
  return useQuery({
    ...getShiftAssignmentQueryOptions(shiftAssignmentId),
    ...queryConfig,
  });
};
