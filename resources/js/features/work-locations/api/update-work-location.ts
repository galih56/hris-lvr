import { useMutation, useQueryClient } from  '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { WorkLocation } from '@/types/api';

import { getWorkLocationQueryOptions } from './get-work-location';

export const updateWorkLocationInputSchema = z.object({
  code: z.string().min(1, { message: 'Code is required.' }),
  name: z.string().min(1, { message: 'Name is required.' }),
});

export type UpdateWorkLocationInput = z.infer<typeof updateWorkLocationInputSchema>;

export const updateWorkLocation = ({
  data,
  workLocationId,
}: {
  data: UpdateWorkLocationInput;
  workLocationId: string;
}): Promise<WorkLocation> => {
  return api.patch(`/work_locations/${workLocationId}`, data);
};

type UseUpdateWorkLocationOptions = {
  mutationConfig?: MutationConfig<typeof updateWorkLocation>;
};

export const useUpdateWorkLocation = ({
  mutationConfig,
}: UseUpdateWorkLocationOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data : any, ...args ) => {
      queryClient.refetchQueries({
        queryKey: getWorkLocationQueryOptions(data.id).queryKey,
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateWorkLocation,
  });
};
