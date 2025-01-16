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
import { DatePicker } from '@/components/ui/date-picker/date-picker';

import { useJobPosition } from '../api/get-job-position';
import {
  updateJobPositionInputSchema,
  useUpdateJobPosition,
} from '../api/update-job-position';
import { useIsFetching, useQueries } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { DialogFooter } from '@/components/ui/dialog';
import { RefetchButton } from '@/components/ui/refetch-button';
import { useEffect } from 'react';

type UpdateJobPositionProps = {
  jobPositionId: string | undefined;
};

export const UpdateJobPosition = ({ jobPositionId }: UpdateJobPositionProps) => {
  const { addNotification } = useNotifications();

  if(!jobPositionId){
    return null
  }

  const jobPositionQuery = useJobPosition({ jobPositionId });
  const updateJobPositionMutation = useUpdateJobPosition({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'JobPosition Updated',
        });
      },
    },
  });
  const jobPosition = jobPositionQuery.data?.data;

  if(!jobPosition || jobPositionQuery.isPending){
    return null
  }

  const isFetching = useIsFetching();
  const form = useForm<z.infer<typeof updateJobPositionInputSchema>>({
    resolver: zodResolver(updateJobPositionInputSchema),
    defaultValues : {
      code : jobPosition?.code,
      name : jobPosition?.name,
    }
  })

  async function onSubmit(values: z.infer<typeof updateJobPositionInputSchema>) {
    const isValid = await form.trigger();
    if (!isValid) {
      addNotification({
        type: 'error',
        title: 'Required fields are empty',
      });;
      return;
    }
    updateJobPositionMutation.mutate({ data : values, jobPositionId : jobPosition?.id!})
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
