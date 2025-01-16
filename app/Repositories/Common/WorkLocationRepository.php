<?php
namespace App\Repositories\Common;

use App\Interfaces\Common\WorkLocationRepositoryInterface;
use App\Interfaces\RepositoryInterface;
use App\Models\Common\WorkLocation;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class WorkLocationRepository extends BaseRepository
implements RepositoryInterface, WorkLocationRepositoryInterface
{
    protected $related_data = [
    ];

    public function __construct(WorkLocation $model)
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

    public function find(int $id) : WorkLocation
    {
        $work_location = $this->model->find($id);
        return  $work_location;
    }

    public function create(array $data)
    {
        $data = $this->model->create($data);
        return $data;
    }

    public function update(int $id, array $data) : WorkLocation
    {
        $work_location = $this->model->find($id);
        $work_location->update($data); 

        $work_location = $this->model->find($id);

        return $work_location; 
    }

    function checkWorkLocationCode(string $search)
    {
        $work_location = $this->model->where('code', 'like', "$search")->first();
    
        if (!$work_location) {
            return [
                'status' => 'success',
                'data' => null,
                'message' => 'Work location code is safe to be used.'
            ];
        }

        return [
            'status' => 'error',
            'data' => $work_location,
            'message' => 'Work location code is already used'
        ];
    }
}