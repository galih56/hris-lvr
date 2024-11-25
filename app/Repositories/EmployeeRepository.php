<?php

namespace App\Repositories;

use App\Models\Employee;
use App\Models\Common\Religion;
use App\Models\Common\Directorate;
use App\Models\Common\JobGrade;
use App\Models\Common\JobPosition;
use App\Models\Common\OrganizationUnit;
use App\Models\Common\OutsourceVendor;
use App\Models\Common\WorkLocation;
use App\Models\Common\TerminationType;
use App\Models\Common\EmploymentStatus;
use App\Interfaces\EmployeeRepositoryInterface;

class EmployeeRepository extends BaseRepository
implements EmployeeRepositoryInterface
{

    public function __construct(Employee $model)
    {
        parent::__construct($model);
    }

    public function getAll()
    {
        return $this->model->all();
    }

    public function find($id)
    {
        return $this->model->find($id);
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $employee = $this->model->find($id); 
        $employee->update($data); 
        return $employee; 
    }

    public function delete($id)
    {
        return $this->model->delete($id);
    }
    
    public function getReligions()
    {
        $data = Religion::all();
        return $data;
    }

    public function getMaritalStatuses()
    {
        $data = OrganizationUnit::all();
        return $data;
    }
    
    public function getDirectorates()
    {
        $data = Directorate::all();
        return $data;
    }

    public function getJobGrades()
    {
        $data = JobGrade::all();
        return $data;
    }

    public function getJobPositions()
    {
        $data = JobPosition::all();
        return $data;
    }

    public function getEmploymentStatuses()
    {
        $data = EmploymentStatus::all();
        return $data;
    }

    public function getOrganizationUnits()
    {
        $data = OrganizationUnit::all();
        return $data;
    }
    
    public function getWorkLocations()
    {
        $data = WorkLocation::all();
        return $data;
    }

}
