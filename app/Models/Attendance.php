<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    
    protected $table = 'attendances';
    public $timestamps = true;


    protected $fillable = [
        'id',
        'code',
        'employee_id',
        'notes',	
        'check_in',	
        'check_out',
        'hours_worked',	
        'status',	
        'created_by',
        'created_at',
        'updated_at'	

    ];
}
