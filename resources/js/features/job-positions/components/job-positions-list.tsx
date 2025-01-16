import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useJobPositions } from '../api/get-job-positions';
import {  DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';

import { JobPosition } from "@/types/api"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { getJobPositionQueryOptions } from "../api/get-job-position"
import { Link } from '@/components/ui/link';
import { paths } from '@/apps/hris-dashboard/paths';
import { Skeleton } from '@/components/ui/skeleton';
import { capitalizeFirstChar } from '@/lib/common';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { formatDate } from '@/lib/datetime';

export type JobPositionsListProps = {
  onJobPositionPrefetch?: (id: string) => void;
};

export const JobPositionsList = ({
  onJobPositionPrefetch,
}: JobPositionsListProps) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = +(searchParams.get("page") || 1);
  const search = searchParams.get('search') || '';

  const jobPositionsQuery = useJobPositions({
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

  const jobPositions = jobPositionsQuery.data?.data;
  const meta = jobPositionsQuery.data?.meta;

  
  const columns: ColumnDef<JobPosition>[] = [ 
    {
    id: "actions",
    cell: ({ row }) => {
        const jobPosition = row.original
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
                    queryClient.prefetchQuery(getJobPositionQueryOptions(jobPosition.id));
                    onJobPositionPrefetch?.(jobPosition.id);
                  }}
                  to={paths.jobPosition.getHref(jobPosition.id)}
                >
            <DropdownMenuItem>
                  View
            </DropdownMenuItem> 
                </Link>
              <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(jobPosition.code)}
            >
              Copy JobPosition Code
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
    {
      accessorKey: "code",
      header: "Code",
    },
    {
      accessorKey: "name",
      header : 'Name',
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: ({ row }) => {
      const jobPosition = row.original;
        return (
          <span>{jobPosition.department && jobPosition.department?.name}</span>
        )
      },
    },
  ]
  const onPageChange = (newPage: number) => {
    queryClient.setQueryData(
      ['job-positions', { page: newPage }],
      jobPositionsQuery.data 
    ); 
    navigate(`?page=${newPage}`);
    jobPositionsQuery.refetch();
  };

  return (
    <div className="flex flex-col">
      <div className="mb-4">
          <Input
            type="text"
            placeholder="Search jobPositions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {!jobPositionsQuery.isPending || jobPositions ? <DataTable
          data={jobPositions}
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
