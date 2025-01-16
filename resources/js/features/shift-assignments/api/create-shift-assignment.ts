import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { ShiftAssignment } from '@/types/api';
import { getShiftAssignmentsQueryOptions } from './get-shift-assignments';


export const createShiftAssignmentInputSchema = z.object({
  employeeId: z.string().min(1, 'You must select an employee'),
  shiftId: z.string().min(1, 'You must select the shift you want to assign'),
  effectiveDate: z.date({
    required_error: 'Please provide effective date.',
  }),
  end: z
    .date()
    .optional(), 
  status: z.enum(['active', 'inactive'], {
    errorMap: () => ({ message: 'Invalid status.' }),
  }),
  notes: z.string().optional(),
  endEnabled: z.boolean(),
}).refine(
  (data) => !data.endEnabled || !!data.end, // Ensure `end` is provided if `endEnabled` is true
  {
    path: ['end'],
    message: 'Please provide an end date when endEnabled is checked.',
  }
);

export type CreateShiftAssignmentInput = z.infer<typeof createShiftAssignmentInputSchema>;

export const createShiftAssignment = (data : CreateShiftAssignmentInput): Promise<ShiftAssignment> => {
  return api.post(`/shift_assignments`, data);
};

type UseCreateShiftAssignmentOptions = {
  mutationConfig?: MutationConfig<typeof createShiftAssignment>;
};

export const useCreateShiftAssignment = ({
  mutationConfig,
}: UseCreateShiftAssignmentOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args : any) => {
      queryClient.invalidateQueries({
        queryKey: getShiftAssignmentsQueryOptions().queryKey,
      });
      onSuccess?.(args);
    },
    ...restConfig,
    mutationFn: createShiftAssignment,
  });
};
