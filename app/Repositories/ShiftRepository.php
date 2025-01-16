<?php

namespace App\Repositories;

use App\Interfaces\ShiftRepositoryInterface;
use App\Interfaces\RepositoryInterface;
use App\Models\Shift;
use Illuminate\Database\Eloquent\Collection;

class ShiftRepository extends BaseRepository
implements RepositoryInterface, ShiftRepositoryInterface
{
    protected $related_data = [];

    public function __construct(Shift $model)
    {
        parent::__construct($model);
    }
    /**
     * Retrieve shifts by employee ID.
     *
     * @param int $employeeId
     * @return Collection
     */
    public function findByEmployeeId(int $employeeId): Collection
    {
        return $this->model->where('employee_id', $employeeId)->get();
    }

    /**
     * Retrieve shifts within a date range.
     *
     * @param string $start
     * @param string $end
     * @return Collection
     */
    public function findByDateRange(string $start, string $end): Collection
    {
        return $this->model->whereBetween('start', [$start, $end])->get();
    }

    public function searchShift($filters){
        $query = $this->model->newQuery();
        $employees =  $this->applyFilters($query, $filters)
                            ->limit(5)
                            ->get();
        
        return $employees;
    }
}
