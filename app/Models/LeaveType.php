<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LeaveType extends Model
{
    protected $table = 'leave_types';
    public $timestamps = true;


    protected $fillable = [
        'id',
        'code',
        'name',	
        'created_at',
        'updated_at'	

    ];


    public function leaveRequests(): HasMany
    {
        return $this->hasMany(LeaveRequest::class, 'leave_type_id');
    }
    
}
