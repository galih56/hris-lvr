import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { WorkLocation } from '@/types/api';

import { getWorkLocationsQueryOptions } from './get-work-locations';


export const createWorkLocationInputSchema = z.object({
  code: z.string().min(1, { message: 'Code is required.' }),
  name: z.string().min(1, { message: 'Name is required.' }),
});

export type CreateWorkLocationInput = z.infer<typeof createWorkLocationInputSchema>;

export const createWorkLocation = (data : CreateWorkLocationInput): Promise<WorkLocation> => {
  return api.post(`/work_locations`, data);
};

type UseCreateWorkLocationOptions = {
  mutationConfig?: MutationConfig<typeof createWorkLocation>;
};

export const useCreateWorkLocation = ({
  mutationConfig,
}: UseCreateWorkLocationOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args : any) => {
      queryClient.invalidateQueries({
        queryKey: getWorkLocationsQueryOptions().queryKey,
      });
      onSuccess?.(args);
    },
    ...restConfig,
    mutationFn: createWorkLocation,
  });
};
