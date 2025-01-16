<?php

namespace App\Interfaces;

use App\Models\Attendance;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface AttendanceRepositoryInterface extends RepositoryInterface
{
   public function getForEmployee($employeeId, array $filters = [], array $sorts = [], $perPage = 15) :  Collection|LengthAwarePaginator;
   public function getLastOpenAttendance(int $employeeId) : ?Attendance;
}
