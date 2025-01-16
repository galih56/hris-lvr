
import { Button } from "@/components/ui/button"
import {
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePicker } from '@/components/ui/date-picker/date-picker';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createEmployeeInputSchema, useCreateEmployee } from '../api/create-employee';
import { useNotifications } from '@/components/ui/notifications';
import { DateRangePicker } from "@/components/ui/date-picker/daterange-picker-input"
import { useQueries } from "@tanstack/react-query"
import { getReligions } from "../api/references/getReligions"
import { getEmploymentStatuses } from "../api/references/getEmploymentStatuses"
import { getDepartments } from "../api/references/getDepartments"
import { getJobGrades } from "../api/references/getJobGrades"
import { getOrganizationUnits } from "../api/references/getOrganizationUnits"
import { useIsFetching } from '@tanstack/react-query';
import { Loader2, RefreshCcw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { hasErrorsInTab } from "@/lib/utils"
import { getOutsourceVendors } from "../api/references/getOutsourceVendors"
import { RefetchButton } from "@/components/ui/refetch-button"
import { getWorkLocations } from "../api/references/getWorkLocations"
import { Authorization, ROLES } from "@/lib/authorization";
import DatePickerInput from "@/components/ui/date-picker/date-picker-input";
import { getTaxStatuses } from "../api/references/getTaxStatuses";
import { useJobPositions } from "@/features/job-positions/api/get-job-positions";
  
type CreateEmployeeType = {
  onSuccess? : Function;
  onError? : Function;
}

export default function CreateEmployee({
  onSuccess,
  onError
} : CreateEmployeeType) { 
  const { addNotification } = useNotifications();
  const createEmployeeMutation = useCreateEmployee({
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
    { queryKey: ['religions'], queryFn: getReligions },
    { queryKey: ['tax_statuses'], queryFn: getTaxStatuses },
    { queryKey: ['employment_statuses'], queryFn: getEmploymentStatuses },
    { queryKey: ['departments'], queryFn: getDepartments },
    { queryKey: ['job_grades'], queryFn: getJobGrades },
    { queryKey: ['organization_units'], queryFn: getOrganizationUnits },
    { queryKey: ['work_locations'], queryFn: getWorkLocations },
    { queryKey: ['outsource_vendors'], queryFn: getOutsourceVendors },
  ]});
  
  const [
    religionsQuery,
    taxStatusesQuery,
    employmentStatusesQuery,
    departmentsQuery,
    jobGradesQuery,
    organizationUnitsQuery,
    workLocationsQuery,
    outsourceVendorQuery,
  ] = queries;
  const queriesFailed = queries.some((query) => query.isError);

  const isFetching = useIsFetching();
  const form = useForm<z.infer<typeof createEmployeeInputSchema>>({
    resolver: zodResolver(createEmployeeInputSchema)
  })

  const departmentId = useWatch({
    control: form.control,
    name: 'departmentId',
  });

  const jobPositionsQuery = useJobPositions({
    filters : {
      departmentId
    },
    queryConfig : {
      enabled: !!departmentId
    }
  });

  async function onSubmit(values: z.infer<typeof createEmployeeInputSchema>) {
    const isValid = await form.trigger();
    if (!isValid) {
      addNotification({
        type: 'error',
        title: 'Required fields are empty',
      });;
      return;
    }
    createEmployeeMutation.mutate(values)
  }

  const refetchReferenceData = () => {
    religionsQuery.refetch()
    taxStatusesQuery.refetch()
    employmentStatusesQuery.refetch()
    departmentsQuery.refetch()
    jobGradesQuery.refetch()
    jobPositionsQuery.refetch()
    organizationUnitsQuery.refetch()
    workLocationsQuery.refetch()
  }
  
  return (  
      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs defaultValue="basic-information">
            <TabsList>
              <TabsTrigger value="basic-information">
                Basic Information
                {hasErrorsInTab(form.formState.errors, [
                  "name",
                  "idNumber",
                  "email",
                  "gender",
                  "birthPlace",
                  "birthDate",
                  "religionId",
                  "taxStatusId",
                ]) && <span className="text-red-500 ml-2">*</span>}
              </TabsTrigger>
              <TabsTrigger value="employment-information">
                Employment Information 
                {hasErrorsInTab(form.formState.errors, [
                  "workLocationId",
                  "jobGradeId",
                  "jobPositionId",
                  "employmentStatusId",
                  "employmentDates",
                  "pensionDate",
                ]) && <span className="text-red-500 ml-2">*</span>}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="basic-information">
              {Object.keys(form.formState.errors).length > 0 && (
                <p className="text-red-500">Please resolve errors in the highlighted tabs.</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-2">   
                <div className="space-y-2">
                    <p className="text-md text-muted-foreground">
                      Required Fields
                    </p>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field , formState : { errors }  }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter employee name" />
                          </FormControl>
                          {errors.name && <FormMessage> {errors.name.message} </FormMessage>}
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="idNumber"
                      render={({ field , formState : { errors }  }) => (
                        <FormItem>
                          <FormLabel>ID Number</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter ID Number" />
                          </FormControl>
                          {errors.idNumber && <FormMessage> {errors.idNumber.message} </FormMessage>}
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field , formState : { errors }  }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter email" />
                          </FormControl>
                          {errors.email && <FormMessage> {errors.email.message} </FormMessage>}
                        </FormItem>
                      )}
                    />
                      

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field , formState : { errors }  }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <FormControl>
                            <Select {...field} onValueChange={field.onChange}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          {errors.gender && <FormMessage> {errors.gender.message} </FormMessage>}
                        </FormItem>
                      )}
                    />
                      
                    
                    <FormField
                      control={form.control}
                      name="maritalStatus"
                      render={({ field , formState : { errors }  }) => (
                        <FormItem>
                          <FormLabel>Marital Status</FormLabel>
                          <FormControl>
                            <Select {...field} onValueChange={field.onChange}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Marital Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="unverified">Unverified</SelectItem>
                                <SelectItem value="single">Single</SelectItem>
                                <SelectItem value="married">Married</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          {errors.maritalStatus && <FormMessage> {errors.maritalStatus.message} </FormMessage>}
                        </FormItem>
                      )}
                    />
                          
                    <FormField
                      control={form.control}
                      name="birthPlace"
                      render={({ field , formState : { errors }  }) => (    
                      <FormItem>
                          <FormLabel>Birth Place</FormLabel>
                          <FormControl>
                              <Input {...field} placeholder="Birth Place" />
                          </FormControl>
                          {errors.birthPlace && <FormMessage> {errors.birthPlace.message} </FormMessage>}
                      </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="birthDate"
                      render={({ field , formState : { errors }  }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <DatePickerInput
                              value={field.value || null}
                              onChange={field.onChange}
                              disabledDate={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                            />
                          </FormControl>
                          {errors.birthDate && <FormMessage> {errors.birthDate.message} </FormMessage>}
                        </FormItem>
                      )}
                    />  
                    <FormField
                      control={form.control}
                      name="religionId"
                      render={({ field , formState : { errors }  }) => (
                        <FormItem>
                          <FormLabel>Religion</FormLabel>
                          <FormControl>
                            {religionsQuery.isLoading ? (
                              <Loader2 className="animate-spin" />
                            ) : (
                              <Select {...field} onValueChange={field.onChange}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Religion" />
                                </SelectTrigger>
                                <SelectContent>
                                  {religionsQuery.data?.data?.map((item) => {
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
                          {errors.religionId && <FormMessage> {errors.religionId.message} </FormMessage>}
                        </FormItem>
                      )}
                    />
                     
                     <FormField
                      control={form.control}
                      name="taxStatusId"
                      render={({ field , formState : { errors }  }) => (
                        <FormItem>
                          <FormLabel>Tax Status</FormLabel>
                          <FormControl>
                            {taxStatusesQuery.isLoading ? (
                              <Loader2 className="animate-spin" />
                            ) : (
                              <Select {...field} onValueChange={field.onChange}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Tax Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  {taxStatusesQuery.data?.data?.map((item) => {
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
                          {errors.taxStatusId && <FormMessage> {errors.taxStatusId.message} </FormMessage>}
                        </FormItem>
                      )}
                    />
                </div>
                <div className="space-y-2">
                  <p className="text-md text-muted-foreground">
                    Can be empty
                  </p>
                  <FormField
                    control={form.control}
                    name="insuranceNumber"
                    render={({ field , formState : { errors }  }) => (
                      <FormItem>
                        <FormLabel>Insurance Number</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter Insurance Number" />
                        </FormControl>
                        {errors.insuranceNumber && <FormMessage> {errors.insuranceNumber.message} </FormMessage>}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field , formState : { errors }  }) => (    
                    <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="Address" />
                        </FormControl>
                        {errors.address && <FormMessage> {errors.address.message} </FormMessage>}
                    </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field , formState : { errors }  }) => (    
                    <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="State" />
                        </FormControl>
                        {errors.state && <FormMessage> {errors.state.message} </FormMessage>}
                    </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field , formState : { errors }  }) => (    
                    <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="City" />
                        </FormControl>
                        {errors.city && <FormMessage> {errors.city.message} </FormMessage>}
                    </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field , formState : { errors }  }) => (    
                    <FormItem>
                        <FormLabel>District</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="District" />
                        </FormControl>
                        {errors.district && <FormMessage> {errors.district.message} </FormMessage>}
                    </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bankBranch"
                    render={({ field , formState : { errors }  }) => (    
                    <FormItem>
                        <FormLabel>Bank Branch</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="Bank Branch" />
                        </FormControl>
                        {errors.bankBranch && <FormMessage> {errors.bankBranch.message} </FormMessage>}
                    </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bankAccount"
                    render={({ field , formState : { errors }  }) => (    
                    <FormItem>
                        <FormLabel>Bank Account</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="Bank Account" />
                        </FormControl>
                        {errors.bankAccount && <FormMessage> {errors.bankAccount.message} </FormMessage>}
                    </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="taxNumber"
                    render={({ field , formState : { errors }  }) => (    
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
                    render={({ field , formState : { errors }  }) => (    
                    <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="Phone Number" />
                        </FormControl>
                        {errors.phoneNumber && <FormMessage> {errors.phoneNumber.message} </FormMessage>}
                    </FormItem>
                    )}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="employment-information">
              {Object.keys(form.formState.errors).length > 0 && (
                <p className="text-red-500">Please resolve errors in the highlighted tabs.</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-2">
                <div className="space-y-2">
                  <FormField
                      control={form.control}
                      name="joinDate"
                      render={({ field , formState : { errors }  }) => (
                        <FormItem>
                          <FormLabel>Join Date</FormLabel>
                          <FormControl>
                            <DatePicker
                              value={field.value || null}
                              onChange={field.onChange}
                              disabledDate={(date) =>
                                date < new Date() // Can't be backdate
                              }
                            />
                          </FormControl>
                            {errors.joinDate && (
                              <FormMessage>{errors.joinDate.message}</FormMessage>
                            )}
                        </FormItem>
                      )}
                    />
                  <FormField
                      control={form.control}
                      name="workLocationId"
                      render={({ field , formState : { errors }  }) => (
                        <FormItem>
                          <FormLabel>Work Location</FormLabel>
                          <FormControl>
                            {workLocationsQuery.isLoading ? (
                                <Loader2 className="animate-spin" />
                              ) : (
                              <Select {...field} onValueChange={field.onChange}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Work Location" />
                                </SelectTrigger>
                                <SelectContent>
                                  {workLocationsQuery.data?.data?.map((item) => {
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
                          {errors.workLocationId && <FormMessage> {errors.workLocationId.message} </FormMessage>}
                        </FormItem>
                      )}
                    />   
                   
                    <FormField
                      control={form.control}
                      name="jobGradeId"
                      render={({ field , formState : { errors }  }) => (
                        <FormItem>
                          <FormLabel>Job Grade</FormLabel>
                          <FormControl>
                            {jobGradesQuery.isLoading ? (
                                <Loader2 className="animate-spin" />
                              ) : (
                              <Select {...field} onValueChange={field.onChange}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Job Grade" />
                                </SelectTrigger>
                                <SelectContent>
                                  {jobGradesQuery.data?.data?.map((item) => {
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
                          {errors.jobGradeId && <FormMessage> {errors.jobGradeId.message} </FormMessage>}
                      </FormItem>
                      )}
                    />
                   
                    <FormField
                      control={form.control}
                      name="departmentId"
                      render={({ field , formState : { errors }  }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <FormControl>
                            {departmentsQuery.isLoading ? (
                                <Loader2 className="animate-spin" />
                              ) : (
                              <Select {...field} onValueChange={field.onChange}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Department" />
                                </SelectTrigger>
                                <SelectContent>
                                  {departmentsQuery.data?.data?.map((item) => {
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
                          {errors.jobGradeId && <FormMessage> {errors.jobGradeId.message} </FormMessage>}
                      </FormItem>
                      )}
                    />
                    
                    {departmentId && <FormField
                      control={form.control}
                      name="jobPositionId"
                      render={({ field , formState : { errors }  }) => (
                        <FormItem>
                          <FormLabel>Job Position</FormLabel>
                          <FormControl>
                            {jobPositionsQuery.isLoading ? (
                              <Loader2 className="animate-spin" />
                            ) : (
                            <Select {...field} onValueChange={field.onChange}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Job Position" />
                              </SelectTrigger>
                              <SelectContent>
                                {jobPositionsQuery.data?.data?.map((item) => {
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
                          {errors.jobPositionId && <FormMessage> {errors.jobPositionId.message} </FormMessage>}
                      </FormItem>
                      )}
                    />}
                </div>   
                <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="employmentDates"
                      render={({ field , formState : { errors }  }) => (
                          <FormItem>
                            <FormLabel>Employment Dates</FormLabel>
                            <FormControl>
                                <DateRangePicker
                                    value={field.value}
                                    onChange={(date) => field.onChange(date)}
                                />
                            </FormControl>
                            {errors.employmentDates && (
                              <FormMessage>{errors.employmentDates.message}</FormMessage>
                            )}
                        </FormItem>
                      )}
                      /> 
                    <FormField
                      control={form.control}
                      name="employmentStatusId"
                      render={({ field , formState : { errors }  }) => (
                        <FormItem>
                          <FormLabel>Employment Status</FormLabel>
                          <FormControl>
                            {employmentStatusesQuery.isLoading ? (
                              <Loader2 className="animate-spin" />
                            ) : (
                              <Select {...field} onValueChange={field.onChange}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Employment Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  {employmentStatusesQuery.data?.data?.map((item) => {
                                    const id = item.id.toString();
                                    return (
                                    <SelectItem key={id} value={id}>
                                      {item.name} [{item.employeeCode}]
                                    </SelectItem>
                                  )})}
                                </SelectContent>
                              </Select>
                            )}
                          </FormControl>
                          {errors.employmentStatusId && <FormMessage> {errors.employmentStatusId.message} </FormMessage>}
                        </FormItem>
                      )}
                    />
                    {(form.getValues('employmentStatusId') == 'OS' && outsourceVendorQuery.data?.data ) && 
                      <FormField
                        control={form.control}
                        name="outsourceVendorId"
                        render={({ field , formState : { errors }  }) => (
                          <FormItem>
                            <FormLabel>Outsource Vendor</FormLabel>
                            <FormControl>
                              {outsourceVendorQuery.isLoading ? (
                                <Loader2 className="animate-spin" />
                              ) : (
                                <Select {...field} onValueChange={field.onChange}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select Outsource Vendor" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {outsourceVendorQuery.data?.data?.map((item) => {
                                      const id = item.id.toString();
                                      return (
                                      <SelectItem key={id} value={id}>
                                        {item.name}
                                      </SelectItem>
                                    )})}
                                  </SelectContent>
                                </Select>
                              )}
                            </FormControl>
                            {errors.outsourceVendorId && <FormMessage> {errors.outsourceVendorId.message} </FormMessage>}
                          </FormItem>
                        )}
                    />}
                   
                  <Authorization allowedRoles={[ROLES.ADMIN]}>            
                    <FormField
                        control={form.control}
                        name="pensionDate"
                        render={({ field , formState : { errors }  }) => (
                          <FormItem>
                            <FormLabel>Pension Date</FormLabel>
                            <FormControl>
                              <DatePicker
                                value={field.value}
                                onChange={field.onChange}
                                disabledDate={(date) =>
                                  date < new Date()
                                }
                              />
                            </FormControl>
                              {errors.pensionDate && (
                                <FormMessage>{errors.pensionDate.message}</FormMessage>
                              )}
                          </FormItem>
                        )}
                      />  
                  </Authorization>     
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="my-4">
            {queriesFailed && <RefetchButton onClick={refetchReferenceData}/>}
            <Button type="submit" disabled={Boolean(isFetching) }>Submit</Button>
          </DialogFooter>
        </form>
      </Form>
  )
}
