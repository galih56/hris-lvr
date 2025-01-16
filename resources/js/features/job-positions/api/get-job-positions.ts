import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { JobPosition, Meta, PaginationParams } from '@/types/api';

type Filters = {
  departmentId?: string;
};

export const getJobPositions = (
  page?: number,
  perPage?: number,
  search?: string,
  filters?: Filters
): Promise<{
  data: JobPosition[];
  meta?: Meta;
}> => {
  return api.get('/job_positions', {
    params: {
      ...(page && perPage ? { page, per_page: perPage } : {}), 
      search,
      filters, 
    },
  });
};

export const getJobPositionsQueryOptions = ({
  page,
  perPage,
  search,
  filters,
}: PaginationParams & { filters?: Filters }) => {
  return queryOptions({
    queryKey: ['job_positions', { page, perPage, search, filters }],
    queryFn: () =>
      getJobPositions(page, perPage, search, filters), 
  });
};

type UseJobPositionsOptions = {
  page?: number;
  perPage?: number;
  search?: string;
  filters?: Filters; 
  queryConfig?: QueryConfig<typeof getJobPositionsQueryOptions>;
};

export const useJobPositions = ({
  page,
  perPage,
  search,
  filters, 
  queryConfig = {},
}: UseJobPositionsOptions = {}) => {
  return useQuery({
    ...getJobPositionsQueryOptions({ page, perPage, search, filters }), 
    ...queryConfig,
    select: (data) => ({
      data: data.data,
      meta: data.meta,
    }),
  });
};
