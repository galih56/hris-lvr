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

import { useAttendance } from '../api/get-attendance';
import {
  updateAttendanceInputSchema,
  useUpdateAttendance,
} from '../api/update-attendance';
import { useIsFetching, useQueries } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { DialogFooter } from '@/components/ui/dialog';
import DateTimePickerInput from '@/components/ui/date-picker/date-picker-input';
import { Textarea } from '@/components/ui/textarea';

type UpdateAttendanceProps = {
  attendanceId: string;
};

export const UpdateAttendance = ({ attendanceId }: UpdateAttendanceProps) => {
  const { addNotification } = useNotifications();

  const attendanceQuery = useAttendance({ attendanceId });
  const updateAttendanceMutation = useUpdateAttendance({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Attendance Updated',
        });
      },
    },
  });
  const attendance = attendanceQuery.data?.data;

  if(!attendance || attendanceQuery.isPending){
    return null
  }

  const isFetching = useIsFetching();
  const form = useForm<z.infer<typeof updateAttendanceInputSchema>>({
    resolver: zodResolver(updateAttendanceInputSchema),
    defaultValues : {
      checkIn : attendance?.checkIn,
      checkOut : attendance?.checkOut,
      notes : attendance?.notes,
      status : attendance?.status,
    }
  })

  async function onSubmit(values: z.infer<typeof updateAttendanceInputSchema>) {
    const isValid = await form.trigger();
    if (!isValid) {
      addNotification({
        type: 'error',
        title: 'Required fields are empty',
      });;
      return;
    }
    updateAttendanceMutation.mutate({ data : values, attendanceId : attendance?.id!})
  }

  return (
    <Authorization allowedRoles={[ROLES.ADMIN, ROLES.HR]}>
      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name="status"
              render={({ field , formState : { errors }  }) => (
              <FormItem>
                  <FormDescription>  
                    Ensure the user has submitted an attendance correction or correction request before setting their status to <b className='text-lg text-red'>ABSENT</b> or <b className='text-lg text-red'>LEAVE</b>.
                  </FormDescription>
                  <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                      <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="present">Present</SelectItem>
                          <SelectItem value="absent">Absent</SelectItem>
                          <SelectItem value="leave">Leave</SelectItem>
                      </SelectContent>
                  </Select>
                  </FormControl>
                  {errors.status && <FormMessage> {errors.status.message} </FormMessage>}
              </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What's the reason you update this attendance record?"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {form.getValues('status') == "present" && (
              <>
                <FormField
                  control={form.control}
                  name="checkIn"
                  render={({ field , formState : { errors }  }) => (
                    <FormItem>
                        <FormLabel>Check In</FormLabel>
                        <FormControl>
                          <DateTimePickerInput  {...field} withTime={true}/>
                        </FormControl>
                        {errors.checkIn && <FormMessage> {errors.checkIn.message} </FormMessage>}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="checkOut"
                  render={({ field , formState : { errors }  }) => (
                    <FormItem>
                        <FormLabel>Check Out</FormLabel>
                        <FormControl>
                          <DateTimePickerInput  {...field} withTime={true} />
                        </FormControl>
                        {errors.checkIn && <FormMessage> {errors.checkIn.message} </FormMessage>}
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <DialogFooter className="my-4">
            <Button type="submit" disabled={Boolean(isFetching) }>Submit</Button>
          </DialogFooter>
        </form>
      </Form>
    </Authorization>
  );
};
