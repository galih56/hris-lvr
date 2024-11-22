<?php

namespace App\Models\Common;

use Illuminate\Database\Eloquent\Model;

class OutsourceVendor extends Model
{
    protected $table = 'outsource_vendors';
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
        return $this->hasMany(Employee::class, 'job_position_id');
    }
}
