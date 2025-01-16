<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    
    protected $table = 'attendances';
    public $timestamps = true;

    protected $fillable = [
        'id',
        'code',
        'employee_id',
        'shift_id',
        'notes',	
        'check_in',	
        'check_out',
        'hours_worked',	
        'check_in_latitude',
        'check_in_longitude',
        'check_out_latitude',
        'check_out_longitude',
        'check_in_photo',
        'check_out_photo',
        'status',	
        'created_by',
        'corrected',
        'corrected_by',
        'corrected_at',
        'created_at',
        'updated_at'	
    ];

    protected $casts = [
        'check_in' => 'datetime',
        'check_out' => 'datetime',
        'check_in_latitude' => 'float',
        'check_in_longitude' => 'float',
        'check_out_latitude' => 'float',
        'check_out_longitude' => 'float',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'employee_id');
    }
    

    public function correctedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'corrected_by');
    }

    public function shift(): BelongsTo
    {
        return $this->belongsTo(Shift::class, 'shift_id');
    }
}
