import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z, ZodType } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { LeaveRequest } from '@/types/api';

import { getLeaveRequestsQueryOptions } from './get-leave-requests';


export const createLeaveRequestInputSchema = (minDate?: Date | null, maxDate?: Date | null) :  ZodType<any, any, any>=>
  z.object({
    leaveTypeId: z.string().min(1, { message: 'Please select a leave type.' }),
    leaveDates: z
      .object({
        from: z.date(),
        to: z.date(),
      })
      .refine((data) => data.from?.getTime() <= data.to?.getTime(), {
        message: 'The end date must be after the start date.',
      })
      .refine(
        (data) => {
          if (data.from && data.to && minDate && maxDate) {
            const fromDate = data.from.getTime();
            const toDate = data.to.getTime();
            return fromDate >= minDate?.getTime() && toDate <= maxDate?.getTime();
          }
          return true; // If either from or to date is missing, skip validation
        },
        {
          message: `Leave dates must be between ${minDate?.toLocaleDateString()} and ${maxDate?.toLocaleDateString()}.`,
        }
      )
      .transform((data) => ({
        start: data.from,
        end: data.to,
      })),
    start: z.date().nullable().optional(),
    end: z.date().nullable().optional(),
    notes: z.string().optional(),
  }) ;

export type CreateLeaveRequestInput = z.infer<typeof createLeaveRequestInputSchema>;

export const createLeaveRequest = (data : CreateLeaveRequestInput): Promise<LeaveRequest> => {
  return api.post(`/leave_requests`, data);
};

type UseCreateLeaveRequestOptions = {
  mutationConfig?: MutationConfig<typeof createLeaveRequest>;
};

export const useCreateLeaveRequest = ({
  mutationConfig,
}: UseCreateLeaveRequestOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args : any) => {
      queryClient.invalidateQueries({
        queryKey: getLeaveRequestsQueryOptions().queryKey,
      });
      onSuccess?.(args);
    },
    ...restConfig,
    mutationFn: createLeaveRequest,
  });
};
