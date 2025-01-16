<?php

namespace App\Services;

use App\Interfaces\LeaveRequestRepositoryInterface;
use App\Models\LeaveRequest;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;

class LeaveRequestService
{
    protected $leaveRequestRepository;
    protected $shiftAssignmentRepository;
    protected $shiftRepository;

    public function __construct(
        LeaveRequestRepositoryInterface $leaveRequestRepository,
    ) {
        $this->leaveRequestRepository = $leaveRequestRepository;
    }


    public function recordLeaveRequest(array $data, User $user): ?LeaveRequest
    {
        $currentTime = Carbon::now();
        $code = 'LR' . ($user->employee ? "-" . $user->employee->code : "") . "-" . $currentTime->format("Ymd");
        return $this->leaveRequestRepository->create([
            'code' => $code,
            'employee_id' => $data['employee_id'],
            'start' => $data['start'],
            'end' => $data['end'],
            'status' => 'present',
            'created_by' => $data['created_by'],
        ]);
    }
    public function getLeaveRequests(array $filters = [], int $perPage = 0, array $sorts = [], array $relations = [])
    {
        return $this->leaveRequestRepository->get($filters, $perPage, $sorts, $relations);
    }

    public function getLeaveRequestById(int $id): ?LeaveRequest
    {
        return $this->leaveRequestRepository->find($id);
    }

    public function updateLeaveRequest(int $id, array $data): LeaveRequest
    {
        $leave_request = $this->leaveRequestRepository->find($id);

        if (!$leave_request) {
            throw new ModelNotFoundException("Leave Request record not found.");
        }
        $user = Auth::user();
        $data['created_by'] = $user->id;
        $data['created']=true;
        $data['created_at']=Carbon::now();
        return $this->leaveRequestRepository->update($id, $data);
    }

    public function deleteLeaveRequest(int $id): bool
    {
        $leave_request = $this->leaveRequestRepository->find($id);

        if (!$leave_request) {
            throw new ModelNotFoundException("Leave Request record not found.");
        }

        return $this->leaveRequestRepository->delete($id);
    }
}
