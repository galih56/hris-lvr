<?php
namespace App\Repositories\Common;

use App\Interfaces\Common\EmploymentStatusRepositoryInterface;
use App\Interfaces\RepositoryInterface;
use App\Models\Common\EmploymentStatus;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class EmploymentStatusRepository extends BaseRepository
implements RepositoryInterface, EmploymentStatusRepositoryInterface
{
    protected $related_data = [
    ];

    public function __construct(EmploymentStatus $model)
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

    public function find(int $id) : ?EmploymentStatus
    {
        $employment_status = $this->model->find($id);
        return  $employment_status;
    }

    public function create(array $data)
    {
        $data = $this->model->create($data);
        return $data;
    }

    public function update(int $id, array $data) : EmploymentStatus
    {
        $employment_status = $this->model->find($id);
        $employment_status->update($data); 

        $employment_status = $this->model->find($id);

        return $employment_status; 
    }

    function checkEmploymentStatusCode(string $search)
    {
        $employment_status = $this->model->where('code', 'like', "$search")->first();
    
        if (!$employment_status) {
            return [
                'status' => 'success',
                'data' => null,
                'message' => 'Employment Status code is safe to be used.'
            ];
        }

        return [
            'status' => 'error',
            'data' => $employment_status,
            'message' => 'Employment Status code is already used'
        ];
    }
}