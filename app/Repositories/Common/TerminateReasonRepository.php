<?php
namespace App\Repositories\Common;

use App\Interfaces\Common\TerminateReasonRepositoryInterface;
use App\Interfaces\RepositoryInterface;
use App\Models\Common\TerminateReason;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class TerminateReasonRepository extends BaseRepository
implements RepositoryInterface, TerminateReasonRepositoryInterface
{
    protected $related_data = [
    ];

    public function __construct(TerminateReason $model)
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

    public function find(int $id) : ?TerminateReason
    {
        $terminate_reason = $this->model->find($id);
        return  $terminate_reason;
    }

    public function create(array $data)
    {
        $data = $this->model->create($data);
        return $data;
    }

    public function update(int $id, array $data) : TerminateReason
    {
        $terminate_reason = $this->model->find($id);
        $terminate_reason->update($data); 

        $terminate_reason = $this->model->find($id);

        return $terminate_reason; 
    }
}