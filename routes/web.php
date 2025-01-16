<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\web\WebController;

Route::get('/auth/{any?}', [WebController::class, 'authApp'])->where('any', '.*')->name('auth');
Route::get('/{any?}', [WebController::class, 'index'])->where('any', '.*')->name('main-app');

Route::get('/import-test',[WebController::class , 'import_test']);
Route::post('/job_positions_import',[WebController::class , 'jobPositionsImport'])->name('job_positions.import');
Route::post('/employees_import',[WebController::class , 'employeesImport'])->name('employees.import');
