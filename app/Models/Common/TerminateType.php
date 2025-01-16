<?php

namespace App\Models\Common;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TerminateType extends Model
{
    protected $table = 'terminate_reason_type';
    public $timestamps = true;


    protected $fillable = [
        'code',
        'name',
    ];

    /**
     * Get all of the work locations for certain type
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function terminateReasons(): HasMany
    {
        return $this->hasMany(TerminateReason::class, 'type_id');
    }
}
