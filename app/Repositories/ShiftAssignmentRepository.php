<?php

namespace App\Repositories;

use App\Interfaces\RepositoryInterface;
use App\Interfaces\ShiftAssignmentRepositoryInterface;
use App\Models\ShiftAssignment;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class ShiftAssignmentRepository extends BaseRepository
implements RepositoryInterface, ShiftAssignmentRepositoryInterface
{
    protected $related_data = [];

    public function __construct(ShiftAssignment $model)
    {
        parent::__construct($model);
    }


    public function getRelatedData()
    {
        return [
            'employee', 'shift'
        ];
    }

    public function get(
        array $search = [], 
        int $perPage = 0,
        array $sorts = [], 
        array $relations = []
    ): Collection|LengthAwarePaginator {
        $relations = empty($relations) ? $this->getRelatedData() : $relations;
        return parent::get($search, $perPage, $sorts, $relations);
    }
    /**
     * Retrieve assignments by employee ID.
     *
     * @param int $employeeId
     * @return Collection
     */
    public function getByEmployeeId(int $employeeId): Collection
    {
        return $this->model->where('employee_id', $employeeId)->with('shift')->get();
    }

    /**
     * Retrieve assignments within a date range.
     *
     * @param string $startDate
     * @param string $endDate
     * @return Collection
     */
    public function getByDateRange(string $startDate, string $endDate): Collection
    {
        return $this->model->whereBetween('start_time', [$startDate, $endDate])->with('shift')->get();
    }

    /**
     * Retrieve active or flexible shift assignment by employee ID and date.
     *
     * @param int $employeeId
     * @param string $date
     * @return ShiftAssignment|null
     */
    public function getActiveShiftAssignment(int $employeeId, string $date): Collection
    {
        return $this->model->where('employee_id', $employeeId)
            ->whereHas('shift',function ($query) use ($date) {
                $query->where('effective_date', '<=', $date)
                      ->where('end', '>', $date)
                      ->orWhere('is_flexible', true);
            })
            ->get();
    }
}
