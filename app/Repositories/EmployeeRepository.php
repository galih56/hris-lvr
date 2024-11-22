<?php

namespace App\Repositories;

use App\Models\Employee;
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
}
