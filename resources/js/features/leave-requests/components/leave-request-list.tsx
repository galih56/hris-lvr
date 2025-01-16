import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useLeaveRequests } from '../api/get-leave-requests';
import {  DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';

import { LeaveRequest } from "@/types/api"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { getLeaveRequestQueryOptions } from "../api/get-leave-request"
import { Link } from '@/components/ui/link';
import { paths } from '@/apps/hris-dashboard/paths';
import { Skeleton } from '@/components/ui/skeleton';
import { capitalizeFirstChar } from '@/lib/common';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { formatDate, formatTime } from '@/lib/datetime';

export type LeaveRequestsListProps = {
  onLeaveRequestPrefetch?: (id: string) => void;
};

export const LeaveRequestsList = ({
  onLeaveRequestPrefetch,
}: LeaveRequestsListProps) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = +(searchParams.get("page") || 1);
  const search = searchParams.get('search') || '';

  const leaveRequestsQuery = useLeaveRequests({
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

  const leaveRequests = leaveRequestsQuery.data?.data;
  const meta = leaveRequestsQuery.data?.meta;

  
  const columns: ColumnDef<LeaveRequest>[] = [ 
    {
    id: "actions",
    cell: ({ row }) => {
        const leaveRequest = row.original
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
                    queryClient.prefetchQuery(getLeaveRequestQueryOptions(leaveRequest.id));
                    onLeaveRequestPrefetch?.(leaveRequest.id);
                  }}
                  to={paths.leaveRequest.getHref(leaveRequest.id)}
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
      header: "Leave Request Code",
    },
    {
      accessorKey: "name",
      header : 'Name',
    },
    {
      accessorKey: "start",
      header : 'Start',
      cell : ({row}) => {
        const leaveRequest = row.original;
        if(!leaveRequest.start) return '-';
        
        return formatTime(leaveRequest.start)
      }
    },
    {
      accessorKey: "end",
      header : 'End',
      cell : ({row}) => {
        const leaveRequest = row.original;
        if(!leaveRequest.end) return '-';
        
        return formatTime(leaveRequest.end)
      }
    },
  ]
  const onPageChange = (newPage: number) => {
    queryClient.setQueryData(
      ['leaveRequests', { page: newPage }],
      leaveRequestsQuery.data 
    ); 
    navigate(`?page=${newPage}`);
    leaveRequestsQuery.refetch();
  };

  return (
    <div className="flex flex-col">
      <div className="mb-4">
          <Input
            type="text"
            placeholder="Search leaveRequests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {!leaveRequestsQuery.isPending && leaveRequests ? <DataTable
          data={leaveRequests}
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
