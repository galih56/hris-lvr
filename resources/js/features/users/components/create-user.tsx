
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
import { createUserInputSchema, useCreateUser } from '../api/create-user';
import { useNotifications } from '@/components/ui/notifications';
import { useIsFetching, useQueries } from '@tanstack/react-query';
import { Loader2, RefreshCcw } from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";
import { SearchEmployeeComboBox } from "@/features/employees/components/search-employees-input";
import { getUserRoles } from "../api/get-user-roles";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEmployee } from "@/features/employees/api/get-employee";
import { useEffect } from "react";
import {  useCheckEmployeeUserAccount } from "../api/check-employee-user-account";
  
type CreateUserType = {
  onSuccess? : Function;
  onError? : Function;
}

export default function CreateUser({
  onSuccess,
  onError
} : CreateUserType) { 
  const { addNotification } = useNotifications();
  const createUserMutation = useCreateUser({
    mutationConfig: {
      onSuccess: () => {
        onSuccess?.();
      },
      onError: () => {
        onError?.();
      },
    },
  });
  
  
  const queries = useQueries({
    queries : [
      { queryKey: ['user-roles'], queryFn: getUserRoles },
    ]
  })
  const [
    userRolesQuery,
  ] = queries;

  const isFetching = useIsFetching();
  const form = useForm<z.infer<typeof createUserInputSchema>>({
    resolver: zodResolver(createUserInputSchema)
  })
  
  const employeeId = form.watch('employeeId');
  const employeeQuery = useEmployee({ employeeId : employeeId!, queryConfig : { enabled : Boolean(employeeId) } });
  const { data } = useCheckEmployeeUserAccount({ employeeId : employeeId!});

  useEffect(() => {
    if (employeeQuery.data) {
      if(employeeQuery?.data?.data){
        const employee = employeeQuery.data.data;
        form.setValue('name', employee.name);
        form.setValue('username', employee.code);
      }
    }
  }, [employeeQuery.data, form]);

  async function onSubmit(values: z.infer<typeof createUserInputSchema>) {
    const isValid = await form.trigger();
    if (!isValid) {
      addNotification({
        type: 'error',
        title: 'Required fields are empty',
      });;
      return;
    }
    createUserMutation.mutate(values)
  }
  
  return (  
      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="roleCode"
            render={({ field , formState : { errors }  }) => (
              <FormItem className="my-2">
                <FormLabel>Role</FormLabel>
                <FormControl>
                  {userRolesQuery.isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Select {...field} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        {userRolesQuery.data?.data?.map((item) => {
                          return (
                          <SelectItem key={item.code} value={item.code}>
                            {item.name}
                          </SelectItem>
                        )}
                      )}
                      </SelectContent>
                    </Select>
                  )}
                </FormControl>
                {errors.roleCode && <FormMessage> {errors.roleCode.message} </FormMessage>}
              </FormItem>
            )}
          />
           {['EMP','HR'].includes(form.getValues('roleCode') ?? '') && 
            <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem className="my-3">
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
              name="name"
              render={({ field , formState : { errors }  }) => (    
              <FormItem className='my-3'>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                      <Input {...field} placeholder="Name" readOnly={true}/>
                  </FormControl>
                  {errors.name && <FormMessage> {errors.name.message} </FormMessage>}
              </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field , formState : { errors }  }) => (    
              <FormItem className='my-3'>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                      <Input {...field} placeholder="Username" readOnly={true}/>
                  </FormControl>
                  {errors.username && <FormMessage> {errors.username.message} </FormMessage>}
              </FormItem>
              )}
            />
          
            <FormField
              control={form.control}
              name="email"
              render={({ field , formState : { errors }  }) => (    
              <FormItem className='my-3'>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                      <Input {...field} placeholder="Name" type="email"/>
                  </FormControl>
                  <FormMessage />
              </FormItem>
              )}
            />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className='my-3'>
                <FormLabel className='leading-7'>Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="Password" {...field} type='password' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="passwordConfirmation"
            render={({ field }) => (
              <FormItem className='my-3'>
                <FormLabel className='leading-7'>Confirm Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="Password Confirmation" {...field}  type='password' />
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
