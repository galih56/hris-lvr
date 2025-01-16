import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useEmployees } from '../api/get-employees';
import {  DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';

import { Employee } from "@/types/api"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { getEmployeeQueryOptions } from "../api/get-employee"
import { Link } from '@/components/ui/link';
import { paths } from '@/apps/hris-dashboard/paths';
import { Skeleton } from '@/components/ui/skeleton';
import { capitalizeFirstChar } from '@/lib/common';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { formatDate } from '@/lib/datetime';

export type EmployeesListProps = {
  onEmployeePrefetch?: (id: string) => void;
};

export const EmployeesList = ({
  onEmployeePrefetch,
}: EmployeesListProps) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = +(searchParams.get("page") || 1);
  const search = searchParams.get('search') || '';

  const employeesQuery = useEmployees({
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

  const employees = employeesQuery.data?.data;
  const meta = employeesQuery.data?.meta;

  
  const columns: ColumnDef<Employee>[] = [ 
    {
    id: "actions",
    cell: ({ row }) => {
        const employee = row.original
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
                    queryClient.prefetchQuery(getEmployeeQueryOptions(employee.id));
                    onEmployeePrefetch?.(employee.id);
                  }}
                  to={paths.employee.getHref(employee.id)}
                >
            <DropdownMenuItem>
                  View
            </DropdownMenuItem> 
                </Link>
              <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(employee.code)}
            >
              Copy Employee Code
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
    {
      accessorKey: "code",
      header: "Employee Code",
    },
    {
      accessorKey: "name",
      header : 'Name',
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell : ({row}) => {
        const employee = row.original;
        return capitalizeFirstChar(employee.gender)
      }
    },
    {
      accessorKey: "joinDate",
      header : 'Join Date',
      cell : ({row}) => {
        const employee = row.original;
        if(!employee.joinDate) return '-';
        
        return formatDate(employee.joinDate)
      }
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: ({ row }) => {
      const employee = row.original;
        return (
          <span>{employee.jobPosition?.department && employee.jobPosition?.department.name}</span>
        )
      },
    },
    {
      accessorKey: "jobPosition",
      header: "Job Position",
      cell: ({ row }) => {
      const employee = row.original;
        return (
          <span>{employee.jobPosition && employee.jobPosition.name}</span>
        )
      },
    },
    {
      accessorKey: "status",
      header : 'Status',
      cell : ({row}) => {
        const employee = row.original;
        const badgeVariant = employee.status == 'inactive' ? 'destructive' : 'info'
        return <Badge variant={badgeVariant}>{  capitalizeFirstChar(employee.status)}</Badge>
      }
    },
  ]
  const onPageChange = (newPage: number) => {
    queryClient.setQueryData(
      ['employees', { page: newPage }],
      employeesQuery.data 
    ); 
    navigate(`?page=${newPage}`);
    employeesQuery.refetch();
  };

  return (
    <div className="flex flex-col">
      <div className="mb-4">
          <Input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {!employeesQuery.isPending && employees ? <DataTable
          data={employees}
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
