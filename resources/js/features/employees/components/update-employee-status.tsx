 
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Button } from '@/components/ui/button';
import { useNotifications } from '@/components/ui/notifications';
import {
    updateEmployeeStatusSchema,
    useUpdateEmployeeStatus,
} from '../api/update-employee-status';
import { useIsFetching, useQueries } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { DialogFooter } from '@/components/ui/dialog';
import { Employee } from "@/types/api";
import DialogOrDrawer from "@/components/layout/dialog-or-drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useTerminateReasons } from "../api/references/getTerminateReasons";
import { Textarea } from "@/components/ui/textarea";
import { useDisclosure } from "@/hooks/use-disclosure";
import { useEffect, useState } from "react";

type UpdateEmployeeProps = {
  employee? : Employee;
};

export const UpdateEmployeeStatus = ({ employee }: UpdateEmployeeProps) => {
  const { addNotification } = useNotifications();
  const { close, isOpen, open, toggle} = useDisclosure()

  const [nextStatus, setNextStatus] = useState<'active' | 'inactive'>("inactive");
  const [isActive, setIsActive] = useState(false);
  const [title, setTitle] = useState("Terminate Employee");
  const [description, setDescription] = useState(
    "Are you sure you want to terminate this employee? This action cannot be undone and will set the employee as terminated unless you are an admin."
  );

  useEffect(() => {
    if (employee?.status) {
      const active = employee.status === "active";
      setIsActive(active);
      setNextStatus(active ? "inactive" : "active");
      setTitle(active ? "Terminate Employee" : "Restore Employee Status");
      setDescription(
        active
          ? "Are you sure you want to terminate this employee? This action cannot be undone and will set the employee as terminated unless you are an admin."
          : "Are you sure you want to reactivate this employee? This will reactivate the employee's status."
      );
    }
  }, [employee?.status]);

  if(!employee){
    return null
  }
  const terminateReasonQuery = useTerminateReasons();

  const updateEmployeeStatusMutation = useUpdateEmployeeStatus({
    mutationConfig: {
      onSuccess: () => {
        close();
      },
      onError: () => {
        close()
      }
    },
  });

  if(!employee){
    return null
  }

  const isFetching = useIsFetching();
  const form = useForm<z.infer<typeof updateEmployeeStatusSchema>>({
    resolver: zodResolver(updateEmployeeStatusSchema),
    defaultValues : {
      terminateReasonId : employee?.terminateReason?.id,
      resignation : employee?.resignation,
      status : nextStatus,
    }
  })

  async function onSubmit(values: z.infer<typeof updateEmployeeStatusSchema>) {
    const isValid = await form.trigger();
    if (!isValid && !!employee?.id) {
      addNotification({
        type: 'error',
        title: 'Required fields are empty',
      });;
      return;
    }

    updateEmployeeStatusMutation.mutate({
      employeeId : employee?.id!,
      ...values
    })
  }

  return (
    <DialogOrDrawer 
      open={isOpen}
      title={title}
      description={description}
      trigger={<Button variant={isActive ? 'destructive' : 'info'}  onClick={open}>{ isActive ? 'Terminate' : 'Reactivate' } </Button>}
      onOpenChange={(dialogOpen) => (dialogOpen ? open() : close())}
      >
        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <input type="hidden" {...form.register('status')} />
                {
                    isActive ? 
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name="terminateReasonId"
                                render={({ field , formState : { errors }  }) => (
                                <FormItem>
                                    <FormLabel>Terminate Reason</FormLabel>
                                    <FormControl>
                                    {terminateReasonQuery.isLoading ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        <Select {...field} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Terminate Reason" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {terminateReasonQuery.data?.data?.map((item) => {
                                            const id = item.id.toString();
                                            return (
                                              <SelectItem key={id} value={id}>
                                                  {item.name}
                                              </SelectItem>
                                            )}
                                        )}
                                        </SelectContent>
                                        </Select>
                                    )}
                                    </FormControl>
                                    {errors.terminateReasonId && <FormMessage> {errors.terminateReasonId.message} </FormMessage>}
                                </FormItem>
                                )}
                            /> 
                            <FormField
                                control={form.control}
                                name="resignation"
                                render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Resignation Description</FormLabel>
                                      <FormControl>
                                          <Textarea
                                              placeholder="Description"
                                              className="resize-none"
                                              {...field}
                                          />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>: null
                }
                <DialogFooter className="my-4">
                    <Button type="submit" variant={isActive ? 'destructive' : 'info'} disabled={Boolean(isFetching) }> { isActive ? 'Terminate' : 'Reactivate' } </Button>
                </DialogFooter>
            </form>
        </Form>
    </DialogOrDrawer>
  );
};
