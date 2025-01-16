import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Attendance, Meta } from '@/types/api';


export const getAttendances = (
  page = 1,
  perPage = 15,
  search?: string
): Promise<{
  data: Attendance[];
  meta?: Meta;
}> => {
  return api.get(`/attendances`, {
    params: {
      page,
      per_page: perPage,
      search,
    },
  });
};

export const getAttendancesQueryOptions = ({
  page=1,
  perPage = 15,
  search="", 
}: { page?: number; perPage?: number; search?: string } = {}) => {
  return queryOptions({
    queryKey: ['attendances', { page, perPage, search }],
    queryFn: () => getAttendances(page, perPage, search),
  });
};

type UseAttendancesOptions = {
  page?: number;
  perPage?: number;
  search?: string; 
  queryConfig?: QueryConfig<typeof getAttendancesQueryOptions>;
};

export const useAttendances = ({
  queryConfig,
  page = 1,
  perPage = 15,
  search="", 
}: UseAttendancesOptions) => {
  return useQuery({
    ...getAttendancesQueryOptions({ page, perPage, search }), 
    ...queryConfig,
    select: (data) => {
      return {
        data: data.data,
        meta: data.meta,
      };
    },
  });
};
