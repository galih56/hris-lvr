import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { Employee } from '@/types/api';
import { subYears } from 'date-fns';

import { getEmployeesQueryOptions } from './get-employees';


export const createEmployeeInputSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }).min(1, { message: 'Email is required.' }),
  idNumber: z.string().min(1, { message: 'Identification number is required.' }),
  maritalStatus :  z.enum(['married', 'single', 'widow', 'widower', 'unverified']).refine((val) => val, { message: 'Invalid marital status. Accepted values: married, single, widow, widower, unverified.' }),
  gender: z.string().min(1, { message: 'Gender is required.' }),
  bankBranch: z.string().min(1, { message: 'Bank branch is required.' }),
  bankAccount: z.string().min(1, { message: 'Bank account is required.' }),
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
  phoneNumber: z.string().optional(),
  religionId: z.string().min(1, { message: 'Please select a religion.' }),
  taxStatusId: z.string().min(1, { message: 'Please select a tax status.' }),
  taxNumber :  z.string().optional(),

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
  employmentEndDate: z.date().nullable().optional(),
  pensionDate: z.date().nullable().optional(),
  resignation: z.boolean().optional(),
  insuranceNumber: z.string().optional(),
  workLocationId: z.string().min(1, { message: 'Please select a work location.' }),
  departmentId: z.string().min(1, { message: 'Please select a department.' }),
  jobGradeId: z.string().min(1, { message: 'Please select a job grade.' }),
  employmentStatusId: z.string().min(1, { message: 'Please select an employment status.' }),
  jobPositionId: z.string().min(1, { message: 'Please select a job position.' }),
  outsourceVendorId: z.string().nullable().optional(),
});

/*
Preparation, if there are extra requirements for employment dates
.refine((data) => {
  // Check for "intern" - max 6 months
  if (data.employmentType === 'intern' && data.employmentEndDate) {
    return data.employmentEndDate <= addMonths(data.employmentStartDate, 6);
  }

  // Check for "contract" - max 1 year
  if (data.employmentType === 'contract' && data.employmentEndDate) {
    return data.employmentEndDate <= addYears(data.employmentStartDate, 1);
  }

  // No validation for permanent (or other types without an end date)
  return true;
}, {
  message: 'Invalid employment dates for the selected employment type.',
});
*/

export type CreateEmployeeInput = z.infer<typeof createEmployeeInputSchema>;

export const createEmployee = (data : CreateEmployeeInput): Promise<Employee> => {
  return api.post(`/employees`, data);
};

type UseCreateEmployeeOptions = {
  mutationConfig?: MutationConfig<typeof createEmployee>;
};

export const useCreateEmployee = ({
  mutationConfig,
}: UseCreateEmployeeOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args : any) => {
      queryClient.invalidateQueries({
        queryKey: getEmployeesQueryOptions().queryKey,
      });
      onSuccess?.(args);
    },
    ...restConfig,
    mutationFn: createEmployee,
  });
};
