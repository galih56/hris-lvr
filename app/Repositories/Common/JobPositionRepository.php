<?php
namespace App\Repositories\Common;

use App\Interfaces\Common\JobPositionRepositoryInterface;
use App\Interfaces\RepositoryInterface;
use App\Models\Common\JobPosition;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class JobPositionRepository extends BaseRepository
implements RepositoryInterface, JobPositionRepositoryInterface
{
    protected $related_data = [
    ];

    public function __construct(JobPosition $model)
    {
        parent::__construct($model);
    }

    public function getRelatedData()
    {
        return [
            'department:id,code,name', 
        ];
    }

    public function get(
        array $filters = [], 
        int $perPage = 0,
        array $sorts = [], 
        array $relations = []
    ): Collection|LengthAwarePaginator {
        $relations = empty($relations) ? $this->related_data : $relations;
   
        return parent::get($filters, $perPage, $sorts, $this->getRelatedData());
    }

    public function find(int $id) : JobPosition
    {
        $job_position = $this->model->find($id);
        return  $job_position;
    }

    public function create(array $data) : JobPosition
    {
        $data = $this->model->create($data);
        return $data;
    }

    public function update(int $id, array $data) : JobPosition
    {
        $job_position = $this->model->find($id);
        $job_position->update($data); 

        $job_position = $this->model->find($id);

        return $job_position; 
    }
    
    function checkJobPositionCode(string $search)
    {
        $job_position = $this->model->where('code', 'like', "$search")->first();
    
        if (!$job_position) {
            return [
                'status' => 'success',
                'data' => null,
                'message' => 'Job position code is safe to be used.'
            ];
        }

        return [
            'status' => 'error',
            'data' => $job_position,
            'message' => 'Job position code is already used'
        ];
    }
}