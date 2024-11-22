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

Route::get('/{any?}', [WebController::class, 'index']);
