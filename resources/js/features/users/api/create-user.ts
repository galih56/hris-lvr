import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { User } from '@/types/api';

import { getUsersQueryOptions } from './get-users';


export const createUserInputSchema = z.object({
  username: z.string().min(1, "Username is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email(),
  password: z.string().min(6).optional(),
  passwordConfirmation: z.string().min(6).optional(),
  roleCode: z.string().optional(),
  employeeId: z.string().optional()
}).refine(
  (data) => {
    // `employeeId` is required if `roleCode` is 'EMP' or 'HR'.
    if (data.roleCode === "EMP" || data.roleCode === "HR") {
      return !!data.employeeId; // Ensure `employeeId` is truthy.
    }
    return true; // If not 'EMP' or 'HR', no validation needed.
  },
  {
    message: "Employee ID is required for EMP or HR roles",
    path: ["employeeId"], // Focus the error on the `employeeId` field.
  }
);

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

export const createUser = (data : CreateUserInput): Promise<User> => {
  return api.post(`/users`, data);
};

type UseCreateUserOptions = {
  mutationConfig?: MutationConfig<typeof createUser>;
};

export const useCreateUser = ({
  mutationConfig,
}: UseCreateUserOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args : any) => {
      queryClient.invalidateQueries({
        queryKey: getUsersQueryOptions().queryKey,
      });
      onSuccess?.(args);
    },
    ...restConfig,
    mutationFn: createUser,
  });
};
