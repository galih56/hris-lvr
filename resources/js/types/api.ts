import { ApprovalStatus, AttendanceStatus, MaritalStatus } from "./enums";

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

/* Metadata for pagination */
export interface PaginationParams { page?: number; perPage?: number; search?: string };
export type Meta = {
    currentPage: number;
    perPage: number;
    totalCount: number;
    totalPages: number;
};
  
export type AuthResponse = {
    status : string;
    accessToken : string;
    tokenType : string;
    data: User;
};

export type UserRole = {
    code : 'EMP' | 'ADMIN' | 'HR',
    name : 'Employee' | 'Administrator' | 'Human Resource'
}
    
export type User = {
    username: string;
    email: string;
    name: string;
    photo? : string;
    gender : 'Male' | 'Female';
    role? : UserRole,
    employee? : Employee
} & BaseEntity;

export type Attendance = {
    id?: string;
    name: string;
    attendanceCode: string;
    checkIn : Date | undefined;
    checkOut : Date | undefined;
    checkInAltitude? : string;
    checkInLongitude? : string;
    checkOutAltitude? : string;
    checkOutLongitude? : string;
    checkInPhoto? : string;
    checkOutPhoto? : string;
    hoursWorked : number;
    notes: string;
    status: AttendanceStatus;
    employee? : Employee;
    corrected? : boolean;
    correctedBy? : User;
    correctedAt? : Date | undefined;    
} & BaseEntity;

export type Shift = {
    code : string;
    name : string;
    description? : string;
    start : string;
    end : string;
    isFlexible : boolean;
} & BaseEntity;

export type ShiftAssignment = {
    id: string;
    notes?: string;
    employee: Employee; 
    shift: Shift; 
    effectiveDate: Date; 
    end?: Date; 
    status : 'active' | 'inactive';
} & BaseEntity;;
  
export type Overtime = {
    id?: string;
    name: string;
    code: string;
    employeeCode: string;
    start : Date | undefined;
    end : Date | undefined;
    days : number;
    notes: string;
    status: ApprovalStatus;
    jobGrade?: JobGrade;
    jobPosition?: JobPosition; 
    department?: Department; 
} & BaseEntity;

export type LeaveType = {
    code: string;
    name: string;
    eligibilityDays: number; 
    dayType: "full day" | "half day"; 
    deductedLeave: number;
    dayCount: "work day" | "calendar day"; 
    repeatPeriod: number; 
} & BaseEntity;    
  
export type LeaveRequest = {
    id?: string;
    name: string;
    code: string;
    employee?: Employee;
    start : Date | undefined;
    end : Date | undefined;
    days : number;
    notes: string;
    status: ApprovalStatus;
} & BaseEntity;

export type JobGrade = {
    id : string;
    code : string;
    name : string;
}

export type JobPosition = {
    id : string;
    code : string;
    name : string;
    departmentId : string;
    department : Department
}

export type Department = {
    id : string;
    code : string;
    name : string;
}

export type OrganizationUnit = {
    id : string;
    code : string;
    name : string;
}

export type Religion = {
    id : string;
    name : string;
}

export type TaxStatus = {
    id : string;
    code : string;
    name : string;
}

export type WorkLocation = {
    id : string;
    code : string;
    name : string;
}

export type EmploymentStatus = {
    id : string;
    code : string;
    name : string;
}

export type OutsourceVendor = {
    id : string;
    code : string;
    name : string;
}

export type TerminateReason = {
    id : string;
    name : string;
}

export type Employee = {
    id : string;
    code: string;
    name: string;

    /* Basic Information */
    email: string; 
    gender: 'male' | 'female';
    maritalStatus: MaritalStatus;
    address: string;
    state: string;
    city: string;
    district: string;
    idNumber: string;
    bankBranch?: string;
    bankAccount?: string;
    phoneNumber?: string;
    insuranceNumber?: string;
    taxNumber?: string;
    birthPlace: string;
    birthDate?: Date | undefined;
    joinDate?: Date | undefined;
    religion?: Religion;
    taxStatus?: TaxStatus; 

    /* Employment Data */
    resignation?: string;
    employmentStatus?: EmploymentStatus;
    outsourceVendor?: OutsourceVendor;
    terminateReason?: TerminateReason;
    jobGrade?: JobGrade;
    jobPosition?: JobPosition; 
    department?: Department; 
    workLocation?: WorkLocation; 
    organizationUnit?: OrganizationUnit; 
    status: 'active' | 'inactive';
    employmentStartDate? : Date | undefined;
    employmentEndDate? : Date | undefined;
    terminateDate? : Date | undefined;
} & BaseEntity;

