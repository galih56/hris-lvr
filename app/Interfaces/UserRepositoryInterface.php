<?php

namespace App\Interfaces;

use App\Models\User;

interface UserRepositoryInterface extends RepositoryInterface
{
    public function getUserRoles();
    public function isEmployeeRegistered(string $employeeId): User | null;
}
