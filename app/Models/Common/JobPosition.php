<?php

namespace App\Models\Common;

use Illuminate\Database\Eloquent\Model;

class JobPosition extends Model
{
    protected $table = 'job_positions';
    public $timestamps = true;


    protected $fillable = [
        'code',
        'name',
        'job_status',
        'cost_center',
        'job_grade',
        'work_location',
        'organization_unit'
    ];

    /**
     * Get all of the employees for the CostCenter
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class, 'job_position_id');
    }
}
