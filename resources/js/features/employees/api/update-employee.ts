import { useMutation, useQueryClient } from  '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { Employee } from '@/types/api';

import { getEmployeeQueryOptions } from './get-employee';
import { subYears } from 'date-fns';

export const updateEmployeeInputSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }).min(1, { message: 'Email is required.' }),
  gender: z.string().min(1, { message: 'Gender is required.' }),
  birthPlace: z.string().min(1, { message: 'Place of birth is required.' }),
  birthDate: z.date({
    required_error: 'Please provide a date of birth.',
  }).refine(
    (date) => date <= subYears(new Date(), 17),
    {
      message: 'You must be at least 17 years old.',
    }
  ), 
  address: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  joinDate: z.date({
    required_error: 'Please provide join date.',
  }),
  employmentDates: z
    .object({
      from: z.date(),
      to: z.date(),
    })
    .refine((data) => data.from?.getTime() <= data.to?.getTime(), {
      message: 'The end date must be after the start date.',
    })
    .transform((data) => ({
      employmentStartDate: data.from,
      employmentEndDate: data.to,
    })),
  idNumber: z.string().min(1, { message: 'Identification number is required.' }),
  insuranceNumber: z.string().nullable().optional(),
  terminateDate: z.date().nullable().optional(),
  pensionDate: z.date().nullable().optional(),
  phoneNumber: z.string().min(1, { message: 'Phone number is required.' }),
  resignation: z.string().nullable().optional(),
  bankBranch: z.string().min(1, { message: 'Bank branch name is required.' }),
  bankAccount: z.string().min(1, { message: 'Bank account number is required.' }),
  maritalStatus: z.string().min(1, { message: 'Please select a marital status.' }),
  taxNumber: z.string().min(1, { message: 'Tax identification number is required.' }),
  religionId: z.string().min(1, { message: 'Please select a religion.' }),
  taxStatusId: z.string().min(1, { message: 'Please select a tax status.' }),
  terminateReasonId: z.string().nullable().optional(),
  workLocationId: z.string().min(1, { message: 'Please select a work location.' }),
  departmentId: z.string().min(1, { message: 'Please select a department.' }),
  jobGradeId: z.string().min(1, { message: 'Please select a job grade.' }),
  employmentStatusId: z.string().min(1, { message: 'Please select an employment status.' }),
  jobPositionId: z.string().min(1, { message: 'Please select a job position.' }),
  outsourceVendorId: z.string().nullable().optional(),
});

export type UpdateEmployeeInput = z.infer<typeof updateEmployeeInputSchema>;

export const updateEmployee = ({
  data,
  employeeId,
}: {
  data: UpdateEmployeeInput;
  employeeId: string;
}): Promise<Employee> => {
  return api.patch(`/employees/${employeeId}`, data);
};

type UseUpdateEmployeeOptions = {
  mutationConfig?: MutationConfig<typeof updateEmployee>;
};

export const useUpdateEmployee = ({
  mutationConfig,
}: UseUpdateEmployeeOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data : any, ...args ) => {
      queryClient.refetchQueries({
        queryKey: getEmployeeQueryOptions(data.id).queryKey,
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateEmployee,
  });
};
