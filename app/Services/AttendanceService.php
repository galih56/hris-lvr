<?php

namespace App\Services;

use App\Interfaces\AttendanceRepositoryInterface;
use App\Interfaces\ShiftAssignmentRepositoryInterface;
use App\Interfaces\ShiftRepositoryInterface;
use App\Models\Attendance;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use Spatie\ImageOptimizer\OptimizerChainFactory;

class AttendanceService
{
    protected $attendanceRepository;
    protected $shiftAssignmentRepository;
    protected $shiftRepository;

    public function __construct(
        AttendanceRepositoryInterface $attendanceRepository,
        ShiftAssignmentRepositoryInterface $shiftAssignmentRepository,
        ShiftRepositoryInterface $shiftRepository
    ) {
        $this->attendanceRepository = $attendanceRepository;
        $this->shiftAssignmentRepository = $shiftAssignmentRepository;
        $this->shiftRepository = $shiftRepository;
    }

    public function recordAttendance(array $data, User $user): ?Attendance
    {
        $currentTime = Carbon::now();
    
        if (isset($data['photo'])) {
            $data['photo'] = $this->storePhoto($data['photo']);
        }
    
        $last_attendance = $this->attendanceRepository->getLastOpenAttendance($data['employee_id']);
        $active_shift_assignment = $this->shiftAssignmentRepository->getActiveShiftAssignment($data['employee_id'], $currentTime);
        if ($last_attendance) {
            return $this->attendanceRepository->update($last_attendance->id, [
                'check_out' => $currentTime,
                'check_out_latitude' => $data['check_out_latitude'] ?? null,
                'check_out_longitude' => $data['check_out_longitude'] ?? null,
                'check_out_photo' => $data['photo'] ?? null,
                'status' => 'present',
                'hours_worked' => Carbon::parse($last_attendance->check_in)->diffInHours($currentTime),
            ]);
        }
    
        $code = 'ATT' . ($user->employee ? "-" . $user->employee->code : "") . "-" . $currentTime->format("Ymd");
        return $this->attendanceRepository->create([
            'code' => $code,
            'employee_id' => $data['employee_id'],
            'check_in' => $currentTime,
            'check_in_latitude' => $data['check_in_latitude'] ?? null,
            'check_in_longitude' => $data['check_in_longitude'] ?? null,
            'check_in_photo' => $data['photo'] ?? null,
            'status' => 'present',
            'created_by' => $data['created_by'],
        ]);
    }
    

    /**
     * Handle photo upload, optimization, and storage.
     *
     * @param \Illuminate\Http\UploadedFile $photo
     * @return string|null
     */
    protected function storePhoto($photo): ?string
    {
        if ($photo instanceof \Illuminate\Http\UploadedFile && $photo->isValid()) {
            $filePath = $photo->store('attendance_photos', 'public');

            // Optimize the stored image
            $absolutePath = storage_path('app/public/' . $filePath);
            $optimizer = OptimizerChainFactory::create();
            $optimizer->optimize($absolutePath);

            return $filePath;
        }

        return null;
    }

    public function getAttendances(array $filters = [], int $perPage = 0, array $sorts = [], array $relations = [])
    {
        if(Auth::user()->hasRole('EMP')){
            if( Auth::user()->employee){
                return $this->attendanceRepository->getForEmployee(Auth::user()->employee->id,$filters,$sorts,$perPage);
            }
        }

        return $this->attendanceRepository->get($filters, $perPage, $sorts, $relations);
    }

    public function getAttendanceById(int $id): ?Attendance
    {
        return $this->attendanceRepository->find($id);
    }

    public function getLastOpenAttendance(): ?Attendance
    {
        $attendance = null;
        if( Auth::user()->employee){
            $attendance = $this->attendanceRepository->getLastOpenAttendance(Auth::user()->employee->id);
        }
        
        return $attendance;
    }
    
    public function updateAttendance(int $id, array $data): Attendance
    {
        $attendance = $this->attendanceRepository->find($id);

        if (!$attendance) {
            throw new ModelNotFoundException("Attendance record not found.");
        }
        $user = Auth::user();
        $data['corrected_by'] = $user->id;
        $data['corrected']=true;
        $data['corrected_at']=Carbon::now();
        return $this->attendanceRepository->update($id, $data);
    }

    public function deleteAttendance(int $id): bool
    {
        $attendance = $this->attendanceRepository->find($id);

        if (!$attendance) {
            throw new ModelNotFoundException("Attendance record not found.");
        }

        return $this->attendanceRepository->delete($id);
    }
}
