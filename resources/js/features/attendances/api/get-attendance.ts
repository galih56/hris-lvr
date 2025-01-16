import { useQuery, queryOptions } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Attendance } from '@/types/api';

export const getAttendance = ({
  attendanceId,
}: {
  attendanceId: string;
}): Promise<{ data: Attendance }> => {
  return api.get(`/attendances/${attendanceId}`);
};

export const getAttendanceQueryOptions = (attendanceId: string) => {
  return queryOptions({
    queryKey: ['attendances', attendanceId],
    queryFn: () => getAttendance({ attendanceId }),
  });
};

type UseAttendanceOptions = {
  attendanceId: string;
  queryConfig?: QueryConfig<typeof getAttendanceQueryOptions>;
};

export const useAttendance = ({
  attendanceId,
  queryConfig,
}: UseAttendanceOptions) => {
  return useQuery({
    ...getAttendanceQueryOptions(attendanceId),
    ...queryConfig,
  });
};
