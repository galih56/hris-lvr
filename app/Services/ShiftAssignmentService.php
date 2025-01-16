<?php

namespace App\Services;

use App\Helpers\DatetimeHelper;
use App\Repositories\ShiftAssignmentRepository;
use App\Repositories\ShiftRepository;
use App\Repositories\EmployeeRepository;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Exception;
use Illuminate\Support\Facades\Auth;

class ShiftAssignmentService
{
    protected $shiftAssignmentRepository;
    protected $shiftRepository;
    protected $employeeRepository;

    public function __construct(
        ShiftAssignmentRepository $shiftAssignmentRepository,
        ShiftRepository $shiftRepository,
        EmployeeRepository $employeeRepository
    ) {
        $this->shiftAssignmentRepository = $shiftAssignmentRepository;
        $this->shiftRepository = $shiftRepository;
        $this->employeeRepository = $employeeRepository;
    }

    /**
     * Assign a shift to an employee.
     *
     * @param int $shiftId
     * @param int $employeeId
     * @param array $data
     * @return mixed
     * @throws Exception
     */
    public function assignShiftToEmployee(int $shiftId, int $employeeId, array $data)
    {
        DB::beginTransaction();

        try {
            // Ensure the shift and employee exist
            $shift = $this->shiftRepository->find($shiftId);
            $employee = $this->employeeRepository->find($employeeId);

            if (!$shift || !$employee) {
                throw new Exception("Shift or Employee not found.");
            }

            $data['shift_id'] = $shiftId;
            $data['employee_id'] = $employeeId;

            $effective_date = isset($data['effective_date']) ?  DatetimeHelper::createDateTimeObject($data['effective_date']) : false;
            $end = isset($data['end']) ?  DatetimeHelper::createDateTimeObject($data['end']) : false;
            if($effective_date) $data['effective_date'] = $effective_date->format('Y-m-d H:i:s');
            if($end) $data['end'] = $end->format('Y-m-d H:i:s');
                
            $shiftAssignment = $this->shiftAssignmentRepository->create($data);

            DB::commit();

            return $shiftAssignment;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Retrieve all shift assignments for an employee.
     *
     * @param int $employeeId
     * @return mixed
     */
    public function getActiveShiftAssignment()
    {
        $currentTime = Carbon::now();
        
        if(Auth::user()->hasRole('EMP')){
            if( Auth::user()->employee){
                return $this->shiftAssignmentRepository->getActiveShiftAssignment(Auth::user()->employee->id, $currentTime);
            }
        }

        return [];
    }

    /**
     * Retrieve all employees assigned to a specific shift.
     *
     * @param int $shiftId
     * @return mixed
     */
    public function getEmployeesByShift(int $shiftId)
    {
        return $this->shiftAssignmentRepository->find($shiftId);
    }

    /**
     * Delete a shift assignment.
     *
     * @param int $shiftAssignmentId
     * @return bool
     */
    public function deleteShiftAssignment(int $shiftAssignmentId)
    {
        return $this->shiftAssignmentRepository->delete($shiftAssignmentId);
    }

    /**
     * Update shift assignment notes.
     *
     * @param int $shiftAssignmentId
     * @param string $notes
     * @return mixed
     */
    public function updateNotes(int $shiftAssignmentId, string $notes)
    {
        return $this->shiftAssignmentRepository->update($shiftAssignmentId, ['notes' => $notes]);
    }
}
