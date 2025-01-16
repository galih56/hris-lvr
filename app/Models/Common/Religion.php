<?php

namespace App\Models\Common;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Religion extends Model
{
    protected $table = 'religions';
    public $timestamps = true;


    protected $fillable = [
        'code',
        'name',
    ];

    /**
     * Get all of the employees for the Employee
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class, 'religion_id');
    }
}
