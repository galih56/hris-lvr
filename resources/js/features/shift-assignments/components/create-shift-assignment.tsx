
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
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createShiftAssignmentInputSchema, useCreateShiftAssignment } from '../api/create-shift-assignment';
import { useNotifications } from '@/components/ui/notifications';
import { useIsFetching } from '@tanstack/react-query';
import { Employee } from "@/types/api";
import DateTimePickerInput from "@/components/ui/date-picker/date-picker-input";
import { SearchEmployeeComboBox } from "@/features/employees/components/search-employees-input";
import { useEmployee } from "@/features/employees/api/get-employee";
import { SearchShiftComboBox } from "./search-shifts-input";
import { Checkbox } from "@/components/ui/checkbox";
  
type CreateShiftAssignmentType = {
  employee?: Employee;
  onSuccess? : Function;
  onError? : Function;
}

export default function CreateShiftAssignment({
  employee,
  onSuccess,
  onError
} : CreateShiftAssignmentType) { 
  const { addNotification } = useNotifications();
  const createShiftAssignmentMutation = useCreateShiftAssignment({
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
  const form = useForm<z.infer<typeof createShiftAssignmentInputSchema>>({
    resolver: zodResolver(createShiftAssignmentInputSchema),
    defaultValues : {
      employeeId : employee?.id,
      endEnabled : false
    }
  })

  async function onSubmit(values: z.infer<typeof createShiftAssignmentInputSchema>) {
    const isValid = await form.trigger();
    if (!isValid) {
      addNotification({
        type: 'error',
        title: 'Required fields are empty',
      });;
      return;
    }
    createShiftAssignmentMutation.mutate(values)
  }
  
  const employeeId = form.watch('employeeId');
  const employeeQuery = useEmployee({ employeeId : employeeId!, queryConfig : { enabled : Boolean(employeeId) } });
  console.log(form.formState.errors)
  return (  
      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
          {
            employee ?
            <input type="hidden" name="employeeId" value={employee.id} />
            : 
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem className="my-2 flex flex-col">
                  <FormLabel>Employee</FormLabel>
                  <SearchEmployeeComboBox 
                    onChange={field.onChange}
                    value={field.value}
                  />
                  <FormDescription>
                    Find the employee
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />}
            
            <FormField
              control={form.control}
              name="shiftId"
              render={({ field }) => (
                <FormItem className="my-2 flex flex-col">
                  <FormLabel>Shift</FormLabel>
                  <SearchShiftComboBox 
                    onChange={field.onChange}
                    value={field.value}
                  />
                  <FormDescription>
                    Find the shift
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          <FormField
            control={form.control}
            name="effectiveDate"
            render={({ field , formState : { errors }  }) => (    
            <FormItem>
                <FormLabel>Effective Date</FormLabel>
                <FormControl>
                  <DateTimePickerInput
                    value={field.value || null}
                    onChange={field.onChange}
                    disabledDate={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                  />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="endEnabled"
            render={({ field }) => (
              <FormItem className=" mt-4 flex flex-row items-start space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Set End Of Assignment
                  </FormLabel>
                  <FormDescription>
                    Check this option if you want to specify an end date for the assignment.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {/* Conditionally render the end date field when the checkbox is unchecked */}
          {form.watch('endEnabled') && (
            <FormField
              control={form.control}
              name="end"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <DateTimePickerInput
                      value={field.value || null}
                      onChange={field.onChange}
                      disabledDate={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="status"
            render={({ field , formState : { errors }  }) => (
              <FormItem>
                <FormLabel>Status<span className='text-red'>*</span></FormLabel>
                <FormDescription>System will only check active shift assignments</FormDescription>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                {errors.status && <FormMessage> {errors.status.message} </FormMessage>}
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
