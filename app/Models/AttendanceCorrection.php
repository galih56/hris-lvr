<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttendanceCorrection extends Model
{
    use HasFactory;

    // Table associated with the model
    protected $table = 'attendance_corrections';

    // Fillable fields to allow mass assignment
    protected $fillable = [
        'attendance_id',
        'corrected_check_in',
        'corrected_check_out',
        'correction_notes'
    ];

    /**
     * Define the relationship with the Attendance model.
     */
    public function attendance()
    {
        return $this->belongsTo(Attendance::class);
    }
    
    public function request()
    {
        return $this->belongsTo(AttendanceCorrectionRequest::class,'request_id');
    }
}
