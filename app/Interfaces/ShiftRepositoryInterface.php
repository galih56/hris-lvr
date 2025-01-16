<?php

namespace App\Interfaces;

interface ShiftRepositoryInterface extends RepositoryInterface
{
    public function searchShift(array $search);
}
