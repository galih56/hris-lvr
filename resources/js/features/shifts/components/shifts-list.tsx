import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useShifts } from '../api/get-shifts';
import {  DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';

import { Shift } from "@/types/api"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { getShiftQueryOptions } from "../api/get-shift"
import { Link } from '@/components/ui/link';
import { paths } from '@/apps/hris-dashboard/paths';
import { Skeleton } from '@/components/ui/skeleton';
import { capitalizeFirstChar } from '@/lib/common';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { formatDate, formatTime } from '@/lib/datetime';

export type ShiftsListProps = {
  onShiftPrefetch?: (id: string) => void;
};

export const ShiftsList = ({
  onShiftPrefetch,
}: ShiftsListProps) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = +(searchParams.get("page") || 1);
  const search = searchParams.get('search') || '';

  const shiftsQuery = useShifts({
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

  const shifts = shiftsQuery.data?.data;
  const meta = shiftsQuery.data?.meta;

  
  const columns: ColumnDef<Shift>[] = [ 
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
                    queryClient.prefetchQuery(getShiftQueryOptions(shift.id));
                    onShiftPrefetch?.(shift.id);
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
      accessorKey: "code",
      header: "Shift Code",
    },
    {
      accessorKey: "name",
      header : 'Name',
    },
    {
      accessorKey: "start",
      header : 'Start',
      cell : ({row}) => {
        const shift = row.original;
        if(!shift.start) return '-';
        
        return formatTime(shift.start)
      }
    },
    {
      accessorKey: "end",
      header : 'End',
      cell : ({row}) => {
        const shift = row.original;
        if(!shift.end) return '-';
        
        return formatTime(shift.end)
      }
    },
    {
      accessorKey: "description",
      header : 'Description',
    },
    {
      accessorKey: "is_flexible",
      header : 'Is Flexible',
      cell : ({row}) => {
        const shift = row.original;
        if(!shift.end) return '-';
        
        return shift.isFlexible ? 'YES' : 'NO'
      }
    },
  ]
  const onPageChange = (newPage: number) => {
    queryClient.setQueryData(
      ['shifts', { page: newPage }],
      shiftsQuery.data 
    ); 
    navigate(`?page=${newPage}`);
    shiftsQuery.refetch();
  };

  return (
    <div className="flex flex-col">
      <div className="mb-4">
          <Input
            type="text"
            placeholder="Search shifts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {!shiftsQuery.isPending && shifts ? <DataTable
          data={shifts}
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
