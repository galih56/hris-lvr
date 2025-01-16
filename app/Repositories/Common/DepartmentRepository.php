<?php
namespace App\Repositories\Common;

use App\Interfaces\Common\DepartmentRepositoryInterface;
use App\Interfaces\RepositoryInterface;
use App\Models\Common\Department;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class DepartmentRepository extends BaseRepository
implements RepositoryInterface, DepartmentRepositoryInterface
{
    protected $related_data = [
    ];

    public function __construct(Department $model)
    {
        parent::__construct($model);
    }

    public function get(
        array $filters = [], 
        int $perPage = 0,
        array $sorts = [], 
        array $relations = []
    ): Collection|LengthAwarePaginator {
        $relations = empty($relations) ? $this->related_data : $relations;
   
        return parent::get($filters, $perPage, $sorts, $relations);
    }

    public function find(int $id) : ?Department
    {
        $department = $this->model->find($id);
        return  $department;
    }

    public function create(array $data)
    {
        $data = $this->model->create($data);
        return $data;
    }

    public function update(int $id, array $data) : Department
    {
        $department = $this->model->find($id);
        $department->update($data); 

        $department = $this->model->find($id);

        return $department; 
    }

    function checkDepartmentCode(string $search)
    {
        $department = $this->model
            ->where('code', 'like', "$search")->first();
    
        if (!$department) {
            return [
                'status' => 'success',
                'data' => null,
                'message' => 'Department code is safe to be used.'
            ];
        }

        return [
            'status' => 'error',
            'data' => $department,
            'message' => 'Department code is already used'
        ];
    }

}