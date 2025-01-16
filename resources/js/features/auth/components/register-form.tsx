import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormControl, FormLabel, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { paths } from '@/apps/authentication/paths';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from '@/lib/api-client';
import { useRegister } from '@/lib/auth';
import { useSearchParams } from 'react-router-dom';
import { Link } from '@/components/ui/link';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { capitalizeFirstChar } from '@/lib/common';
import { AlertType } from '@/types/ui';
import { PasswordInput } from '@/components/ui/password-input';

const checkEmployeeCode = async (code: string) => {
  const response = await api.get(`/check_employee_code/${code}`, { skipNotification: true });
  return response.data; // Now expects a single employee object if found
};

const registerInputSchema = z.object({
  employeeCode: z.string().min(1, "Employee code is required"),
  email: z.string().email(),
  password: z.string().min(6),
  passwordConfirmation: z.string().min(6),
  name: z.string(),
});

type RegisterFormProps = {
  onSuccess?: () => void;
  onError?: () => void;
};

export const RegisterForm = ({ onSuccess, onError }: RegisterFormProps) => {
  const registering = useRegister({ onSuccess, onError });
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');
  const [alert, setAlert] = useState<AlertType | null>({
    title: "",
    message: "",
    variant: "default",
  });

  const form = useForm<z.infer<typeof registerInputSchema>>({
    resolver: zodResolver(registerInputSchema),
    defaultValues: {
      employeeCode: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      name: "",
    },
  });

  const { watch, setValue, formState: { errors } } = form;
  const employeeCode = watch("employeeCode");

  useEffect(() => {
    const fetchEmployeeDetails = async (code: string) => {
      if (!code) {
        setAlert(null);
        return;
      }
      try {
        const data = await checkEmployeeCode(code);
        if (data) { // Single employee object returned
          setValue("name", data.name || "");
          setValue("email", data.email || "");
          setAlert(null);
        } else {
          setAlert({
            title : 'error',
            message : "No employee found with this code.",
            variant : 'destructive'
          });
          setValue("name", "");
          setValue("email", "");
        }
      } catch (error) {
        let message = "Error fetching employee details."
        console.warn(message, error.response);
        if(error?.response){
          if(error?.response?.data?.message){
            message = error?.response.data?.message;
          }
        }

        setAlert({
          title : 'error',
          message :  message,
          variant : 'destructive'
        });
      }
    };

    fetchEmployeeDetails(employeeCode);
  }, [employeeCode, setValue]);

  const onSubmit = async (values: z.infer<typeof registerInputSchema>) => {
    try {
      await registering.mutateAsync(values);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      if (error.response?.data?.message) {
        form.setError("root", {
          type: "manual",
          message: error.response.data.message,
        });
      } else {
        form.setError("root", {
          type: "manual",
          message: "Something went wrong. Please try again later.",
        });
      }
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {errors.root && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {errors.root.message}
              </AlertDescription>
            </Alert>
          )}
          
          {alert && (
            <Alert variant={alert.variant}>
              <AlertTitle>{capitalizeFirstChar(alert.title)}</AlertTitle>
              <AlertDescription>
                {alert.message}
                {alert.message == 'The employee has been registered' ? <Link to={'/auth/login'}>Go to login page</Link> : null}
              </AlertDescription>
            </Alert>
          )}
          <FormField
            control={form.control}
            name="employeeCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className='leading-7'>Employee Code</FormLabel>
                <FormControl>
                  <Input placeholder="Employee Code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className='leading-7'>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className='leading-7'>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
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
              <FormItem>
                <FormLabel className='leading-7'>Confirm Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="Password Confirmation" {...field}  type='password' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className='w-full' isLoading={registering.isLoading}>Sign Up</Button>
        </form>
      </Form>
      <div className="mt-2 flex items-center justify-end">
        <div className="text-sm">
          <Link
            to={paths.auth.login.getHref(redirectTo)}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign In
          </Link>
        </div>
      </div>
    </>
  );
};
