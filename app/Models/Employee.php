<?php

namespace App\Models;

use App\Models\Common\Department;
use App\Models\Common\EmploymentStatus;
use App\Models\Common\JobGrade;
use App\Models\Common\JobPosition;
use App\Models\Common\OrganizationUnit;
use App\Models\Common\OutsourceVendor;
use App\Models\Common\Religion;
use App\Models\Common\TaxStatus;
use App\Models\Common\TerminateReason;
use App\Models\Common\WorkLocation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Employee extends Model
{
    protected $table = 'employees';
    public $timestamps = true;


    protected $fillable = [
        'code',
        'name',
        'email',
        'gender',
        'join_date',
        'birth_place',
        'birth_date',
        'id_number',
        'gender',
        'address',
        'state',
        'city',
        'district',
        'phone_number',
        'resignation',
        'bank_branch',
        'bank_account',
        'marital_status',
        'status', 
        'insurance_number',
        'tax_number',

        'employment_start_date',
        'employment_end_date',
        'terminate_date',
        'pension_date',
        'religion_id',
        'tax_status_id',
        'terminate_reason_id',
        'work_location_id',
        'job_grade_id',
        'employment_status_id',
        'organization_unit_id',
        'job_position_id',
        'outsource_vendor_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'code', 'username');
    }

    public function shiftAssignments()
    {
        return $this->hasManyThrough(Shift::class, 'shift_id');
    }

    public function employee(): HasMany
    {
        return $this->hasMany(Attendance::class, 'employee_id');
    }



    /* 
        Common Data [Predefined data]
    */  


    /**
     * Get the religion that owns the Employee
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function religion(): BelongsTo
    {
        return $this->belongsTo(Religion::class, 'religion_id');
    }
    
    /**
     * Get the taxStatus that owns the Employee
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function taxStatus(): BelongsTo
    {
        return $this->belongsTo(TaxStatus::class, 'tax_status_id');
    }

    /**
     * Get the workLocation that owns the Employee
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function workLocation(): BelongsTo
    {
        return $this->belongsTo(WorkLocation::class, 'work_location_id');
    }

    /**
     * Get the JobGrade that owns the Employee
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function jobGrade(): BelongsTo
    {
        return $this->belongsTo(JobGrade::class, 'job_grade_id');
    }

    /**
     * Get the employmentStatus that owns the Employee
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function employmentStatus(): BelongsTo
    {
        return $this->belongsTo(EmploymentStatus::class, 'employment_status_id');
    }

    /**
     * Get the OrganizationUnit that owns the Employee
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function OrganizationUnit(): BelongsTo
    {
        return $this->belongsTo(OrganizationUnit::class, 'organization_unit_id');
    }

    /**
     * Get the jobPosition that owns the Employee
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function jobPosition(): BelongsTo
    {
        return $this->belongsTo(JobPosition::class, 'job_position_id');
    }

    /**
     * Get the outsource Vendor that owns the Employee
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function outsourceVendor(): BelongsTo
    {
        return $this->belongsTo(OutsourceVendor::class, 'outsource_vendor_id');
    }

    /**
     * Get the terminateReason that owns the Employee
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function terminateReason(): BelongsTo
    {
        return $this->belongsTo(TerminateReason::class, 'terminate_reason_id');
    }
}
