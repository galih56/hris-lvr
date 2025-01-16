<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Shift extends Model
{
    protected $table = 'shifts';
    public $timestamps = true;

    protected $fillable = ['name', 'start_time', 'end_time', 'is_flexible'];

    
    public function assignments() : HasManyThrough{
        return $this->hasManyThrough(Employee::class, 'employee_id');
    }

    public function attendances() : hasMany{
        return $this->hasMany(Attendance::class, 'shift_id');
    }
}
