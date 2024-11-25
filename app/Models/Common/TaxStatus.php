<?php

namespace App\Models\Common;

use Illuminate\Database\Eloquent\Model;

class TaxStatus extends Model
{
    protected $table = 'tax_statuses';
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
        return $this->hasMany(Employee::class, 'tax_status_id');
    }
}
