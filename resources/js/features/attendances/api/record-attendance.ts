import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { Attendance } from '@/types/api';

import { getAttendancesQueryOptions } from './get-attendances';
import { base64ImageSchema, datetimeSchema, fileSchema, locationSchema } from '@/lib/schemas';

export const recordAttendanceInputSchema = z.object({
  currentDateTime: datetimeSchema,
  photo: z.union([base64ImageSchema, fileSchema]),
  location: locationSchema,
});

export type RecordAttendanceInput = z.infer<typeof recordAttendanceInputSchema>;

export const recordAttendance = (data: RecordAttendanceInput): Promise<Attendance> => {
  return api.post(`/attendances`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

type UseRecordAttendanceOptions = {
  mutationConfig?: MutationConfig<typeof recordAttendance>;
};

export const useRecordAttendance = ({
  mutationConfig,
}: UseRecordAttendanceOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args: any) => {
      queryClient.invalidateQueries({
        queryKey: getAttendancesQueryOptions().queryKey,
      });
      onSuccess?.(args);
    },
    ...restConfig,
    mutationFn: recordAttendance,
  });
};
