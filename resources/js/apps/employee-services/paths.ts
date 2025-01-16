
import { 
  Home,  
  User,
  Users2Icon,
} from "lucide-react"

export const paths : Paths = {
  home: {
    path: '/',
    getHref: () => '/',
    icon: Home
  },
  attendances: {
    path: 'attendances',
    getHref: () => '/attendances',
    icon: Users2Icon,
  },
  attendance: {
    path: 'attendances/:id',
    getHref: (id?: string) => `/attendances/${id}`,
  },
  leaveRequests: {
    path: 'leave-requests',
    getHref: () => '/leave-requests',
  },
  leaveRequest: {
    path: 'leave-requests/:id',
    getHref: (id?: string) => `/ leave-requests/${id}`,
  },
  profile: {
    path: 'profile',
    getHref: () => '/profile',
    icon: User
  },
} as const;
