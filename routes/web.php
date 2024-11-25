<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\web\WebController;

Route::get('/', [WebController::class, 'index'])->name('index');
Route::get('/auth/{any?}', [WebController::class, 'authApp'])->where('any', '.*')->name('auth');
Route::middleware('auth:sanctum')->group(function () {
    Route::middleware(['role:emp'])->group(function () {
        Route::get('/employees/{any?}', [WebController::class, 'employeeServicesApp'])->where('any', '.*')->name('employee');
    });
    
    Route::middleware(['role:admin'])->group(function () {
        Route::get('/hris/{any?}', [WebController::class, 'hrisApp'])->where('any', '.*')->name('hris');
    });
});
Route::get('/import-test',[WebController::class , 'import_test']);
Route::post('/job_positions_import',[WebController::class , 'jobPositionsImport'])->name('job_positions.import');
Route::post('/employees_import',[WebController::class , 'employeesImport'])->name('employees.import');
Route::get('/{any?}', [WebController::class, 'index']);
