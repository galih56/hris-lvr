<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShiftAssignment extends Model
{
    protected $table = 'shift_assignments';
    public $timestamps = true;

    protected $fillable = [
        'name', 'employee_id', 'shift_id', 
        'is_flexible', 'notes','status',
        'effective_date','end'
    ];
    
    public function shift() : BelongsTo {
        return $this->belongsTo(Shift::class, 'shift_id');
    }
    
    public function employee() : BelongsTo {
        return $this->belongsTo(Employee::class, 'employee_id');
    }
}
