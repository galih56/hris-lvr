import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { JobPosition } from '@/types/api';

import { getJobPositionsQueryOptions } from './get-job-positions';


export const createJobPositionInputSchema = z.object({
  code: z.string().min(1, { message: 'Code is required.' }),
  name: z.string().min(1, { message: 'Name is required.' }),
});

export type CreateJobPositionInput = z.infer<typeof createJobPositionInputSchema>;

export const createJobPosition = (data : CreateJobPositionInput): Promise<JobPosition> => {
  return api.post(`/job_positions`, data);
};

type UseCreateJobPositionOptions = {
  mutationConfig?: MutationConfig<typeof createJobPosition>;
};

export const useCreateJobPosition = ({
  mutationConfig,
}: UseCreateJobPositionOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args : any) => {
      queryClient.invalidateQueries({
        queryKey: getJobPositionsQueryOptions().queryKey,
      });
      onSuccess?.(args);
    },
    ...restConfig,
    mutationFn: createJobPosition,
  });
};
