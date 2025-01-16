import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { Department } from '@/types/api';
import { subYears } from 'date-fns';

import { getDepartmentsQueryOptions } from './get-departments';


export const createDepartmentInputSchema = z.object({
  code: z.string().min(1, { message: 'Code is required.' }),
  name: z.string().min(1, { message: 'Name is required.' }),
});

export type CreateDepartmentInput = z.infer<typeof createDepartmentInputSchema>;

export const createDepartment = (data : CreateDepartmentInput): Promise<Department> => {
  return api.post(`/departments`, data);
};

type UseCreateDepartmentOptions = {
  mutationConfig?: MutationConfig<typeof createDepartment>;
};

export const useCreateDepartment = ({
  mutationConfig,
}: UseCreateDepartmentOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args : any) => {
      queryClient.invalidateQueries({
        queryKey: getDepartmentsQueryOptions().queryKey,
      });
      onSuccess?.(args);
    },
    ...restConfig,
    mutationFn: createDepartment,
  });
};
