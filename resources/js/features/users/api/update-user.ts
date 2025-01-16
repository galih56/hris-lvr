import { useMutation, useQueryClient } from  '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { User } from '@/types/api';

import { getUserQueryOptions } from './get-user';

export const updateUserInputSchema = z.object({
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


export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;

export const updateUser = ({
  data,
  userId,
}: {
  data: UpdateUserInput;
  userId: string;
}): Promise<User> => {
  return api.patch(`/users/${userId}`, data);
};

type UseUpdateUserOptions = {
  mutationConfig?: MutationConfig<typeof updateUser>;
};

export const useUpdateUser = ({
  mutationConfig,
}: UseUpdateUserOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data : any, ...args ) => {
      queryClient.refetchQueries({
        queryKey: getUserQueryOptions(data.id).queryKey,
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateUser,
  });
};
