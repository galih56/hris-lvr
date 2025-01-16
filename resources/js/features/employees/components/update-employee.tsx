import { Loader2, Pen } from 'lucide-react';

import { Input } from "@/components/ui/input"
 
import {
  Form,
  FormControl,
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

import { Button } from '@/components/ui/button';
import { useNotifications } from '@/components/ui/notifications';
import { Authorization, ROLES } from '@/lib/authorization';
import { DatePicker } from '@/components/ui/date-picker/date-picker';

import { useEmployee } from '../api/get-employee';
import {
  updateEmployeeInputSchema,
  useUpdateEmployee,
} from '../api/update-employee';
import { useIsFetching, useQueries } from '@tanstack/react-query';
import { getReligions } from '../api/references/getReligions';
import { getEmploymentStatuses } from '../api/references/getEmploymentStatuses';
import { getDepartments } from '../api/references/getDepartments';
import { getJobGrades } from '../api/references/getJobGrades';
import { getOrganizationUnits } from '../api/references/getOrganizationUnits';
import { getWorkLocations } from '../api/references/getWorkLocations';
import { getOutsourceVendors } from '../api/references/getOutsourceVendors';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { z } from "zod";
import { hasErrorsInTab } from '@/lib/utils';
import { DialogFooter } from '@/components/ui/dialog';
import { RefetchButton } from '@/components/ui/refetch-button';
import { DateRangePicker } from '@/components/ui/date-picker/daterange-picker-input';
import { getTaxStatuses } from '../api/references/getTaxStatuses';
import DatePickerInput from '@/components/ui/date-picker/date-picker-input';
import { useJobPositions } from '@/features/job-positions/api/get-job-positions';

type UpdateEmployeeProps = {
  employeeId: string | undefined;
};

export const UpdateEmployee = ({ employeeId }: UpdateEmployeeProps) => {
  const { addNotification } = useNotifications();

  if(!employeeId){
    return null
  }

  const employeeQuery = useEmployee({ employeeId });
  const updateEmployeeMutation = useUpdateEmployee({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Employee Updated',
        });
      },
    },
  });
  const employee = employeeQuery.data?.data;

  if(!employee || employeeQuery.isPending){
    return null
  }

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
  const form = useForm<z.infer<typeof updateEmployeeInputSchema>>({
    resolver: zodResolver(updateEmployeeInputSchema),
    defaultValues : {
      name : employee?.name,
      idNumber : employee?.idNumber,

      /* Basic Information */
      email : employee?.email,
      address : employee?.address,
      city : employee?.city,
      district : employee?.district,
      state : employee?.state,
      gender : employee?.gender,
      birthPlace : employee?.birthPlace,
      birthDate : employee?.birthDate,
      phoneNumber : employee?.phoneNumber,
      bankBranch : employee?.bankBranch,
      bankAccount : employee?.bankAccount,
      maritalStatus : employee?.maritalStatus,
      religionId : employee?.religion?.id,
      taxStatusId : employee?.taxStatus?.id,
      taxNumber : employee?.taxNumber,

      /* Employment Information */
      joinDate : employee?.joinDate,
      employmentDates : {
        employmentStartDate : employee?.employmentStartDate ? employee?.employmentStartDate : new Date(),
        employmentEndDate : employee?.employmentEndDate
      },
      terminateDate : employee?.terminateDate,
      terminateReasonId : employee?.terminateReason?.id,
      employmentStatusId : employee?.employmentStatus?.id,
      workLocationId : employee?.workLocation?.id,
      jobGradeId : employee?.jobGrade?.id,
      departmentId : employee?.jobPosition?.department?.id,
      jobPositionId : employee?.jobPosition?.id,
      outsourceVendorId : employee?.outsourceVendor?.id,
      resignation : employee?.resignation,
    }
  })
  
  const departmentId = employee?.jobPosition?.departmentId;

  const jobPositionsQuery = useJobPositions({
    filters : {
      departmentId
    },
    queryConfig : {
      enabled: !!departmentId
    }
  });

  async function onSubmit(values: z.infer<typeof updateEmployeeInputSchema>) {
    const isValid = await form.trigger();
    if (!isValid) {
      addNotification({
        type: 'error',
        title: 'Required fields are empty',
      });;
      return;
    }
    updateEmployeeMutation.mutate({ data : values, employeeId : employee?.id!})
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
    <Authorization allowedRoles={[ROLES.ADMIN,ROLES.HR]}>
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
                  "terminateDate",
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
                          <FormLabel>Name<span className='text-red'>*</span></FormLabel>
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
                          <FormLabel>Email<span className='text-red'>*</span></FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter email" type='email'/>
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
                          <FormLabel>Gender<span className='text-red'>*</span></FormLabel>
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
                          <FormLabel>Marital Status<span className='text-red'>*</span></FormLabel>
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
                          <FormLabel>Birth Place<span className='text-red'>*</span></FormLabel>
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
                          <FormLabel>Religion<span className='text-red'>*</span></FormLabel>
                          <FormControl>
                            {religionsQuery.isPending ? (
                              <Loader2 className="animate-spin" />
                            ) : (
                              <Select {...field} onValueChange={field.onChange}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Religion" />
                                </SelectTrigger>
                                <SelectContent>
                                  {religionsQuery.data?.data?.map((item) => {
                                    const id = item.id;
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
                            {taxStatusesQuery.isPending ? (
                              <Loader2 className="animate-spin" />
                            ) : (
                              <Select {...field} onValueChange={field.onChange}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Tax Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  {taxStatusesQuery.data?.data?.map((item) => {
                                    const id = item.id;
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
                    name="address"
                    render={({ field , formState : { errors }  }) => (    
                    <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                            <Input type="text"  {...field} placeholder="Address" />
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
                            <Input type="text"  {...field} placeholder="State" />
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
                            <Input type="text" {...field} placeholder="City" />
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
                                date > new Date() || date < new Date("1900-01-01")
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
                          <FormLabel>Work Location<span className='text-red'>*</span></FormLabel>
                          <FormControl>
                            {workLocationsQuery.isPending ? (
                                <Loader2 className="animate-spin" />
                              ) : (
                              <Select {...field} onValueChange={field.onChange}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Work Location" />
                                </SelectTrigger>
                                <SelectContent>
                                  {workLocationsQuery.data?.data?.map((item) => {
                                    const id = item.id;
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
                            <FormLabel>Job Grade<span className='text-red'>*</span></FormLabel>
                            <FormControl>
                              {jobGradesQuery.isPending ? (
                                  <Loader2 className="animate-spin" />
                                ) : (
                                <Select {...field} onValueChange={field.onChange}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select Job Grade" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {jobGradesQuery.data?.data?.map((item) => {
                                      const id = item.id;
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
                        defaultValue={departmentId}
                        render={({ field , formState : { errors }  }) => (
                          <FormItem>
                            <FormLabel>Department</FormLabel>
                            <FormControl>
                              {departmentsQuery.isPending ? (
                                  <Loader2 className="animate-spin" />
                                ) : (
                                <Select {...field} onValueChange={field.onChange}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select Department" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {departmentsQuery.data?.data?.map((item) => {
                                      const id = item.id;
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
                      {departmentId && 
                        <FormField
                          control={form.control}
                          name="jobPositionId"
                          render={({ field , formState : { errors }  }) =>{ 
                            return (
                              <FormItem>
                              <FormLabel>Job Position<span className='text-red'>*</span></FormLabel>
                              <FormControl>
                                {jobPositionsQuery.isPending ? (
                                  <Loader2 className="animate-spin" />
                                ) : (
                                <Select {...field} onValueChange={field.onChange}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select Job Position" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {jobPositionsQuery.data?.data?.map((item) => {
                                      const id = item.id;
                                      let hide = false;
                                      if(typeof item.name  == 'object'){
                                        // console.log(item)
                                        hide=true
                                      }
                                      return (
                                      <SelectItem key={id} value={id}>
                                        {hide ? "CHECK" : item.name}
                                      </SelectItem>
                                    )}
                                  )}
                                  </SelectContent>
                                </Select>
                              )}
                              </FormControl>
                              {errors.jobPositionId && <FormMessage> {errors.jobPositionId.message} </FormMessage>}
                          </FormItem>
                          )}}
                        />}
                </div>   
                <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="employmentStatusId"
                      render={({ field , formState : { errors }  }) => (
                        <FormItem>
                          <FormLabel>Employment Status<span className='text-red'>*</span></FormLabel>
                          <FormControl>
                            {employmentStatusesQuery.isPending ? (
                              <Loader2 className="animate-spin" />
                            ) : (
                              <Select {...field} onValueChange={field.onChange}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Employment Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  {employmentStatusesQuery.data?.data?.map((item) => {
                                    const id = item.id;
                                    return (
                                      <SelectItem key={id} value={id}>
                                        {item.name}
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
                              {outsourceVendorQuery.isPending ? (
                                <Loader2 className="animate-spin" />
                              ) : (
                                <Select {...field} onValueChange={field.onChange}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select Outsource Vendor" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {outsourceVendorQuery.data?.data?.map((item) => {
                                      const id = item.id;
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
                    <FormField
                      control={form.control}
                      name="employmentDates"
                      defaultValue={form.formState.defaultValues?.employmentDates}
                      render={({ field , formState : { errors }  }) => (
                          <FormItem>
                            <FormLabel>Employment Dates</FormLabel>
                            <FormControl>
                                <DateRangePicker
                                    value={{
                                      from : field.value?.employmentStartDate,
                                      to : field.value?.employmentEndDate
                                    }}
                                    numberOfMonths={2}
                                    onChange={(date) => field.onChange(date)}
                                />
                            </FormControl>
                            {errors.employmentDates && (
                              <FormMessage>{errors.employmentDates.message}</FormMessage>
                            )}
                        </FormItem>
                      )}
                    />
                  <Authorization allowedRoles={[ROLES.ADMIN]}>     
                    <FormField
                      control={form.control}
                      name="terminateDate"
                      render={({ field , formState : { errors }  }) => (
                        <FormItem>
                          <FormLabel>Terminate Date</FormLabel>
                          <FormControl>
                            <DatePicker
                              value={field.value || null}
                              onChange={field.onChange}
                              disabledDate={(date) =>
                                date < new Date()
                              }
                            />
                          </FormControl>
                            {errors.terminateDate && (
                              <FormMessage>{errors.terminateDate.message}</FormMessage>
                            )}
                        </FormItem>
                      )}
                    />  
                                      
                    <FormField
                      control={form.control}
                      name="pensionDate"
                      render={({ field , formState : { errors }  }) => (
                        <FormItem>
                          <FormLabel>Pension Date</FormLabel>
                          <FormControl>
                            <DatePicker
                              value={field.value || undefined}
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
    </Authorization>
  );
};
