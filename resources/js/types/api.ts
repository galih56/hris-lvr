export type Meta = {
    page: number;
    total: number;
    totalPages: number;
};
  
export type AuthResponse = {
    status : string;
    accessToken : string;
    tokenType : string;
    data: User;
};

export type BaseEntity = {
    id: string;
    updatedAt: Date;
    createdAt: Date;
};

export type Option = {
  value : string;
  label : string;
}

export type Callback<T> = (value?: T) => void;

export enum AttendanceStatus {
    Present = 'present',
    Absent = 'absent',
    Leave = 'leave',
}

export enum ApprovalStatus {
    Unverified = 'unverified',
    Approved = 'approved',
    PartiallyApproved = 'partially_approved',
}

export type Attendance = {
    id?: string;
    name: string;
    attendanceCode: string;
    employeeCode: string;
    checkIn : Date | null;
    checkOut : Date | null;
    hoursWorked : Date | null;
    notes: string;
    status: AttendanceStatus;
} & BaseEntity;


export type Overtime = {
    id?: string;
    name: string;
    overtimeCode: string;
    employeeCode: string;
    start : Date | null;
    end : Date | null;
    days : number;
    notes: string;
    status: ApprovalStatus;
} & BaseEntity;


export type LeaveRequest = {
    id?: string;
    name: string;
    leaveRequestCode: string;
    employeeCode: string;
    start : Date | null;
    end : Date | null;
    days : number;
    notes: string;
    status: ApprovalStatus;
} & BaseEntity;

export type Employee = {
    id? : string;
    employeeCode: string;
    name: string;
    email: string; 
    address: string;
    state: string;
    city: string;
    district: string;
    idNumber: string;
    bankBranch: string;
    bankAccount: string;
    phoneNumber: string;
    birthPlace: string;
    birthDate: Date | null;
    joinDate: Date | null;
    gender: 'Laki-laki' | 'Perempuan'
    position: string; 
    jobPosition: string; 
    directorate: string; 
    employeeStatus: number;
    employmentStart: Date | null;
    employmentEnd: Date | null;
    levelId: string;
    levelName: string;
} & BaseEntity;



export type UserRole = {
    code : 'EMP' | 'ADMIN',
    name : 'Employee' | 'Administrator'
}
    
export interface User {
    username: string;
    email: string;
    name: string;
    employeeCode: string;
    jobPosition: string;
    photo? : string;
    gender : 'Laki-laki' | 'Perempuan'
    role? : UserRole
}