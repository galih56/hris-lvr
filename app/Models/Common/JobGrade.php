<?php

namespace App\Models\Common;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JobGrade extends Model
{
    protected $table = 'job_grades';
    public $timestamps = true;


    protected $fillable = [
        'code',
        'name',
        'group_order',
    ];

    /**
     * Get all of the employees for the Employee
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class, 'job_grade_id');
    }
}
