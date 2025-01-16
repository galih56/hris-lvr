<?php

namespace App\Repositories;

use App\Interfaces\LeaveRequestRepositoryInterface;
use App\Models\LeaveRequest;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class LeaveRequestRepository extends BaseRepository implements LeaveRequestRepositoryInterface
{
    
    public function __construct(LeaveRequest $model)
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
            'createdBy'
        ];
    }

    public function get(array $filters = [], int $perPage = 0, array $sorts = [], array $relations = []): Collection | LengthAwarePaginator
    {
        return parent::get($filters, $perPage, $sorts, $this->getRelatedData());
    }
    
    public function find(int $id): ?LeaveRequest
    {
        return $this->model::with($this->getRelatedData())->find($id);
    }

    public function create(array $data): LeaveRequest
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): LeaveRequest
    {
        $leave_request = $this->find($id);
        $leave_request->update($data);
        $leave_request = $this->model::with($this->getRelatedData())->find($id);
        return $leave_request;
    }

    public function delete(int $id): bool
    {
        $leave_request = $this->find($id);
        if (!$leave_request) {
            throw new \Exception("Leave Request record not found.");
        }
        return $leave_request->delete();
    }
}
