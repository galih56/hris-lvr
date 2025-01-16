import { useMutation, useQueryClient } from  '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { JobPosition } from '@/types/api';

import { getJobPositionQueryOptions } from './get-job-position';

export const updateJobPositionInputSchema = z.object({
  code: z.string().min(1, { message: 'Code is required.' }),
  name: z.string().min(1, { message: 'Name is required.' }),
});

export type UpdateJobPositionInput = z.infer<typeof updateJobPositionInputSchema>;

export const updateJobPosition = ({
  data,
  jobPositionId,
}: {
  data: UpdateJobPositionInput;
  jobPositionId: string;
}): Promise<JobPosition> => {
  return api.patch(`/job_positions/${jobPositionId}`, data);
};

type UseUpdateJobPositionOptions = {
  mutationConfig?: MutationConfig<typeof updateJobPosition>;
};

export const useUpdateJobPosition = ({
  mutationConfig,
}: UseUpdateJobPositionOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data : any, ...args ) => {
      queryClient.refetchQueries({
        queryKey: getJobPositionQueryOptions(data.id).queryKey,
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateJobPosition,
  });
};
