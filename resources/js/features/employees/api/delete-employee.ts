import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { getEmployeesQueryOptions } from './get-employees';

export type DeleteEmployeeDTO = {
  employeeId: string;
};

export const deleteEmployee = ({
  employeeId,
}: DeleteEmployeeDTO) => {
  return api.delete(`/employees/${employeeId}`);
};

type UseDeleteEmpoyeeOptions = {
  mutationConfig?: MutationConfig<typeof deleteEmployee>;
};

export const useDeleteEmpoyee = ({
  mutationConfig,
}: UseDeleteEmpoyeeOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args : any) => {
      queryClient.invalidateQueries({
        queryKey: getEmployeesQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteEmployee,
  });
};
