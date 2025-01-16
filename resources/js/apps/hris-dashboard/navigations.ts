import { HomeIcon, IdCardIcon, Network, SettingsIcon, TimerIcon, Users2Icon } from 'lucide-react';
import { paths } from './paths';
import { NavigationItem } from '@/types/ui';

export const navigations : NavigationItem[] = [
    {
      title : 'Home',
      url : paths.home.getHref(),
      icon: HomeIcon,
      roles: ['ADMIN', 'HR'],
    },
    {
      title : 'Employees',
      url : paths.employees.getHref(),
      icon: Users2Icon,
      roles: ['ADMIN', 'HR'],
    },
    {
      title: 'Attendances',
      url : paths.attendances.getHref(),
      icon: TimerIcon,
      roles: ['ADMIN', 'HR', 'EMP'],
      items : [
        {
          title: 'Attendance Records',
          url : paths.attendances.getHref(),
          roles: ['ADMIN', 'HR', 'EMP'], 
        },
        {
          title: 'Leave Requests',
          url : paths.leaveRequests.getHref(),
          roles: ['ADMIN', 'HR', 'EMP'], 
        },
        {
          title: 'Shift Assignments',
          url : paths.shiftAssignments.getHref(),
          roles: ['ADMIN', 'HR', 'EMP'], 
        },
        {
          title: 'Shifts',
          url : paths.shifts.getHref(),
          roles: ['ADMIN', 'HR', 'EMP'], 
        },
      ]
    },
    {
      title: 'Organization',
      url : paths.departments.getHref(),
      icon: Network,
      roles: ['ADMIN', 'HR'], 
      items : [
        {
          title: 'Departments',
          url : paths.departments.getHref(),
          roles: ['ADMIN', 'HR', 'EMP'], 
        },
        {
          title: 'Job Positions',
          url : paths.jobPositions.getHref(),
          roles: ['ADMIN', 'HR', 'EMP'], 
        },
      ]
    },
    {
      title: 'Setting',
      url : paths.setting.getHref(),
      icon: SettingsIcon,
      roles: ['ADMIN'], 
      items : [
        {
          title: 'Users',
          url : paths.users.getHref(),
          icon: IdCardIcon,
          roles: ['ADMIN'], 
        },
      ]
    }
]