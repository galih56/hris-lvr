<?php

namespace App\Models\Common;

use Illuminate\Database\Eloquent\Model;

class CostCenter extends Model
{
    
    protected $table = 'cost_centers';
    public $timestamps = true;


    protected $fillable = [
        'code',
        'name',
    ];

    /**
     * Get all of the employees for the CostCenter
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class, 'cost_center_id');
    }
}
