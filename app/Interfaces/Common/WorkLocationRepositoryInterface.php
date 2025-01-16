<?php

namespace App\Interfaces\Common;

interface WorkLocationRepositoryInterface
{
    public function get();
    public function find(int $id);
    public function create(array $data);
    public function update(int $id, array $data);
    public function delete(int $id);
    public function checkWorkLocationCode(string $search);
}
