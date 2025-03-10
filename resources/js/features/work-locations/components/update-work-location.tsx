import { Loader2, Pen } from 'lucide-react';

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
 
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Button } from '@/components/ui/button';
import { useNotifications } from '@/components/ui/notifications';
import { Authorization, ROLES } from '@/lib/authorization';

import { useWorkLocation } from '../api/get-work-location';
import {
  updateWorkLocationInputSchema,
  useUpdateWorkLocation,
} from '../api/update-work-location';
import { useIsFetching, useQueries } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { DialogFooter } from '@/components/ui/dialog';
import { RefetchButton } from '@/components/ui/refetch-button';

type UpdateWorkLocationProps = {
  workLocationId: string | undefined;
};

export const UpdateWorkLocation = ({ workLocationId }: UpdateWorkLocationProps) => {
  const { addNotification } = useNotifications();

  if(!workLocationId){
    return null
  }

  const workLocationQuery = useWorkLocation({ workLocationId });
  const updateWorkLocationMutation = useUpdateWorkLocation({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'WorkLocation Updated',
        });
      },
    },
  });
  const workLocation = workLocationQuery.data?.data;

  if(!workLocation || workLocationQuery.isPending){
    return null
  }

  const isFetching = useIsFetching();
  const form = useForm<z.infer<typeof updateWorkLocationInputSchema>>({
    resolver: zodResolver(updateWorkLocationInputSchema),
    defaultValues : {
      code : workLocation?.code,
      name : workLocation?.name,
    }
  })

  async function onSubmit(values: z.infer<typeof updateWorkLocationInputSchema>) {
    const isValid = await form.trigger();
    if (!isValid) {
      addNotification({
        type: 'error',
        title: 'Required fields are empty',
      });;
      return;
    }
    updateWorkLocationMutation.mutate({ data : values, workLocationId : workLocation?.id!})
  }

  return (
    <Authorization allowedRoles={[ROLES.ADMIN]}>
      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)}>

        <FormField
            control={form.control}
            name="code"
            render={({ field , formState : { errors }  }) => (    
            <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                    <Input {...field} placeholder="Code" readOnly={true}/>
                </FormControl>
                {errors.code && <FormMessage> {errors.code.message} </FormMessage>}
            </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field , formState : { errors }  }) => (    
            <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                    <Input {...field} placeholder="Name" />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
          />
          <DialogFooter className="my-4">
            <Button type="submit" disabled={Boolean(isFetching) }>Submit</Button>
          </DialogFooter>
        </form>
      </Form>
    </Authorization>
  );
};
