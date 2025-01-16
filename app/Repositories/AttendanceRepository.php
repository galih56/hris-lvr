<?php

namespace App\Repositories;

use App\Interfaces\AttendanceRepositoryInterface;
use App\Models\Attendance;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class AttendanceRepository extends BaseRepository implements AttendanceRepositoryInterface
{
    
    public function __construct(Attendance $model)
    {
        parent::__construct($model);
    }

    public function getRelatedData()
    {
        return [
            'employee' => function ($query) {
                $query->select('id', 'code', 'name', 'gender','job_position_id', 'job_grade_id')
                    ->with([
                        'workLocation:id,code,name',
                        'jobGrade:id,code,name',
                        'jobPosition' => function ($query) {
                            $query->select('id', 'code', 'name', 'department_id')
                                ->with('department:id,code,name');
                        },
                    ]);
            },
            'correctedBy'
        ];
    }
    
    public function getLastOpenAttendance(int $employeeId) : ?Attendance
    {
        return $this->model->where('employee_id', $employeeId)
                ->whereNull('check_out')
                ->where('check_in', '>=', Carbon::now()->subHours(24)) // Check within last 24 hours
                ->first();
    }

    public function getForEmployee($employeeId, array $filters = [], array $sorts = [], $perPage = 15): Collection | LengthAwarePaginator
    {
        return $this->getQuery($filters, $sorts, $this->getRelatedData())
            ->join('employees', 'attendances.employee_id', '=', 'employees.id')
            ->where('employees.id', $employeeId)
            ->paginate($perPage);
    }

    public function get(array $filters = [], int $perPage = 0, array $sorts = [], array $relations = []): Collection | LengthAwarePaginator
    {
        return parent::get($filters, $perPage, $sorts, $this->getRelatedData());
    }
    
    public function find(int $id): ?Attendance
    {
        return $this->model::with($this->getRelatedData())->find($id);
    }

    public function create(array $data): Attendance
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): Attendance
    {
        $attendance = $this->find($id);
        $attendance->update($data);
        $attendance = $this->model::with($this->getRelatedData())->find($id);
        return $attendance;
    }

    public function delete(int $id): bool
    {
        $attendance = $this->find($id);
        if (!$attendance) {
            throw new \Exception("Attendance record not found.");
        }
        return $attendance->delete();
    }
}
