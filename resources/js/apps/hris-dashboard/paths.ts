
export const paths : Paths = {
  home: {
    path: '/',
    getHref: () => '/',
  },
  dashboard: {
    path: '',
    getHref: () => '/',
  },
  employees: {
    path: 'employees',
    getHref: () => '/employees',
  },
  employee: {
    path: 'employees/:id',
    getHref: (id?: string) => `/employees/${id}`,
  },
  attendances: {
    path: 'attendances',
    getHref: () => '/attendances',
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
  shiftAssignments: {
    path: 'shift-assignments',
    getHref: () => '/shift-assignments',
  },
  shiftAssignment: {
    path: 'shift-assignments/:id',
    getHref: (id?: string) => `/shift-assignments/${id}`,
  },
  shifts: {
    path: 'shifts',
    getHref: () => '/shifts',
  },
  shift: {
    path: 'shifts/:id',
    getHref: (id?: string) => `/shifts/${id}`,
  },
  departments: {
    path: 'departments',
    getHref: () => '/departments',
  },
  department: {
    path: 'departments/:id',
    getHref: (id?: string) => `/departments/${id}`,
  },
  jobPositions: {
    path: 'job-positions',
    getHref: () => '/job-positions',
  },
  jobPosition: {
    path: 'job-positions/:id',
    getHref: (id?: string) => `/job-positions/${id}`,
  },
  workLocations: {
    path: 'work-locations',
    getHref: () => '/work-locations',
  },
  workLocation: {
    path: 'work-locations/:id',
    getHref: (id?: string) => `/work-locations/${id}`,
  },
  users: {
    path: 'users',
    getHref: () => '/users',
  },
  user: {
    path: 'users/:id',
    getHref: (id?: string) => `/users/${id}`,
  },
  setting: {
    path: 'setting',
    getHref: () => '/setting',
  },
  profile: {
    path: 'profile',
    getHref: () => '/profile',
  },
} as const;
