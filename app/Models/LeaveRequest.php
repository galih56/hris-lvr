<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeaveRequest extends Model
{
    
    protected $table = 'leave_request';
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

    public function created_by()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

}
