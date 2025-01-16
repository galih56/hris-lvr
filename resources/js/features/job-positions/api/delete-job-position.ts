import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { getJobPositionsQueryOptions } from './get-job-positions';

export type DeleteJobPositionDTO = {
  jobPositionId: string;
};

export const deleteJobPosition = ({
  jobPositionId,
}: DeleteJobPositionDTO) => {
  return api.delete(`/job_positions/${jobPositionId}`);
};

type UseDeleteEmpoyeeOptions = {
  mutationConfig?: MutationConfig<typeof deleteJobPosition>;
};

export const useDeleteEmpoyee = ({
  mutationConfig,
}: UseDeleteEmpoyeeOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args : any) => {
      queryClient.invalidateQueries({
        queryKey: getJobPositionsQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteJobPosition,
  });
};
