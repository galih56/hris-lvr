<?php

namespace App\Repositories;

use App\Helpers\DatetimeHelper;
use App\Models\Employee;
use App\Models\Common\EmploymentStatus;
use App\Interfaces\EmployeeRepositoryInterface;
use App\Interfaces\RepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Services\EmployeeCodeService;
use Illuminate\Database\Eloquent\Builder;

class EmployeeRepository extends BaseRepository
implements RepositoryInterface, EmployeeRepositoryInterface
{
    public function __construct(Employee $model)
    {
        parent::__construct($model);
    }


    public function getRelatedData()
    {
        return [
            'religion:id,name', 'taxStatus:id,code,name', 'terminateReason',
            'employmentStatus:id,code,name', 'workLocation:id,code,name',
            'organizationUnit:id,code,name', 'jobGrade:id,code,name',
            'jobPosition' => function ($query) {
                $query->select('id', 'code', 'name', 'department_id')
                    ->with('department:id,code,name');
            },
            'outsourceVendor:id,name'
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

    public function getQuery(array $search = [], array $relations = [],  array $sorts = []): Builder
    {
        $relations = empty($relations) ? $this->getRelatedData() : $relations;
        return parent::getQuery($search, $relations, $sorts);
    }

    public function find($id) : ?Employee
    {
        $employee = $this->model::with($this->getRelatedData())->find($id);
        return  $employee;
    }

    public function create(array $data)
    {
        $employment_status = EmploymentStatus::find($data['employment_status_id']);

        if(isset($data['employment_dates'])){
            if(isset($data['employment_dates']['employment_start_date'])) $data['employment_start_date'] = $data['employment_dates']['employment_start_date'];
            if(isset($data['employment_dates']['employment_end_date'])) $data['employment_end_date'] = $data['employment_dates']['employment_end_date'];
            unset($data['employment_dates']);
        } 

        
        $birth_date = isset($data['birth_date']) ?  DatetimeHelper::createDateTimeObject($data['birth_date']) : false;
        $join_date = isset($data['join_date']) ?  DatetimeHelper::createDateTimeObject($data['join_date']) : false;
        $employment_start_date = isset($data['employment_start_date']) ?  DatetimeHelper::createDateTimeObject($data['employment_start_date']) : false;
        $employment_end_date = isset($data['employment_end_date']) ?  DatetimeHelper::createDateTimeObject($data['employment_start_date']) : false;
        $pension_date = isset($data['pension_date']) ?  DatetimeHelper::createDateTimeObject($data['pension_date']) : false;

        $employee_code = EmployeeCodeService::generateEmployeeCode($join_date,$employment_status->employee_code);
        $data['code'] = $employee_code;


        if($birth_date) $data['birth_date'] = $birth_date->format('Y-m-d H:i:s');
        if($join_date) $data['join_date'] = $join_date->format('Y-m-d H:i:s');
        if($employment_start_date) $data['employment_start_date'] = $employment_start_date->format('Y-m-d H:i:s');
        if($employment_end_date) $data['employment_end_date'] = $employment_end_date->format('Y-m-d H:i:s');
        if($pension_date) $data['pension_date'] = $pension_date->format('Y-m-d H:i:s');
        
        $data['status'] = 'active';
        $data = $this->model->create($data);
        $employee = $this->model::with($this->getRelatedData())->find($data->id);
        return $employee;
    }

    public function update(int $id, array $data) : Employee
    {
        $employee = $this->model->find($id);

        if(isset($data['employment_dates'])){
            if(isset($data['employment_dates']['employment_start_date'])) $data['employment_start_date'] = $data['employment_dates']['employment_start_date'];
            if(isset($data['employment_dates']['employment_end_date'])) $data['employment_end_date'] = $data['employment_dates']['employment_end_date'];
            unset($data['employment_dates']);
        } 
        $birth_date = isset($data['birth_date']) ?  DatetimeHelper::createDateTimeObject($data['birth_date']) : false;
        $join_date = isset($data['join_date']) ?  DatetimeHelper::createDateTimeObject($data['join_date']) : false;
        $employment_start_date = isset($data['employment_start_date']) ?  DatetimeHelper::createDateTimeObject($data['employment_start_date']) : false;
        $employment_end_date = isset($data['employment_end_date']) ?  DatetimeHelper::createDateTimeObject($data['employment_end_date']) : false;
        $pension_date = isset($data['pension_date']) ?  DatetimeHelper::createDateTimeObject($data['pension_date']) : false;
        $terminate_date = isset($data['terminate_date']) ?  DatetimeHelper::createDateTimeObject($data['terminate_date']) : false;

        if($birth_date) $data['birth_date'] = $birth_date->format('Y-m-d H:i:s');
        if($join_date) $data['join_date'] = $join_date->format('Y-m-d H:i:s');
        if($employment_start_date) $data['employment_start_date'] = $employment_start_date->format('Y-m-d H:i:s');
        if($employment_end_date) $data['employment_end_date'] = $employment_end_date->format('Y-m-d H:i:s');
        if($pension_date) $data['pension_date'] = $pension_date->format('Y-m-d H:i:s');
        if($terminate_date) $data['terminate_date'] = $terminate_date->format('Y-m-d H:i:s');
        
        $employee->update($data); 

        $employee = $this->model::with($this->getRelatedData())->find($id);

        return $employee; 
    }

    public function updateEmployeeStatus($id, array $data)
    {
        $employee = $this->model->find($id);
        $employee->status = $data['status'];
        $employee->resignation = $data['resignation'];
        $employee->terminate_reason_id = $data['terminate_reason_id'];
        $employee->save();

        $employee = $this->model::with($this->getRelatedData())->find($id);
        return $employee;
    }

    public function searchEmployee($filters){
        $query = $this->model->newQuery();
        $employees =  $this->applyFilters($query, $filters)
                            ->where('status', 'active')
                            ->with([
                                'employmentStatus:id,code,name', 'workLocation:id,code,name',
                                'organizationUnit:id,code,name', 'jobGrade:id,code,name',
                                'jobPosition:id,code,name', 'jobPosition.department:id,code,name'
                            ])
                            ->limit(5)
                            ->get();
        
        return $employees;
    }

    public function checkEmployeeCode(string $search)
    {
        // Find the first active employee matching the search
        $employee = $this->model
            ->where('code', 'like', "$search")
            ->where('status', 'active')
            ->first();
    
        if (!$employee) {
            return [
                'status' => 'no_employee',
                'data' => null,
                'message' => 'No employee found matching the provided code.'
            ];
        }
    
        // Check if the employee has an associated user
        $hasUser = $employee->user !== null;
    
        return [
            'status' => 'success',
            'data' => $employee,
            'message' => $hasUser
                ? 'The employee has been registered'
                : 'The employee does not have an associated user record.'
        ];
    }

}
