import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Department, Meta } from '@/types/api';


export const getDepartments = (
  page = 1,
  perPage = 15,
  search?: string
): Promise<{
  data: Department[];
  meta?: Meta;
}> => {
  return api.get(`/departments`, {
    params: {
      page,
      per_page: perPage,
      search,
    },
  });
};

export const getDepartmentsQueryOptions = ({
  page,
  perPage = 15,
  search, 
}: { page?: number; perPage?: number; search?: string } = {}) => {
  return queryOptions({
    queryKey: ['departments', { page, perPage, search }],
    queryFn: () => getDepartments(page, perPage, search),
  });
};

type UseDepartmentsOptions = {
  page?: number;
  perPage?: number;
  search?: string; 
  queryConfig?: QueryConfig<typeof getDepartmentsQueryOptions>;
};

export const useDepartments = ({
  queryConfig,
  page = 1,
  perPage = 15,
  search, 
}: UseDepartmentsOptions) => {
  return useQuery({
    ...getDepartmentsQueryOptions({ page, perPage, search }), 
    ...queryConfig,
    select: (data) => {
      return {
        data: data.data,
        meta: data.meta,
      };
    },
  });
};
