
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { DatePicker } from '@/components/ui/date-picker/date-picker';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createEmployeeInputSchema, useCreateEmployee } from '../api/create-employee';
import { useNotifications } from '@/components/ui/notifications';
import { z } from "zod"
import { DateRangePicker } from "@/components/ui/date-picker/daterange-picker"
import { useQueries } from "@tanstack/react-query"
import { getReligions } from "../api/references/getReligions"
import { getEmploymentStatuses } from "../api/references/getEmploymentStatuses"
import { getMaritalStatuses } from "../api/references/getMaritalStatus"
import { getDirectorates } from "../api/references/getDirectorates"
import { getJobGrades } from "../api/references/getJobGrades"
import { getJobPositions } from "../api/references/getJobPositions"
import { getOrganizationUnits } from "../api/references/getOrganizationUnits"
import { useIsFetching } from '@tanstack/react-query';
import { Loader2, RefreshCcw } from "lucide-react"
import { queryClient } from "@/lib/react-query"
import DialogOrDrawer from "@/components/layout/dialog-or-drawer"
  
export function CreateEmployee() { 
  const { addNotification } = useNotifications();
  const createEmployeeMutation = useCreateEmployee({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Employee Created',
        });
      },
    },
  });
  
  const queries = useQueries({
    queries : [
    { queryKey: ['religions'], queryFn: getReligions },
    { queryKey: ['employment_statuses'], queryFn: getEmploymentStatuses },
    { queryKey: ['marital_statuses'], queryFn: getMaritalStatuses },
    { queryKey: ['directorates'], queryFn: getDirectorates },
    { queryKey: ['job_grades'], queryFn: getJobGrades },
    { queryKey: ['job_positions'], queryFn: getJobPositions },
    { queryKey: ['organization_units'], queryFn: getOrganizationUnits },
    { queryKey: ['work_locations'], queryFn: getOrganizationUnits },
  ]});
  const [
    religionsQuery,
    employmentStatusesQuery,
    maritalStatusesQuery,
    directoratesQuery,
    jobGradesQuery,
    jobPositionsQuery,
    organizationUnitsQuery,
    workLocationsQuery
  ] = queries;
  const queriesFailed = queries.some((query) => query.isError);

  const isFetching = useIsFetching();
  const form = useForm<z.infer<typeof createEmployeeInputSchema>>({
    resolver: zodResolver(createEmployeeInputSchema)
  })

  function onSubmit(values: z.infer<typeof createEmployeeInputSchema>) {
    createEmployeeMutation.mutate(values)
  }

  const refetchReferenceData = () => {
    religionsQuery.refetch()
    employmentStatusesQuery.refetch()
    maritalStatusesQuery.refetch()
    directoratesQuery.refetch()
    jobGradesQuery.refetch()
    jobPositionsQuery.refetch()
    organizationUnitsQuery.refetch()
    workLocationsQuery.refetch()
  }
  
  return (  
    <DialogOrDrawer 
      title={"Create Employee"}
      description={"Pastikan data yang anda masukan sudah benar sesuai!"}
      trigger={ <Button variant="outline">Create Employee</Button>}
      >
      <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-2">   
          <div className="space-y-2">
            <h3 className="text-md font-semibold mb-4">Basic Information</h3>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter employee name" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter email" />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <Select {...field}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
                
              <FormField
                control={form.control}
                name="bankBranch"
                render={({ field }) => (    
                <FormItem>
                    <FormLabel>Bank Branch</FormLabel>
                    <FormControl>
                        <Input {...field} placeholder="Bank Branch" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bankAccount"
                render={({ field }) => (    
                <FormItem>
                    <FormLabel>Bank Account</FormLabel>
                    <FormControl>
                        <Input {...field} placeholder="Bank Account" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="taxNumber"
                render={({ field }) => (    
                <FormItem>
                    <FormLabel>Tax Number</FormLabel>
                    <FormControl>
                        <Input {...field} placeholder="Tax Number" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (    
                <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                        <Input {...field} placeholder="Phone Number" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
              />

                    
              <FormField
                control={form.control}
                name="birthPlace"
                render={({ field }) => (    
                <FormItem>
                    <FormLabel>Birth Place</FormLabel>
                    <FormControl>
                        <Input {...field} placeholder="Birth Place" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value || null}
                        onChange={field.onChange}
                        disabledDate={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />  
          </div>
          <div className="space-y-2">
            <h3 className="text-md font-semibold mb-4">Employement Information</h3>
              <FormField
                control={form.control}
                name="employmentStatusId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Status</FormLabel>
                    <FormControl>
                      {employmentStatusesQuery.isLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Select {...field}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Employment Status" />
                          </SelectTrigger>
                          <SelectContent>
                            {employmentStatusesQuery.data?.data?.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="agreementDates"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Agreement Dates</FormLabel>
                    <FormControl>
                        <DateRangePicker
                            value={field.value}
                            onChange={(date) => field.onChange(date)}
                        />
                    </FormControl>
                    </FormItem>
                )}
                />
                <FormField
                  control={form.control}
                  name="workLocationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work Location</FormLabel>
                      <FormControl>
                        <Select {...field}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Work Location" />
                          </SelectTrigger>
                          <SelectContent>
                            {workLocationsQuery.data?.data?.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                /> 
              <FormField
                control={form.control}
                name="terminateDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value || null}
                        onChange={field.onChange}
                        disabledDate={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />  
                              
            <FormField
                control={form.control}
                name="pensionDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value || null}
                        onChange={field.onChange}
                        disabledDate={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />  
            
              <FormField
                control={form.control}
                name="religionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Religion</FormLabel>
                    <FormControl>
                      {religionsQuery.isLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Select {...field}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Religion" />
                          </SelectTrigger>
                          <SelectContent>
                            {religionsQuery.data?.data?.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jobGradeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Grade</FormLabel>
                    <FormControl>
                      <Select {...field}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Job Grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {jobGradesQuery.data?.data?.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jobPositionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Position</FormLabel>
                    <FormControl>
                      <Select {...field}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Job Position" />
                        </SelectTrigger>
                        <SelectContent>
                          {jobPositionsQuery.data?.data?.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
          </div>
        </div>

        <DialogFooter className="my-4">
          {queriesFailed && <Button size={"lg"} type="button" onClick={refetchReferenceData}> <Loader2 className="animate-spin" /></Button>}
          <Button type="submit" disabled={Boolean(isFetching)}>Save</Button>
        </DialogFooter>
      </Form>
    </DialogOrDrawer>
  )
}
