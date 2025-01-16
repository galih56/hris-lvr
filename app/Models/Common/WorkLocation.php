<?php

namespace App\Models\Common;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WorkLocation extends Model
{
    protected $table = 'work_locations';
    public $timestamps = true;


    protected $fillable = [
        'name',
        'work_location_type_id'
    ];

    /**
     * Get the type that owns the TerminateReason
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function type(): BelongsTo
    {
        return $this->belongsTo(WorkLocationType::class, 'type_id');
    }

    /**
     * Get all of the employees for the Employee
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class, 'terminate_reason_id');
    }
}
