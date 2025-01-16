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

import { useShift } from '../api/get-shift';
import {
  updateShiftInputSchema,
  useUpdateShift,
} from '../api/update-shift';
import { useIsFetching, useQueries } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { z } from "zod";
import { hasErrorsInTab } from '@/lib/utils';
import { DialogFooter } from '@/components/ui/dialog';
import { RefetchButton } from '@/components/ui/refetch-button';
import { useEffect } from 'react';
import { DateRangePicker } from '@/components/ui/date-picker/daterange-picker-input';
import DatePickerInput from '@/components/ui/date-picker/date-picker-input';

type UpdateShiftProps = {
  shiftId: string | undefined;
};

export const UpdateShift = ({ shiftId }: UpdateShiftProps) => {
  const { addNotification } = useNotifications();

  if(!shiftId){
    return null
  }

  const shiftQuery = useShift({ shiftId });
  const updateShiftMutation = useUpdateShift({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Shift Updated',
        });
      },
    },
  });
  const shift = shiftQuery.data?.data;

  if(!shift || shiftQuery.isPending){
    return null
  }

  const isFetching = useIsFetching();
  const form = useForm<z.infer<typeof updateShiftInputSchema>>({
    resolver: zodResolver(updateShiftInputSchema),
    defaultValues : {
      code : shift?.code,
      name : shift?.name,
    }
  })

  async function onSubmit(values: z.infer<typeof updateShiftInputSchema>) {
    const isValid = await form.trigger();
    if (!isValid) {
      addNotification({
        type: 'error',
        title: 'Required fields are empty',
      });;
      return;
    }
    updateShiftMutation.mutate({ data : values, shiftId : shift?.id!})
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
