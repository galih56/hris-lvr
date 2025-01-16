<?php
namespace App\Repositories\Common;

use App\Interfaces\Common\TaxStatusRepositoryInterface;
use App\Interfaces\RepositoryInterface;
use App\Models\Common\TaxStatus;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class TaxStatusRepository extends BaseRepository
implements RepositoryInterface, TaxStatusRepositoryInterface
{
    protected $related_data = [
    ];

    public function __construct(TaxStatus $model)
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

    public function find(int $id) : ?TaxStatus
    {
        $tax_status = $this->model->find($id);
        return  $tax_status;
    }

    public function create(array $data)
    {
        $data = $this->model->create($data);
        return $data;
    }

    public function update(int $id, array $data) : TaxStatus
    {
        $tax_status = $this->model->find($id);
        $tax_status->update($data); 

        $tax_status = $this->model->find($id);

        return $tax_status; 
    }

    function checkTaxStatusCode(string $search)
    {
        $tax_status = $this->model->where('code', 'like', "$search")->first();
    
        if (!$tax_status) {
            return [
                'status' => 'success',
                'data' => null,
                'message' => 'Tax status code is safe to be used.'
            ];
        }

        return [
            'status' => 'error',
            'data' => $tax_status,
            'message' => 'Tax status code is already used'
        ];
    }
}