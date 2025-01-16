<?php

namespace App\Models\Common;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
