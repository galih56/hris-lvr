import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { getWorkLocationsQueryOptions } from './get-work-locations';

export type DeleteWorkLocationDTO = {
  workLocationId: string;
};

export const deleteWorkLocation = ({
  workLocationId,
}: DeleteWorkLocationDTO) => {
  return api.delete(`/work_locations/${workLocationId}`);
};

type UseDeleteEmpoyeeOptions = {
  mutationConfig?: MutationConfig<typeof deleteWorkLocation>;
};

export const useDeleteEmpoyee = ({
  mutationConfig,
}: UseDeleteEmpoyeeOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args : any) => {
      queryClient.invalidateQueries({
        queryKey: getWorkLocationsQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteWorkLocation,
  });
};
