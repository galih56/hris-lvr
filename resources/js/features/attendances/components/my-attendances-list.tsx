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
import { formatDate } from '@/lib/datetime';
import { VariantType } from '@/types/ui';

export type AttendancesListProps = {
  onAttendancePrefetch?: (id: string) => void;
};

export const AttendancesList = ({
  onAttendancePrefetch,
}: AttendancesListProps) => {
  const navigate = useNavigate();
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
      accessorKey: "checkIn",
      header : 'Check In',
      cell : ({row}) => {
        const attendance = row.original;
        if(!attendance.checkIn) return '-';
        
        return formatDate(attendance.checkIn)
      }
    },
    {
      accessorKey: "checkOut",
      header : 'Check Out',
      cell : ({row}) => {
        const attendance = row.original;
        if(!attendance.checkOut) return '-';
        
        return formatDate(attendance.checkOut)
      }
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
    <div className="flex flex-col">
      <div className="mb-4">
          <Input
            type="text"
            placeholder="Search attendances..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {!attendancesQuery.isPending || attendances ? <DataTable
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
