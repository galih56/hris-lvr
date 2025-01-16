<?php
namespace App\Repositories\Common;

use App\Interfaces\Common\OrganizationUnitRepositoryInterface;
use App\Interfaces\RepositoryInterface;
use App\Models\Common\OrganizationUnit;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class OrganizationUnitRepository extends BaseRepository
implements RepositoryInterface, OrganizationUnitRepositoryInterface
{
    protected $related_data = [
    ];

    public function __construct(OrganizationUnit $model)
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

    public function find(int $id) : OrganizationUnit
    {
        $department = $this->model->find($id);
        return  $department;
    }

    public function create(array $data)
    {
        $data = $this->model->create($data);
        return $data;
    }

    public function update(int $id, array $data) : OrganizationUnit
    {
        $department = $this->model->find($id);
        $department->update($data); 

        $department = $this->model->find($id);

        return $department; 
    }

    function checkOrganizationUnitCode(string $search)
    {
        $organization_unit = $this->model->where('code', 'like', "$search")->first();
    
        if (!$organization_unit) {
            return [
                'status' => 'success',
                'data' => null,
                'message' => 'Organization unit code is safe to be used.'
            ];
        }

        return [
            'status' => 'error',
            'data' => $organization_unit,
            'message' => 'Organization unit code is already used'
        ];
    }
}