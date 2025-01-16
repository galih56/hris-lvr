<?php

namespace App\Models\Common;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    public function department() : BelongsTo
    {
        return $this->belongsTo(Department::class, 'department_id');
    }
    
    /**
     * Get all of the employees for the Employee
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class, 'job_position_id');
    }
}
