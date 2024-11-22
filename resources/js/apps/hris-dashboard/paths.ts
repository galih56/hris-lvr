
import { 
  Home,  
  User,
  Users2Icon,
  Settings,
  LogIn
} from "lucide-react"

export const paths = {
  home: {
    path: '/',
    getHref: () => '/',
    icon: Home
  },
  auth: {
    root: {
      path: '/',
      getHref: () => '/',
      icon: Home
    },
    register: {
      path: '/auth/register',
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/register${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
    login: {
      path: '/auth/login',
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
  },

  app: {
    root: {
      path: '/',
      getHref: () => '/',
      icon: Home
    },
    dashboard: {
      path: '',
      getHref: () => '/',
      icon: Home
    },
    employees: {
      path: 'employees',
      getHref: () => '/employees',
      icon: Users2Icon,
    },
    employee: {
      path: 'employees/:id',
      getHref: (id: string) => `/employees/${id}`,
    },
    users: {
      path: 'users',
      getHref: () => '/users',
      icon: Users2Icon,
    },
    setting: {
      path: 'setting',
      getHref: () => '/setting',
      icon: Settings,
    },
    profile: {
      path: 'profile',
      getHref: () => '/profile',
      icon: User
    },
  },
} as const;
