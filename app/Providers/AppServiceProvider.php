<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;

use App\Interfaces\EmployeeRepositoryInterface;
use App\Repositories\EmployeeRepository;
use App\Repositories\ShiftRepository;
use App\Interfaces\ShiftRepositoryInterface;
use App\Interfaces\UserRepositoryInterface;
use App\Repositories\UserRepository;

use Illuminate\Support\Facades\Validator;
use App\Helpers\DateTimeHelper;
use App\Interfaces\AttendanceRepositoryInterface;
use App\Interfaces\Common\DepartmentRepositoryInterface;
use App\Interfaces\Common\EmploymentStatusRepositoryInterface;
use App\Interfaces\Common\JobGradeRepositoryInterface;
use App\Interfaces\Common\JobPositionRepositoryInterface;
use App\Interfaces\Common\OrganizationUnitRepositoryInterface;
use App\Interfaces\Common\OutsourceVendorRepositoryInterface;
use App\Interfaces\Common\ReligionRepositoryInterface;
use App\Interfaces\Common\TaxStatusRepositoryInterface;
use App\Interfaces\Common\TerminateReasonRepositoryInterface;
use App\Interfaces\Common\WorkLocationRepositoryInterface;
use App\Interfaces\LeaveRequestRepositoryInterface;
use App\Interfaces\ShiftAssignmentRepositoryInterface;
use App\Repositories\AttendanceRepository;
use App\Repositories\Common\DepartmentRepository;
use App\Repositories\Common\EmploymentStatusRepository;
use App\Repositories\Common\JobGradeRepository;
use App\Repositories\Common\JobPositionRepository;
use App\Repositories\Common\OrganizationUnitRepository;
use App\Repositories\Common\OutsourceVendorRepository;
use App\Repositories\Common\ReligionRepository;
use App\Repositories\Common\TaxStatusRepository;
use App\Repositories\Common\TerminateReasonRepository;
use App\Repositories\Common\WorkLocationRepository;
use App\Repositories\LeaveRequestRepository;
use App\Repositories\ShiftAssignmentRepository;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(EmployeeRepositoryInterface::class,EmployeeRepository::class);
        $this->app->bind(LeaveRequestRepositoryInterface::class,LeaveRequestRepository::class);
        $this->app->bind(AttendanceRepositoryInterface::class,AttendanceRepository::class);
        $this->app->bind(ShiftRepositoryInterface::class,ShiftRepository::class);
        $this->app->bind(ShiftAssignmentRepositoryInterface::class,ShiftAssignmentRepository::class);
        $this->app->bind(JobPositionRepositoryInterface::class,JobPositionRepository::class);
        $this->app->bind(JobGradeRepositoryInterface::class,JobGradeRepository::class);
        $this->app->bind(DepartmentRepositoryInterface::class,DepartmentRepository::class);
        $this->app->bind(OrganizationUnitRepositoryInterface::class,OrganizationUnitRepository::class);
        $this->app->bind(ReligionRepositoryInterface::class,ReligionRepository::class);
        $this->app->bind(WorkLocationRepositoryInterface::class,WorkLocationRepository::class);
        $this->app->bind(TerminateReasonRepositoryInterface::class,TerminateReasonRepository::class);
        $this->app->bind(TaxStatusRepositoryInterface::class,TaxStatusRepository::class);
        $this->app->bind(OutsourceVendorRepositoryInterface::class,OutsourceVendorRepository::class);
        $this->app->bind(EmploymentStatusRepositoryInterface::class,EmploymentStatusRepository::class);
        $this->app->bind(UserRepositoryInterface::class,UserRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191);
        RateLimiter::for('api', function ($request) {
            return Limit::perMinute(60)->by(optional($request->user())->id ?: $request->ip());
        });


        Validator::extend('multi_date_format', function ($attribute, $value, $parameters, $validator) {
            // Use DateTimeHelper to check the formats
            return DateTimeHelper::createDateTimeObject($value, $parameters) !== false;
        });

        Validator::replacer('multi_date_format', function ($message, $attribute, $rule, $parameters) {
            return 'The ' . $attribute . ' must match one of the following date-time formats: ' . implode(', ', $parameters) . '.';
        });
    }
}
