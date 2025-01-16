import { useMutation, useQueryClient } from  '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { Department } from '@/types/api';

import { getDepartmentQueryOptions } from './get-department';

export const updateDepartmentInputSchema = z.object({
  code: z.string().min(1, { message: 'Code is required.' }),
  name: z.string().min(1, { message: 'Name is required.' }),
});

export type UpdateDepartmentInput = z.infer<typeof updateDepartmentInputSchema>;

export const updateDepartment = ({
  data,
  departmentId,
}: {
  data: UpdateDepartmentInput;
  departmentId: string;
}): Promise<Department> => {
  return api.patch(`/departments/${departmentId}`, data);
};

type UseUpdateDepartmentOptions = {
  mutationConfig?: MutationConfig<typeof updateDepartment>;
};

export const useUpdateDepartment = ({
  mutationConfig,
}: UseUpdateDepartmentOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data : any, ...args ) => {
      queryClient.refetchQueries({
        queryKey: getDepartmentQueryOptions(data.id).queryKey,
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateDepartment,
  });
};
