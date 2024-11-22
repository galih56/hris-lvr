<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
        'employment_start_date',
        'employment_end_date',
        'terminate_date',
        'pension_date',
        'phone_number',
        'resignation',
        'bank_branch',
        'bank_account',
        'marital_status',
        'status',
        'insurance_number',
        'tax_number',

        'religion_id',
        'tax_status_id',
        'terminate_reason_id',
        'work_location_id',
        'directorate_id',
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



    /**
     * Get the religion that owns the Employee
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function religion(): BelongsTo
    {
        return $this->belongsTo(religion::class, 'religion_id');
    }




    /* 
        Common Data [Predefined data]
    */  

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

    public function directorate() : BelongsTo
    {
        return $this->belongsTo(Directorate::class, 'directorate_id');
    }

    /**
     * Get the jobGrade that owns the Employee
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function jobGrade(): BelongsTo
    {
        return $this->belongsTo(jobGrade::class, 'job_grade_is');
    }

    /**
     * Get the employmentStatus that owns the Employee
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function employmentStatus(): BelongsTo
    {
        return $this->belongsTo(employmentStatus::class, 'employment_status_id');
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
        return $this->belongsTo(User::class, 'job_position_id');
    }

    /**
     * Get the outsource Vendor that owns the Employee
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function outsourceVendor(): BelongsTo
    {
        return $this->belongsTo(outsourceVendor::class, 'outsource_vendor_id');
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
