<?php

namespace App\Models\Common;

use Illuminate\Database\Eloquent\Model;

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
     * Get all of the employees for the CostCenter
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class, 'terminate_reason_id');
    }
}
