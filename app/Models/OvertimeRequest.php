<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OvertimeRequest extends Model
{
    protected $table = 'overtime_requests';
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


    // public function type()
    // {
    //     return $this->belongsTo(OvertimeType::class, 'type_id');
    // }

    public function created_by()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

}
