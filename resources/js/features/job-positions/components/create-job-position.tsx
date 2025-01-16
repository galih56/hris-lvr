
import { Button } from "@/components/ui/button"
import {
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { z } from "zod";
 
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createJobPositionInputSchema, useCreateJobPosition } from '../api/create-job-position';
import { useNotifications } from '@/components/ui/notifications';
import { useIsFetching } from '@tanstack/react-query';
import { Loader2, RefreshCcw } from "lucide-react";
import { RefetchButton } from "@/components/ui/refetch-button"
  
type CreateJobPositionType = {
  onSuccess? : Function;
  onError? : Function;
}

export default function CreateJobPosition({
  onSuccess,
  onError
} : CreateJobPositionType) { 
  const { addNotification } = useNotifications();
  const createJobPositionMutation = useCreateJobPosition({
    mutationConfig: {
      onSuccess: () => {
        onSuccess?.();
      },
      onError: () => {
        onError?.();
      },
    },
  });
  
  

  const isFetching = useIsFetching();
  const form = useForm<z.infer<typeof createJobPositionInputSchema>>({
    resolver: zodResolver(createJobPositionInputSchema)
  })

  async function onSubmit(values: z.infer<typeof createJobPositionInputSchema>) {
    const isValid = await form.trigger();
    if (!isValid) {
      addNotification({
        type: 'error',
        title: 'Required fields are empty',
      });;
      return;
    }
    createJobPositionMutation.mutate(values)
  }
  
  return (  
      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="code"
            render={({ field , formState : { errors }  }) => (    
            <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                    <Input {...field} placeholder="Code" />
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
                <FormLabel>Tax Number</FormLabel>
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
  )
}
