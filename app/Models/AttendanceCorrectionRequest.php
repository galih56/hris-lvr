<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttendanceCorrectionRequest extends Model
{
    use HasFactory;

    // Table associated with the model
    protected $table = 'attendance_correction_requests';

    // Fillable fields to allow mass assignment
    protected $fillable = [
        'attendance_id',
        'correction_type',
        'new_check_in',
        'new_check_out',
        'status',
        'reason'
    ];

    /**
     * Define the relationship with the Attendance model.
     */
    public function attendance()
    {
        return $this->belongsTo(Attendance::class);
    }


    /**
     * Define the relationship with the AttendanceCorrection model.
     */
    public function corrections() : HasMany
    {
        return $this->hasMany(AttendanceCorrection::class);
    }
}