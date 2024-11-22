import { useMutation, useQueryClient } from  '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { Employee } from '@/types/api';

import { getEmployeeQueryOptions } from './get-employee';

export const updateEmployeeInputSchema = z.object({
  title: z.string().min(1, 'Required'),
  body: z.string().min(1, 'Required'),
});

export type UpdateEmployeeInput = z.infer<typeof updateEmployeeInputSchema>;

export const updateEmployee = ({
  data,
  employeeId,
}: {
  data: UpdateEmployeeInput;
  employeeId: string;
}): Promise<Employee> => {
  return api.patch(`/employees/${employeeId}`, data);
};

type UseUpdateEmployeeOptions = {
  mutationConfig?: MutationConfig<typeof updateEmployee>;
};

export const useUpdateEmployee = ({
  mutationConfig,
}: UseUpdateEmployeeOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data : any, ...args : any) => {
      queryClient.refetchQueries({
        queryKey: getEmployeeQueryOptions(data.id).queryKey,
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateEmployee,
  });
};
