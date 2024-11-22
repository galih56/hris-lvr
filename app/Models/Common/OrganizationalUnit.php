<?php

namespace App\Models\Common;

use Illuminate\Database\Eloquent\Model;

class OrganizationUnit extends Model
{
    protected $table = 'organization_units';
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
        return $this->hasMany(Employee::class, 'organization_unit_id');
    }
}
