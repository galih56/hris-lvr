<?php

use App\Http\Controllers\api\EmployeeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\AuthController;

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

Route::get('/check_employee_code/{name}', [EmployeeController::class, 'checkProjectName']);
Route::group([
    "prefix" => "employees",
    'middleware' => 'auth:sanctum'
], function () {
    
    Route::group([
        'middleware' => ['role:admin','decode_id']
    ], function () {
        Route::get('/', [EmployeeController::class, 'index']);
        Route::post('/', [EmployeeController::class, 'store']);
        Route::get('/{id}', [EmployeeController::class, 'show']);
        Route::put('/{id}', [EmployeeController::class, 'update']);
        Route::patch('/{id}', [EmployeeController::class, 'update']);
        Route::delete('/{id}', [EmployeeController::class, 'destroy']);
    });
});


Route::group([
    "prefix" => "employees",
    'middleware' => 'auth:sanctum'
], function () {
    
    Route::group([
        'middleware' => ['role:admin','decode_id']
    ], function () {
        Route::get('/', [EmployeeController::class, 'index']);
        Route::post('/', [EmployeeController::class, 'store']);
        Route::get('/{id}', [EmployeeController::class, 'show']);
        Route::put('/{id}', [EmployeeController::class, 'update']);
        Route::patch('/{id}', [EmployeeController::class, 'update']);
        Route::delete('/{id}', [EmployeeController::class, 'destroy']);
    });
});



Route::get('/marital_statuses', [EmployeeController::class, 'getMaritalStatuses']);
Route::get('/religions', [EmployeeController::class, 'getReligions']);
Route::get('/directorates', [EmployeeController::class, 'getDirectorates']);
Route::get('/job_positions', [EmployeeController::class, 'getJobPositions']);
Route::get('/work_locations', [EmployeeController::class, 'getWorkLocations']);
Route::get('/job_grades', [EmployeeController::class, 'getJobGrades']);
Route::get('/employment_statuses', [EmployeeController::class, 'getEmploymentStatuses']);
Route::get('/organization_units', [EmployeeController::class, 'getOrganizationUnits']);