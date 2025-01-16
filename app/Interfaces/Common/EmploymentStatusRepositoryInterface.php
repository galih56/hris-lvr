<?php

namespace App\Interfaces\Common;

interface EmploymentStatusRepositoryInterface
{
    public function get();
    public function find(int $id);
    public function create(array $data);
    public function update(int $id, array $data);
    public function delete(int $id);
    public function checkEmploymentStatusCode(string $search);
}
