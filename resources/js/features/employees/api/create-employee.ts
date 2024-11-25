import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { Employee } from '@/types/api';

import { getEmployeesQueryOptions } from './get-employees';
export const createEmployeeInputSchema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email().min(1, 'Required'),
  gender: z.string().min(1, 'Gender is required'),
  birthPlace: z.string().min(1, 'Required'),
  birthDate: z.date({
    required_error: 'A date of birth is required.',
  }),
  agreementDates: z
    .object({
      from: z.date(),
      to: z.date(),
    })
    .refine((data) => data.from <= data.to, {
      message: 'End date must be after start date',
    })
    .transform((data) => ({
      agreementStartDate: data.from,
      agreementEndDate: data.to,
    })),
  idNumber: z.string().min(1, 'ID number is required'),
  employmentStartDate: z.date({
    required_error: 'Employment start date is required.',
  }),
  employmentEndDate: z.date().optional(),
  terminateDate: z.date().optional(),
  pensionDate: z.date().optional(),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  resignation: z.boolean().optional(),
  bankBranch: z.string().min(1, 'Bank branch is required'),
  bankAccount: z.string().min(1, 'Bank account is required'),
  maritalStatus: z.string().min(1, 'Marital status is required'),
  status: z.string().min(1, 'Status is required'),
  insuranceNumber: z.string().min(1, 'Insurance number is required'),
  taxNumber: z.string().min(1, 'Tax number is required'),
  religionId: z.string().min(1, 'Religion ID is required'),
  taxStatusId: z.string().min(1, 'Tax status ID is required'),
  terminateReasonId: z.string().min(1, 'Terminate reason ID is required'),
  workLocationId: z.string().min(1, 'Work location ID is required'),
  directorateId: z.string().min(1, 'Directorate ID is required'),
  jobGradeId: z.string().min(1, 'Job grade ID is required'),
  employmentStatusId: z.string().min(1, 'Employment status ID is required'),
  organizationUnitId: z.string().min(1, 'Organization unit ID is required'),
  jobPositionId: z.string().min(1, 'Job position ID is required'),
  outsourceVendorId: z.string().min(1, 'Outsource vendor ID is required'),
});

/*
  This data is predefined on the html
  'religion_id',
  'tax_status_id',
  'terminate_reason_id',
*/
  /*
    'terminate_date',
    'pension_date',
    'phone_number',
    'resignation',
    'bank_branch',
    'bank_account',
    'marital_status',
    'status',
    'insurance_number',
    'tax_number',
  
    'work_location_id',
    'directorate_id',
    'job_grade_id',
    'employment_status_id',
    'organization_unit_id',
    'job_position_id',
    'outsource_vendor_id',
  
  */
  
export type CreateEmployeeInput = z.infer<typeof createEmployeeInputSchema>;

export const createEmployee = ({
  data,
}: {
  data: CreateEmployeeInput;
}): Promise<Employee> => {
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
