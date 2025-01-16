<?php

namespace App\Interfaces\Common;

interface OrganizationUnitRepositoryInterface
{
    public function get();
    public function find(int $id);
    public function create(array $data);
    public function update(int $id, array $data);
    public function delete(int $id);
    public function checkOrganizationUnitCode(string $search);
}
