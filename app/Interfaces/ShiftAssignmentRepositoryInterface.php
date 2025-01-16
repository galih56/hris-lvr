<?php

namespace App\Interfaces;

use App\Models\ShiftAssignment;
use Illuminate\Database\Eloquent\Collection;

interface ShiftAssignmentRepositoryInterface extends RepositoryInterface
{
   /**
    * Retrieve active or flexible shift assignment by employee ID and date.
    *
    * @param int $employeeId
    * @param string $date
    * @return ShiftAssignment|null
    */
   public function getActiveShiftAssignment(int $employeeId, string $date): Collection;
}
