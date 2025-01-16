import { CalendarX2Icon, HomeIcon, IdCardIcon, Network, SettingsIcon, TimerIcon, Users2Icon } from 'lucide-react';
import { paths } from './paths';

export const navigations = [
  {
    title : 'Home',
    url : paths.home.getHref(),
    icon: HomeIcon
  },
  {
    title: 'Attendances',
    url : paths.attendances.getHref(),
    icon: TimerIcon,
  },
  {
    title: 'Leave Requests',
    url : paths.leaveRequests.getHref(),
    icon: CalendarX2Icon,
  },
]