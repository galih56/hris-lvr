import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useShiftAssignments } from '../api/get-shift-assignments';
import {  DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';

import { ShiftAssignment } from "@/types/api"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { getShiftAssignmentQueryOptions } from "../api/get-shift-assignment"
import { Link } from '@/components/ui/link';
import { paths } from '@/apps/hris-dashboard/paths';
import { Skeleton } from '@/components/ui/skeleton';
import { capitalizeFirstChar } from '@/lib/common';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { formatDate, formatTime } from '@/lib/datetime';

export type ShiftAssignmentsListProps = {
  onShiftAssignmentPrefetch?: (id: string) => void;
};

export const ShiftAssignmentsList = ({
  onShiftAssignmentPrefetch,
}: ShiftAssignmentsListProps) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = +(searchParams.get("page") || 1);
  const search = searchParams.get('search') || '';

  const shiftAssignmentsQuery = useShiftAssignments({
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

  const shiftAssignments = shiftAssignmentsQuery.data?.data;
  const meta = shiftAssignmentsQuery.data?.meta;

  
  const columns: ColumnDef<ShiftAssignment>[] = [ 
    {
    id: "actions",
    cell: ({ row }) => {
        const shift = row.original
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
                    queryClient.prefetchQuery(getShiftAssignmentQueryOptions(shift.id));
                    onShiftAssignmentPrefetch?.(shift.id);
                  }}
                  to={paths.shift.getHref(shift.id)}
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
      accessorKey: "shift",
      header: "Shift",
      cell : ({row}) => {
        const assignment = row.original;
        if(!assignment.shift) return 'Shift is Unrecognized';
        
        return assignment.shift?.name + ` [${assignment.shift?.code}]`
      }
    },
    {
      accessorKey: "name",
      header : 'Name',
      cell : ({row}) => {
        const assignment = row.original;
        if(!assignment.employee) return 'Employee is Unrecognized';
        
        return assignment?.employee?.name + ` [${assignment.employee?.code}]`
      }
    },
    {
      accessorKey: "effectiveDate",
      header : 'Effective Date',
      cell : ({row}) => {
        const assignment = row.original;
        if(!assignment.effectiveDate) return '-';
        
        return formatDate(assignment.effectiveDate)
      }
    },
    {
      accessorKey: "end",
      header : 'End',
      cell : ({row}) => {
        const assignment = row.original;
        if(!assignment.end) return '-';
        
        return formatDate(assignment.end)
      }
    },
    {
      accessorKey: "status",
      header : 'Status',
      cell : ({row}) => {
        const assignment = row.original;
        if(!assignment.status) return '-';
        
        return assignment.status;
      }
    },
  ]
  const onPageChange = (newPage: number) => {
    queryClient.setQueryData(
      ['shift-assignments', { page: newPage }],
      shiftAssignmentsQuery.data 
    ); 
    navigate(`?page=${newPage}`);
    shiftAssignmentsQuery.refetch();
  };

  return (
    <div className="flex flex-col">
      <div className="mb-4">
          <Input
            type="text"
            placeholder="Search shift assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {!shiftAssignmentsQuery.isPending && shiftAssignments ? <DataTable
          data={shiftAssignments}
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
