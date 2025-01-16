<?php
namespace App\Repositories\Common;

use App\Interfaces\Common\OutsourceVendorRepositoryInterface;
use App\Interfaces\RepositoryInterface;
use App\Models\Common\OutsourceVendor;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class OutsourceVendorRepository extends BaseRepository
implements RepositoryInterface, OutsourceVendorRepositoryInterface
{
    protected $related_data = [
    ];

    public function __construct(OutsourceVendor $model)
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

    public function find(int $id) : ?OutsourceVendor
    {
        $outsource_vendor = $this->model->find($id);
        return  $outsource_vendor;
    }

    public function create(array $data)
    {
        $data = $this->model->create($data);
        return $data;
    }

    public function update(int $id, array $data) : OutsourceVendor
    {
        $outsource_vendor = $this->model->find($id);
        $outsource_vendor->update($data); 

        $outsource_vendor = $this->model->find($id);

        return $outsource_vendor; 
    }
}