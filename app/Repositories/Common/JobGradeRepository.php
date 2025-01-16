<?php
namespace App\Repositories\Common;

use App\Interfaces\Common\JobGradeRepositoryInterface;
use App\Interfaces\RepositoryInterface;
use App\Models\Common\JobGrade;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class JobGradeRepository extends BaseRepository
implements RepositoryInterface, JobGradeRepositoryInterface
{
    protected $related_data = [
    ];

    public function __construct(JobGrade $model)
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

    public function find(int $id) : ?JobGrade
    {
        $job_grade = $this->model->find($id);
        return  $job_grade;
    }

    public function create(array $data)
    {
        $data = $this->model->create($data);
        return $data;
    }

    public function update(int $id, array $data) : JobGrade
    {
        $job_grade = $this->model->find($id);
        $job_grade->update($data); 

        $job_grade = $this->model->find($id);

        return $job_grade; 
    }

    public function delete(int $id) : bool
    {
        return $this->model->delete($id);
    }
    
    function checkJobGradeCode(string $search)
    {
        $job_grade = $this->model->where('code', 'like', "$search")->first();
    
        if (!$job_grade) {
            return [
                'status' => 'success',
                'data' => null,
                'message' => 'Job grade code is safe to be used.'
            ];
        }

        return [
            'status' => 'error',
            'data' => $job_grade,
            'message' => 'Job grade code is already used'
        ];
    }
}