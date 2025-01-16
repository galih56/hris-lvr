import { MutationConfig } from "@/lib/react-query";
import { Employee } from "@/types/api";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getEmployeeQueryOptions } from './get-employee';
import { api } from "@/lib/api-client";
import { z } from 'zod';

export const updateEmployeeStatusSchema = z.object({
  terminateReasonId: z.string().min(1, { message: 'Please provide a termination reason.' }),
  resignation: z.string().min(1, { message: 'Resignation description must be filled' }),
  status :  z.enum(['active', 'inactive']).refine((val) => val, { message: 'Invalid employee status. Accepted values: active and inactive.' }),
});

type UseUpdateEmployeeStatusOptions = {
    mutationConfig?: MutationConfig<typeof updateEmployeeStatus>;
};

export const updateEmployeeStatus = ({
    employeeId,
    status,
    resignation,
    terminateReasonId
  }: {
    employeeId: string;
    status: string;
    resignation: string;
    terminateReasonId: string;
  }): Promise<Employee> => {
    return api.patch(`/employees/${employeeId}/status`, { status, resignation, terminateReasonId });
};


export const useUpdateEmployeeStatus = ({
  mutationConfig,
}: UseUpdateEmployeeStatusOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, onError, ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    onSuccess: (data: Employee, ...args) => {
      queryClient.refetchQueries({
        queryKey: getEmployeeQueryOptions(data.id).queryKey,
      });
      onSuccess?.(data, ...args);
    },
    onError: (error, variables,context) => {
      onError?.(error, variables, context)
    },
    mutationFn: updateEmployeeStatus,
  });
};