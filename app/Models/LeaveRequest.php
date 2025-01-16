<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LeaveRequest extends Model
{
    
    protected $table = 'leave_requests';
    public $timestamps = true;


    protected $fillable = [
        'id',
        'code',
        'employee_id',
        'notes',	
        'start',	
        'end',	
        'status',
        'created_by',	
        'created_at',
        'updated_at'	

    ];

    public function leaveType() : BelongsTo{
        return $this->belongsTo(LeaveType::class, 'leave_type_id');
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'employee_id');
    }
    

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

}
