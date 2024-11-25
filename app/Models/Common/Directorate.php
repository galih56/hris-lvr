<?php

namespace App\Models\Common;

use Illuminate\Database\Eloquent\Model;

class Directorate extends Model
{
    
    protected $table = 'directorates';
    public $timestamps = true;


    protected $fillable = [
        'code',
        'name',
    ];

    /**
     * Get all of the employees for the Directorate
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class, 'directorate_id');
    }
}