<?php

namespace App\Models\Common;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WorkLocationType extends Model
{
    protected $table = 'work_location_types';
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
    public function workLocations(): HasMany
    {
        return $this->hasMany(WorkLocation::class, 'type_id');
    }
}
