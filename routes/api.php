<?php

use App\Http\Controllers\api\AttendanceController;
use App\Http\Controllers\api\EmployeeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\api\Common\DepartmentController;
use App\Http\Controllers\api\Common\EmploymentStatusController;
use App\Http\Controllers\api\Common\JobGradeController;
use App\Http\Controllers\api\Common\JobPositionController;
use App\Http\Controllers\api\Common\OrganizationUnitController;
use App\Http\Controllers\api\Common\OutsourceVendorController;
use App\Http\Controllers\api\Common\ReligionController;
use App\Http\Controllers\api\Common\TaxStatusController;
use App\Http\Controllers\api\Common\TerminateReasonController;
use App\Http\Controllers\api\Common\WorkLocationController;
use App\Http\Controllers\api\LeaveRequestController;
use App\Http\Controllers\api\ShiftController;
use App\Http\Controllers\api\ShiftAssignmentController;
use App\Http\Controllers\api\UserController;
use App\Models\Attendance;
use App\Models\LeaveRequest;

Route::group([ 
    "prefix" => "auth", 
    "as" => "authentication" 
], 
function(){
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::post('/me', [AuthController::class, 'me']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

Route::get('/check_employee_code/{name}', [EmployeeController::class, 'checkEmployeeCode']);
Route::group([
    "prefix" => "employees",
    'middleware' => 'auth:sanctum'
], function () {
    Route::group([
        'middleware' => ['role:ADMIN,HR','decode_id']
    ], function () {
        Route::get('/search', [EmployeeController::class, 'searchEmployee'])->name('employees.search');
        Route::get('/', [EmployeeController::class, 'index']);
        Route::post('/', [EmployeeController::class, 'store']);
        Route::get('/{id}', [EmployeeController::class, 'show']);
        Route::put('/{id}', [EmployeeController::class, 'update']);
        Route::patch('/{id}', [EmployeeController::class, 'update']);
        Route::delete('/{id}', [EmployeeController::class, 'destroy']);
    });
});


Route::group([
    "prefix" => "attendances",
    'middleware' => 'auth:sanctum'
], function () {
    Route::group([
        'middleware' => ['decode_id']
    ], function () {
        Route::post('/', [AttendanceController::class, 'store']);
        Route::get('/', [AttendanceController::class, 'index']);
        Route::get('/open-last', [AttendanceController::class, 'getLastOpenAttendance']);
        Route::get('/{id}', [AttendanceController::class, 'show']);
        
        Route::group([
            'middleware' => ['role:ADMIN,HR','decode_id']
        ], function () {
            Route::put('/{id}', [AttendanceController::class, 'update']);
            Route::patch('/{id}', [AttendanceController::class, 'update']);
            Route::delete('/{id}', [AttendanceController::class, 'destroy']);
        });
    });
});

Route::get('/leave_types', [LeaveRequestController::class, 'getLeaveTypes']);
Route::group([
    "prefix" => "leave_requests",
    'middleware' => 'auth:sanctum'
], function () {
    Route::group([
        'middleware' => ['decode_id']
    ], function () {
        Route::post('/', [LeaveRequestController::class, 'store']);
        Route::get('/', [LeaveRequestController::class, 'index']);
        Route::get('/{id}', [LeaveRequestController::class, 'show']);
    
        Route::group([
            'middleware' => ['role:ADMIN,HR','decode_id']
        ], function () {
            Route::put('/{id}', [LeaveRequestController::class, 'update']);
            Route::patch('/{id}', [LeaveRequestController::class, 'update']);
            Route::delete('/{id}', [LeaveRequestController::class, 'destroy']);
        });
    });
});
Route::group([
    "prefix" => "shifts",
    'middleware' => 'auth:sanctum'
], function () {
    
    Route::group([
        'middleware' => ['role:ADMIN,HR','decode_id']
    ], function () {
        Route::get('/search', [ShiftController::class, 'searchShift'])->name('employees.search');
        Route::get('/', [ShiftController::class, 'index']);
        Route::post('/', [ShiftController::class, 'store']);
        Route::get('/{id}', [ShiftController::class, 'show']);
        Route::put('/{id}', [ShiftController::class, 'update']);
        Route::patch('/{id}', [ShiftController::class, 'update']);
        Route::delete('/{id}', [ShiftController::class, 'destroy']);
    });
});

Route::group([
    "prefix" => "shift_assignments",
    'middleware' => 'auth:sanctum'
], function () {
    
    Route::get('/check', [ShiftAssignmentController::class, 'getActiveShiftAssignment']);
    Route::group([
        'middleware' => ['role:ADMIN,HR','decode_id']
    ], function () {
        Route::get('/', [ShiftAssignmentController::class, 'index']);
        Route::post('/', [ShiftAssignmentController::class, 'store']);
        Route::get('/{id}', [ShiftAssignmentController::class, 'show']);
        Route::put('/{id}', [ShiftAssignmentController::class, 'update']);
        Route::patch('/{id}', [ShiftAssignmentController::class, 'update']);
        Route::delete('/{id}', [ShiftAssignmentController::class, 'destroy']);
    });
});

Route::get('/user_roles', [UserController::class, 'getUserRoles']);

Route::get('/check_employee_user_account/{employee_id}', [UserController::class, 'checkUser'])->middleware(['decode_id:employee_id']);
Route::group([
    "prefix" => "users",
    'middleware' => 'auth:sanctum'
], function () {
    
    Route::group([
        'middleware' => ['role:ADMIN,HR','decode_id']
    ], function () {
        Route::get('/', [UserController::class, 'index']);
        Route::post('/', [UserController::class, 'store']);
        Route::get('/{id}', [UserController::class, 'show']);
        Route::put('/{id}', [UserController::class, 'update']);
        Route::patch('/{id}', [UserController::class, 'update']);
        Route::delete('/{id}', [UserController::class, 'destroy']);
    });
});

/* Common Data */
Route::group([
    "prefix" => "departments",
    'middleware' => 'auth:sanctum'
], function () {
    
    Route::group([
        'middleware' => ['role:ADMIN,HR','decode_id']
    ], function () {
        Route::get('/', [DepartmentController::class, 'index']);
        Route::post('/', [DepartmentController::class, 'store']);
        Route::get('/{id}', [DepartmentController::class, 'show']);
        Route::put('/{id}', [DepartmentController::class, 'update']);
        Route::patch('/{id}', [DepartmentController::class, 'update']);
        Route::delete('/{id}', [DepartmentController::class, 'destroy']);
    });
});

Route::group([
    "prefix" => "religions",
    'middleware' => 'auth:sanctum'
], function () {
    
    Route::group([
        'middleware' => ['role:ADMIN,HR','decode_id']
    ], function () {
        Route::get('/', [ReligionController::class, 'index']);
        Route::post('/', [ReligionController::class, 'store']);
        Route::get('/{id}', [ReligionController::class, 'show']);
        Route::put('/{id}', [ReligionController::class, 'update']);
        Route::patch('/{id}', [ReligionController::class, 'update']);
        Route::delete('/{id}', [ReligionController::class, 'destroy']);
    });
});

Route::group([
    "prefix" => "job_positions",
    'middleware' => 'auth:sanctum'
], function () {
    
    Route::group([
        'middleware' => ['role:ADMIN,HR','decode_id']
    ], function () {
        Route::get('/', [JobPositionController::class, 'index']);
        Route::post('/', [JobPositionController::class, 'store']);
        Route::get('/{id}', [JobPositionController::class, 'show']);
        Route::put('/{id}', [JobPositionController::class, 'update']);
        Route::patch('/{id}', [JobPositionController::class, 'update']);
        Route::delete('/{id}', [JobPositionController::class, 'destroy']);
    });
});


Route::group([
    "prefix" => "work_locations",
    'middleware' => 'auth:sanctum'
], function () {
    
    Route::group([
        'middleware' => ['role:ADMIN,HR','decode_id']
    ], function () {
        Route::get('/', [WorkLocationController::class, 'index']);
        Route::post('/', [WorkLocationController::class, 'store']);
        Route::get('/{id}', [WorkLocationController::class, 'show']);
        Route::put('/{id}', [WorkLocationController::class, 'update']);
        Route::patch('/{id}', [WorkLocationController::class, 'update']);
        Route::delete('/{id}', [WorkLocationController::class, 'destroy']);
    });
});

Route::group([
    "prefix" => "tax_statuses",
    'middleware' => 'auth:sanctum'
], function () {
    
    Route::group([
        'middleware' => ['role:ADMIN,HR','decode_id']
    ], function () {
        Route::get('/', [TaxStatusController::class, 'index']);
        Route::post('/', [TaxStatusController::class, 'store']);
        Route::get('/{id}', [TaxStatusController::class, 'show']);
        Route::put('/{id}', [TaxStatusController::class, 'update']);
        Route::patch('/{id}', [TaxStatusController::class, 'update']);
        Route::delete('/{id}', [TaxStatusController::class, 'destroy']);
    });
});


Route::group([
    "prefix" => "job_grades",
    'middleware' => 'auth:sanctum'
], function () {
    
    Route::group([
        'middleware' => ['role:ADMIN,HR','decode_id']
    ], function () {
        Route::get('/', [JobGradeController::class, 'index']);
        Route::post('/', [JobGradeController::class, 'store']);
        Route::get('/{id}', [JobGradeController::class, 'show']);
        Route::put('/{id}', [JobGradeController::class, 'update']);
        Route::patch('/{id}', [JobGradeController::class, 'update']);
        Route::delete('/{id}', [JobGradeController::class, 'destroy']);
    });
});

Route::group([
    "prefix" => "employment_statuses",
    'middleware' => 'auth:sanctum'
], function () {
    
    Route::group([
        'middleware' => ['role:ADMIN,HR','decode_id']
    ], function () {
        Route::get('/', [EmploymentStatusController::class, 'index']);
        Route::post('/', [EmploymentStatusController::class, 'store']);
        Route::get('/{id}', [EmploymentStatusController::class, 'show']);
        Route::put('/{id}', [EmploymentStatusController::class, 'update']);
        Route::patch('/{id}', [EmploymentStatusController::class, 'update']);
        Route::delete('/{id}', [EmploymentStatusController::class, 'destroy']);
    });
});

Route::group([
    "prefix" => "organization_units",
    'middleware' => 'auth:sanctum'
], function () {
    
    Route::group([
        'middleware' => ['role:ADMIN,HR','decode_id']
    ], function () {
        Route::get('/', [OrganizationUnitController::class, 'index']);
        Route::post('/', [OrganizationUnitController::class, 'store']);
        Route::get('/{id}', [OrganizationUnitController::class, 'show']);
        Route::put('/{id}', [OrganizationUnitController::class, 'update']);
        Route::patch('/{id}', [OrganizationUnitController::class, 'update']);
        Route::delete('/{id}', [OrganizationUnitController::class, 'destroy']);
    });
});

Route::group([
    "prefix" => "outsource_vendors",
    'middleware' => 'auth:sanctum'
], function () {
    
    Route::group([
        'middleware' => ['role:ADMIN,HR','decode_id']
    ], function () {
        Route::get('/', [OutsourceVendorController::class, 'index']);
        Route::post('/', [OutsourceVendorController::class, 'store']);
        Route::get('/{id}', [OutsourceVendorController::class, 'show']);
        Route::put('/{id}', [OutsourceVendorController::class, 'update']);
        Route::patch('/{id}', [OutsourceVendorController::class, 'update']);
        Route::delete('/{id}', [OutsourceVendorController::class, 'destroy']);
    });
});

Route::group([
    "prefix" => "terminate_reasons",
    'middleware' => 'auth:sanctum'
], function () {
    
    Route::group([
        'middleware' => ['role:ADMIN,HR','decode_id']
    ], function () {
        Route::get('/', [TerminateReasonController::class, 'index']);
        Route::post('/', [TerminateReasonController::class, 'store']);
        Route::get('/{id}', [TerminateReasonController::class, 'show']);
        Route::put('/{id}', [TerminateReasonController::class, 'update']);
        Route::patch('/{id}', [TerminateReasonController::class, 'update']);
        Route::delete('/{id}', [TerminateReasonController::class, 'destroy']);
    });
});