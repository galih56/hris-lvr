import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Camera } from "@/components/ui/camera";
import { CurrentDateTime } from "@/components/ui/current-datetime";
import useGeoLocation from "@/hooks/use-geolocation";
import { recordAttendanceInputSchema, useRecordAttendance } from '../api/record-attendance';
import { useNotifications } from '@/components/ui/notifications';
import { useIsFetching } from '@tanstack/react-query';
import { SaveIcon } from "lucide-react";
import { AlertType } from "@/types/ui";
import { useCheckActiveShiftAssignment } from "@/features/shift-assignments/api/check-active-shift-assignment";
import useAuth from "@/store/useAuth";
import { ROLES } from "@/lib/authorization";
import { Link } from "@/components/ui/link";
import { paths } from "@/apps/hris-dashboard/paths";

type RecordAttendanceType = {
  onSuccess?: Function;
  onError?: Function;
};

export default function RecordAttendance({ onSuccess, onError }: RecordAttendanceType) {
  const auth = useAuth();
  const { addNotification } = useNotifications();
  const { coords, error: geoLocationError } = useGeoLocation();
  const [alert, setAlert] = useState<AlertType | null>(null);
  const checkShiftAssignment = useCheckActiveShiftAssignment({});

  const createAttendanceMutation = useRecordAttendance({
    mutationConfig: {
      onSuccess: () => {
        onSuccess?.();
      },
      onError: () => {
        onError?.();
      },
    },
  });

  const isFetching = useIsFetching();
  const form = useForm<z.infer<typeof recordAttendanceInputSchema>>({
    resolver: zodResolver(recordAttendanceInputSchema),
  });

  useEffect(() => {
    if (coords) {
      form.setValue("location.latitude", coords.latitude);
      form.setValue("location.longitude", coords.longitude);
    }
  }, [coords, form]);

  async function onSubmit(values: z.infer<typeof recordAttendanceInputSchema>) {
    const { latitude, longitude } = form.getValues("location");
    if (!latitude || !longitude) {
      setAlert({
        title: "Location not found!",
        message: "Please turn on your Geolocation.",
        variant: "destructive",
      });
      return;
    }

    const isValid = await form.trigger();
    if (!isValid) {
      addNotification({
        type: "error",
        title: "Required fields are empty",
      });
      return;
    }
    createAttendanceMutation.mutate(values);
  }


  return (
    <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {checkShiftAssignment.isPending ? 
          <div className="w-full">
            <p>Checking shift assignment...</p>
          </div>:
          <>
            {!checkShiftAssignment?.data?.data && (
              <Alert variant="warning" className="mb-2">
                <AlertTitle>No shift assignment found</AlertTitle>
                {
                  auth?.user?.role?.code == ROLES.EMP ? 
                    <AlertDescription>Please contact HR/Admin</AlertDescription> :
                    <AlertDescription>Assign this employee to a shift <Link to={paths.shiftAssignments?.getHref()}>here</Link>.</AlertDescription>
                }
              </Alert> 
            )}
          </>
        }
        {alert && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>{alert.title}</AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}
        <CurrentDateTime control={form.control} name="currentDateTime" />
        <FormField
          control={form.control}
          name="location.latitude"
          render={({ field }) => (
            <FormControl>
              <input type="hidden" {...field} value={field.value ? field.value?.toString() : ''} />
            </FormControl>
          )}
        />
        <FormField
          control={form.control}
          name="location.longitude"
          render={({ field }) => (
            <FormControl>
              <input type="hidden" {...field} value={field.value ? field.value?.toString() : ''} />
            </FormControl>
          )}
        />
        <FormField
          control={form.control}
          name="photo"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Camera
                  label="Capture Attendance Photo"
                  onTake={(photo) => {
                    field.onChange(photo);
                  }}
                  error={Boolean(form.formState.errors.photo)}
                  errorMessage={form.formState.errors.photo?.message}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter className="my-4">
          {geoLocationError ? (
            <span className="text-red"> {geoLocationError} </span>
          ) : (
            <Button
              type="submit"
              disabled={Boolean(isFetching)}
              className="w-full"
              isLoading={createAttendanceMutation.isPending || checkShiftAssignment.isPending}
            >
              <SaveIcon /> Submit Attendance
            </Button>
          )}
        </DialogFooter>
      </form>
    </Form>
  );
}
