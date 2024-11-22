<?php

namespace App\Models\Common;

use Illuminate\Database\Eloquent\Model;

class TerminateReason extends Model
{
    protected $table = 'terminate_reasons';
    public $timestamps = true;


    protected $fillable = [
        'name',
        'terminate_type_id'
    ];

    /**
     * Get the type that owns the TerminateReason
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function type(): BelongsTo
    {
        return $this->belongsTo(TerminateType::class, 'type_id');
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
