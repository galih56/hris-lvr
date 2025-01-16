<?php
namespace App\Enums;

enum AttendanceStatus: string {
    case PRESENT = 'present';
    case ABSENT = 'absent';
    case LEAVE = 'leave';
}