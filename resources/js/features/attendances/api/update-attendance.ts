import { useMutation, useQueryClient } from  '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { Attendance } from '@/types/api';

import { getAttendanceQueryOptions } from './get-attendance';

export const updateAttendanceInputSchema = z.object({
  status: z.enum(['present', 'absent', 'leave'], {
    errorMap: () => ({ message: 'Invalid status.' })
  }),
  notes: z.string().optional(),
  checkIn: z.date().optional(),
  checkOut: z.date().optional(),
}).superRefine((value, ctx) => {
  if (value.status === 'present' && (value === undefined || isNaN(value.checkIn?.getTime()))) {
    ctx.addIssue({
      path: ['checkOut'],
      message: 'Invalid datetime for check-out.',
      code: z.ZodIssueCode.custom,
    });
  }
});

export type UpdateAttendanceInput = z.infer<typeof updateAttendanceInputSchema>;

export const updateAttendance = ({
  data,
  attendanceId,
}: {
  data: UpdateAttendanceInput;
  attendanceId: string;
}): Promise<Attendance> => {
  return api.patch(`/attendances/${attendanceId}`, data);
};

type UseUpdateAttendanceOptions = {
  mutationConfig?: MutationConfig<typeof updateAttendance>;
};

export const useUpdateAttendance = ({
  mutationConfig,
}: UseUpdateAttendanceOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data : any, ...args ) => {
      queryClient.refetchQueries({
        queryKey: getAttendanceQueryOptions(data.id).queryKey,
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateAttendance,
  });
};
