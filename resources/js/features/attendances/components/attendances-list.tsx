import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useAttendances } from '../api/get-attendances';
import {  DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';

import { Attendance } from "@/types/api"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { getAttendanceQueryOptions } from "../api/get-attendance"
import { Link } from '@/components/ui/link';
import { paths } from '@/apps/hris-dashboard/paths';
import { Skeleton } from '@/components/ui/skeleton';
import { capitalizeFirstChar } from '@/lib/common';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { formatDate, formatDateTime } from '@/lib/datetime';
import { VariantType } from '@/types/ui';
import { useImagePreviewerStore } from '@/components/ui/image-previewer';

export type AttendancesListProps = {
  onAttendancePrefetch?: (id: string) => void;
};

export const AttendancesList = ({
  onAttendancePrefetch,
}: AttendancesListProps) => {
  const navigate = useNavigate();
  const { setSelectedImage } = useImagePreviewerStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = +(searchParams.get("page") || 1);
  const search = searchParams.get('search') || '';

  const attendancesQuery = useAttendances({
    page: currentPage,
    search,
  });

  const [searchTerm, setSearchTerm] = useState(search);

  useEffect(() => {
    // Sync the search term with query parameters
    const timeout = setTimeout(() => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        if (searchTerm) {
          params.set('search', searchTerm);
        } else {
          params.delete('search');
        }
        return params;
      });
    }, 300); // Add debounce to avoid excessive API calls

    return () => clearTimeout(timeout);
  }, [searchTerm, setSearchParams]);

  const queryClient = useQueryClient();

  const attendances = attendancesQuery.data?.data;
  const meta = attendancesQuery.data?.meta;

  
  const columns: ColumnDef<Attendance>[] = [ 
    {
    id: "actions",
    cell: ({ row }) => {
        const attendance = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <Link
                  onMouseEnter={() => {
                    // Prefetch the discussion data when the user hovers over the link
                    queryClient.prefetchQuery(getAttendanceQueryOptions(attendance.id));
                    onAttendancePrefetch?.(attendance.id);
                  }}
                  to={paths.attendance.getHref(attendance.id)}
                >
                  <DropdownMenuItem>
                    View
                  </DropdownMenuItem> 
                </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
    {
      accessorKey: "code",
      header: "Attendance Code",
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
      const attendance = row.original;
        return (
          <span>{attendance?.employee ? attendance.employee?.name : "-"}</span>
        )
      },
    },
    {
      accessorKey: "checkIn",
      header : 'Check In',
      cell : ({row}) => {
        const attendance = row.original;
        if(!attendance.checkIn) return '-';
        
        return formatDateTime(attendance.checkIn)
      }
    },
    {
      accessorKey: "checkOut",
      header : 'Check Out',
      cell : ({row}) => {
        const attendance = row.original;
        if(!attendance.checkOut) return '-';
        
        return formatDateTime(attendance.checkOut)
      }
    },{
      accessorKey: "checkInPhoto",
      header: "Photo",
      meta: {
        headerClassName : "text-center",
        cellClassName : "text-center"
      },
      cell: ({ row }) => {
        const attendance = row.original;
    
        // Check if either photo is null/undefined
        if (!attendance.checkInPhoto && !attendance.checkOutPhoto) {
          return <span className="text-gray-500 text-center">-</span>;
        }
        const checkInPhotoUrl = `${import.meta.env.VITE_BASE_URL}/storage/${attendance.checkInPhoto}`
        const checkOutPhotoUrl = `${import.meta.env.VITE_BASE_URL}/storage/${attendance.checkOutPhoto}`
        return (
          <div className="flex items-center justify-center gap-2">
            {/* Render check-in photo */}
            {attendance.checkInPhoto ? (
              <img
                src={checkInPhotoUrl}
                alt="Check-in"
                className="w-12 h-12 rounded-full object-cover border border-gray-300"
                onClick={() => setSelectedImage(checkInPhotoUrl)}
              />
            ) : null}
    
            {/* Render check-out photo */}
            {attendance.checkOutPhoto ? (
              <img
                src={checkOutPhotoUrl}
                alt="Check-out"
                className="w-12 h-12 rounded-full object-cover border border-gray-300"
                onClick={() => setSelectedImage(checkOutPhotoUrl)}
              />
            ) : null}
          </div>
        );
      },
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: ({ row }) => {
      const attendance = row.original;
        return (
          <span>{attendance.employee?.jobPosition?.department && attendance.employee?.jobPosition?.department.name}</span>
        )
      },
    },
    {
      accessorKey: "jobPosition",
      header: "Job Position",
      cell: ({ row }) => {
      const attendance = row.original;
        return (
          <span>{attendance?.employee?.jobPosition && attendance?.employee?.jobPosition.name}</span>
        )
      },
    },
    {
      accessorKey: "status",
      header : 'Status',
      cell : ({row}) => {
        const attendance = row.original;
        let badgeVariant : VariantType = 'info';

        switch (attendance.status) {
            case 'absent':
                badgeVariant = 'destructive';
                break;
    
            case 'leave':
                badgeVariant = 'warning';
                break;
            default:
                break;
        }
        return <Badge variant={badgeVariant}>{  capitalizeFirstChar(attendance.status)}</Badge>
      }
    },
  ]
  const onPageChange = (newPage: number) => {
    queryClient.setQueryData(
      ['attendances', { page: newPage }],
      attendancesQuery.data 
    ); 
    navigate(`?page=${newPage}`);
    attendancesQuery.refetch();
  };

  return (
    <div className="grid grid-cols-1">
      <div className="mb-4">
          <Input
            type="text"
            placeholder="Search attendances..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {!attendancesQuery.isPending && attendances ? 
        <DataTable
          data={attendances}
          columns={columns}
          pagination={
            meta && {
              totalPages: meta.totalPages,
              perPage: meta.perPage,
              totalCount: meta.totalCount,
              currentPage: meta.currentPage,
              rootUrl: '',
            }
          } 
          onPaginationChange={onPageChange}
        /> :  <Skeleton className='w-full min-h-[60vh]'/>}
    </div>
  );
};
