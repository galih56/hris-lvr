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
        'status',
        'cost_center_id',
        'job_grade_id',
        'work_location_id',
        'organization_unit_id'
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
