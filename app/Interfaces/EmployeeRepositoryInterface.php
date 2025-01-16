<?php

namespace App\Interfaces;

interface EmployeeRepositoryInterface extends RepositoryInterface
{ 
    public function checkEmployeeCode(string $search);
    public function searchEmployee(array $search);
    public function updateEmployeeStatus($id, array $data);
}
