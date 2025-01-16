<?php
namespace App\Repositories\Common;

use App\Interfaces\Common\ReligionRepositoryInterface;
use App\Interfaces\RepositoryInterface;
use App\Models\Common\Religion;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class ReligionRepository extends BaseRepository
implements RepositoryInterface, ReligionRepositoryInterface
{
    protected $related_data = [
    ];

    public function __construct(Religion $model)
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

    public function find(int $id) : ?Religion
    {
        $religion = $this->model->find($id);
        return  $religion;
    }

    public function create(array $data) : Religion
    {
        $data = $this->model->create($data);
        return $data;
    }

    public function update(int $id, array $data) : Religion
    {
        $religion = $this->model->find($id);
        $religion->update($data); 

        $religion = $this->model->find($id);

        return $religion; 
    }

}