import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormControl, FormLabel, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { paths } from '@/apps/authentication/paths';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from '@/lib/api-client';
import { useRegister } from '@/lib/auth';
import { useSearchParams } from 'react-router-dom';
import { Link } from '@/components/ui/link';

const checkEmployeeCode = async (code: string) => {
  try {
    const response = await api.post('/api/check-employee-code', { code });
    return response.data; // Assuming the response structure contains 'exists' field
  } catch (error) {
    throw new Error('Error checking employee code');
  }
};

const registerInputSchema = z.object({
  employeeCode: z.string().min(1, "Employee code is required")
    .refine(async (code) => {
      const response = await checkEmployeeCode(code);
      return !response.exists;
    }, {
      message: "Employee code already exists",
    }),
  email: z.string().email(),
  password: z.string().min(6),
  passwordConfirm: z.string().min(6),
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

  const form = useForm<z.infer<typeof registerInputSchema>>({
    resolver: zodResolver(registerInputSchema),
    defaultValues: {
      employeeCode: "",
      email: "",
      password: "",
      passwordConfirm: "",
      name: "",
    },
  });


  const onSubmit = (values: z.infer<typeof registerInputSchema>) => {
    registering.mutate(values)
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className='leading-7'>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} readOnly value={form.getValues('name')}/>
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
                  <Input placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="passwordConfirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel className='leading-7'>Konfirmasi Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password Confirmation" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit"  className='w-full' isLoading={registering.isLoading}>Sign Up</Button>
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
    </div>
  );
};
