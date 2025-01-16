
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

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createLeaveRequestInputSchema, useCreateLeaveRequest } from '../api/create-leave-request';
import { useNotifications } from '@/components/ui/notifications';
import { useIsFetching } from '@tanstack/react-query';
import { Loader2, RefreshCcw } from "lucide-react";
import { RefetchButton } from "@/components/ui/refetch-button"
import { Textarea } from "@/components/ui/textarea";
import { DateRangePicker } from "@/components/ui/date-picker/daterange-picker-input";
import { useLeaveTypes } from "../api/get-leave-types";
import { ComboBox } from "@/components/ui/combobox";
import { useEffect, useState } from "react";
import { LeaveType } from "@/types/api";
import { addDays, subDays } from "date-fns";
import DateTimePickerInput from "@/components/ui/date-picker/date-picker-input";


type CreateLeaveRequestType = {
  onSuccess? : Function;
  onError? : Function;
}

export default function CreateLeaveRequest({
  onSuccess,
  onError
} : CreateLeaveRequestType) { 
  const { addNotification } = useNotifications();
  const [ searchLeaveType , setSearchLeaveType ] = useState<string>("");
  const [leaveLimit, setLeaveLimit] = useState<string | null>(null);
  const [dateLimits, setDateLimits] = useState<{
    minDate: Date | null;
    maxDate: Date | null;
  }>({ minDate: null, maxDate: null });
  const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveType | null | undefined>(null);


  const createLeaveRequestMutation = useCreateLeaveRequest({
    mutationConfig: {
      onSuccess: () => {
        onSuccess?.();
      },
      onError: () => {
        onError?.();
      },
    },
  });
  


  const leaveTypesQuery = useLeaveTypes({});
  const leaveTypes : LeaveType[]= leaveTypesQuery.data?.data || [];


  const form = useForm({
    resolver: zodResolver(createLeaveRequestInputSchema(dateLimits?.minDate, dateLimits.maxDate)), // Pass the actual schema, not the function
  });

  const leaveTypeId = useWatch({
    control: form.control,
    name: "leaveTypeId",
  });
  
  useEffect(() => {
    if(leaveTypeId){
      setSelectedLeaveType(leaveTypes.find(
        (type) => type.id === leaveTypeId
      ));
    }
  },[leaveTypeId])

  useEffect(() => {
    if (selectedLeaveType) {
  
      if (selectedLeaveType && selectedLeaveType.eligibilityDays) {
        const eligibilityDays = selectedLeaveType.eligibilityDays;
  
        // Get the start date from the form
        const startDate = form.getValues("leaveDates")?.from;
        
        console.log('leaveDates',form.getValues('leaveDates'));
        if (startDate) {
          // Calculate date limits only if the start date is chosen
          const minDate = subDays(new Date(startDate), eligibilityDays);
          const maxDate = addDays(new Date(startDate), eligibilityDays);
  
          setDateLimits({ minDate, maxDate });
  
          setLeaveLimit(
            `You are allowed to select dates between ${minDate.toLocaleDateString()} and ${maxDate.toLocaleDateString()} for ${selectedLeaveType.name}.`
          );
        } else {
          // If no start date is selected, just show the eligibility days
          setDateLimits({ minDate: null, maxDate: null });
          setLeaveLimit(
            `You are allowed ${selectedLeaveType.eligibilityDays} days for ${selectedLeaveType.name}.`
          );
        }
      } else {
        setDateLimits({ minDate: null, maxDate: null });
        setLeaveLimit(null);
      }
    } else {
      setDateLimits({ minDate: null, maxDate: null });
      setLeaveLimit(null);
    }
  }, [selectedLeaveType, leaveTypes, form]);

  const isFetching = useIsFetching();

  async function onSubmit(values: z.infer<typeof createLeaveRequestInputSchema>) {
    console.log(form.formState.errors, values);
    return;
    const isValid = await form.trigger();
    if (!isValid) {
      addNotification({
        type: 'error',
        title: 'Required fields are empty',
      });;
      return;
    }
    createLeaveRequestMutation.mutate(values)
  }
  
  return (  
      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="leaveTypeId"
            render={({ field, formState: { errors } }) => {
              const options = leaveTypesQuery.data?.data.map((item) => {
                let label = item.name;

                if(item.eligibilityDays || item.dayType){
                  label += " (";
                  if(item.eligibilityDays){
                    label += ` Eligibility ${item.eligibilityDays} Days`
                  }
  
                  if(item.dayType){
                    label += ` [${item.dayType}]`
                  }
                  label += " )";
                }

                return {
                  label: label,
                  value: item.id,
                }
              }) || [];

              const handleSelect = (selectedOption : any) => {
                field.onChange(selectedOption?.value || null); // Update the field value
              };

              return (
                <FormItem>
                  <FormLabel>Leave Type</FormLabel>
                  <FormControl>
                    {leaveTypesQuery.isLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <ComboBox
                        inputValue={searchLeaveType}
                        onInputChange={(value : string) => setSearchLeaveType(value)}
                        options={options}
                        label="Select Leave Type"
                        selectedOption={options.find((o) => o.value === field.value) || null}
                        onSelect={handleSelect}
                        isLoading={leaveTypesQuery.isLoading}
                        isError={leaveTypesQuery.isError}
                      />
                    )}
                  </FormControl>
                  {errors.leaveTypeId && <FormMessage>{errors?.leaveTypeId?.message}</FormMessage>}
                </FormItem>
              );
            }}
          />
        {leaveLimit && <p className="text-sm text-muted-foreground">{leaveLimit}</p>}


        {selectedLeaveType?.eligibilityDays == 1 ? <FormField
          control={form.control}
          name="leaveDate"
          render={({ field , formState : { errors }  }) => (
            <FormItem>
              <FormLabel>Leave Date</FormLabel>
              <FormControl>
                <DateTimePickerInput
                  value={field.value || null}
                  onChange={field.onChange}
                  disabledDate={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  withTime={true}
                />
              </FormControl>
              {errors.leaveDate && <FormMessage> {errors?.leaveDate?.message} </FormMessage>}
            </FormItem>
          )}
        />  :  
          <FormField
            control={form.control}
            name="leaveDates"
            render={({ field , formState : { errors }  }) => (
                <FormItem>
                  <FormLabel>Leave Dates</FormLabel>
                  <FormControl>
                      <DateRangePicker
                        minDate={dateLimits.minDate}
                        maxDate={dateLimits.maxDate}
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                      />
                  </FormControl>
                  {errors.leaveDates && (
                    <FormMessage>{errors.leaveDates.message}</FormMessage>
                  )}
              </FormItem>
            )}
            /> 
        }
          <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notes"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          <DialogFooter className="my-4">
            <Button type="submit" disabled={Boolean(isFetching)}>Submit</Button>
          </DialogFooter>
        </form>
      </Form>
  )
}

   
/*
  ['code' => 'IMK', 'name' => 'Izin Kurang Dari 4 Jam', 'eligibility_days' => 1, 'day_type' => 'half day', 'deducted_leave' => 0, 'day_count' => 'work day', 'repeat_period' => 0],
  ['code' => 'MDAK', 'name' => 'Anggota Keluarga Dalam Satu Rumah Meninggal Dunia', 'eligibility_days' => 1, 'day_type' => 'full day', 'deducted_leave' => 0, 'day_count' => 'work day', 'repeat_period' => 0],
  ['code' => 'MISA', 'name' => 'Menjaga Isteri/Suami/Anak Sakit Keras Di RS', 'eligibility_days' => 1, 'day_type' => 'full day', 'deducted_leave' => 0, 'day_count' => 'work day', 'repeat_period' => 0],


$leave_types = [
  ['code' => 'CM', 'name' => 'Cuti Melahirkan', 'eligibility_days' => 90, 'day_type' => 'full day', 'deducted_leave' => 0, 'day_count' => 'work day', 'repeat_period' => 0],
  ['code' => 'CT', 'name' => 'Cuti Tahunan', 'eligibility_days' => 12, 'day_type' => 'full day', 'deducted_leave' => 1, 'day_count' => 'work day', 'repeat_period' => 1],
  ['code' => 'IBH', 'name' => 'Izin Ibadah Haji', 'eligibility_days' => 40, 'day_type' => 'full day', 'deducted_leave' => 0, 'day_count' => 'calendar day', 'repeat_period' => 0],
  ['code' => 'IMG', 'name' => 'Cuti Pendampingan Istri', 'eligibility_days' => 2, 'day_type' => 'full day', 'deducted_leave' => 0, 'day_count' => 'work day', 'repeat_period' => 0],
  ['code' => 'IMK', 'name' => 'Izin Kurang Dari 4 Jam', 'eligibility_days' => 1, 'day_type' => 'half day', 'deducted_leave' => 0, 'day_count' => 'work day', 'repeat_period' => 0],
  ['code' => 'IP', 'name' => 'Izin Pribadi', 'eligibility_days' => 365, 'day_type' => 'full day', 'deducted_leave' => 0, 'day_count' => 'work day', 'repeat_period' => 0],
  ['code' => 'IPK', 'name' => 'Izin Pekerja Keguguran', 'eligibility_days' => 45, 'day_type' => 'full day', 'deducted_leave' => 0, 'day_count' => 'calendar day', 'repeat_period' => 0],
  ['code' => 'KB', 'name' => 'Pengkhitanan / Pembaptisan Anak', 'eligibility_days' => 2, 'day_type' => 'full day', 'deducted_leave' => 0, 'day_count' => 'work day', 'repeat_period' => 0],
  ['code' => 'KBA', 'name' => 'Korban Penggusuran/Kebakaran/Banjir/Bencana Alam', 'eligibility_days' => 2, 'day_type' => 'full day', 'deducted_leave' => 0, 'day_count' => 'work day', 'repeat_period' => 0],
  ['code' => 'MD', 'name' => 'Keluarga Inti Meninggal Dunia', 'eligibility_days' => 2, 'day_type' => 'full day', 'deducted_leave' => 0, 'day_count' => 'work day', 'repeat_period' => 0],
  ['code' => 'MDAK', 'name' => 'Anggota Keluarga Dalam Satu Rumah Meninggal Dunia', 'eligibility_days' => 1, 'day_type' => 'full day', 'deducted_leave' => 0, 'day_count' => 'work day', 'repeat_period' => 0],
  ['code' => 'MISA', 'name' => 'Menjaga Isteri/Suami/Anak Sakit Keras Di RS', 'eligibility_days' => 1, 'day_type' => 'full day', 'deducted_leave' => 0, 'day_count' => 'work day', 'repeat_period' => 0],
  ['code' => 'PAPK', 'name' => 'Perkawinan Anak Pekerja', 'eligibility_days' => 2, 'day_type' => 'full day', 'deducted_leave' => 0, 'day_count' => 'work day', 'repeat_period' => 0],
  ['code' => 'PPK', 'name' => 'Perkawinan Pekerja', 'eligibility_days' => 3, 'day_type' => 'full day', 'deducted_leave' => 0, 'day_count' => 'work day', 'repeat_period' => 0],
  ['code' => 'SID', 'name' => 'Sakit dengan Surat Dokter', 'eligibility_days' => 365, 'day_type' => 'full day', 'deducted_leave' => 0, 'day_count' => 'work day', 'repeat_period' => 0],
  ['code' => 'SKH', 'name' => 'Cuti Sakit Karena Haid', 'eligibility_days' => 2, 'day_type' => 'full day', 'deducted_leave' => 0, 'day_count' => 'work day', 'repeat_period' => 0],
];
*/