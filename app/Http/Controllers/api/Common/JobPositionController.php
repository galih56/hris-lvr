<?php

namespace App\Http\Controllers\api\Common;

use App\Helpers\ApiResponse;
use App\Interfaces\Common\JobPositionRepositoryInterface;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Common\JobPosition\StoreJobPositionRequest;
use App\Http\Requests\Common\JobPosition\UpdateJobPositionRequest;
use Illuminate\Support\Facades\DB ;
use App\Http\Resources\Common\JobPositionResource;
use App\Services\HashIdService;

class JobPositionController extends Controller
{
    private JobPositionRepositoryInterface $jobPositionRepository;
    
    public function __construct(JobPositionRepositoryInterface $jobPositionRepository)
    {
        $this->jobPositionRepository = $jobPositionRepository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $per_page = $request->query('per_page') ?? 0;
        $search = $request->query('search');

        $prepare_search = [];

        if($search){
            $prepare_search[]= [
                'code:like' => $search,
                'name:like' => $search,
                'with:department:code,name:like' => $search,
            ];
        }

        if ($request->has('filters')) {
            $filter_inputs = $request->get('filters');
            $prepare_filters = [];
            if (isset($filter_inputs['department_id'])) {
                $prepare_filters['department_id'] = (new HashIdService())->decode($filter_inputs['department_id']);
            }
            $prepare_search[] = $prepare_filters;
        }

        $data = $this->jobPositionRepository->get($prepare_search, $per_page, []);

        if($per_page){
            $job_positions = [
                'data' => JobPositionResource::collection($data->items()),  // The actual resource data
                'meta' => [
                    'current_page' => $data->currentPage(),
                    'per_page' => $data->per_page(),
                    'total_count' => $data->total(),
                    'total_pages' => $data->lastPage(),
                ]
            ];
                
            return response()->json($job_positions,200);
        }else{
            $job_positions = JobPositionResource::collection($data);
            return ApiResponse::sendResponse($job_positions,'','success', 200);
        }

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreJobPositionRequest $request)
    {
        DB::beginTransaction();
        try{
            $data = $request->all();
            $job_position = $this->jobPositionRepository->create($data);

            DB::commit();
            return ApiResponse::sendResponse(new JobPositionResource($job_position),'JobPosition Create Successful','success', 201);

        }catch(\Exception $ex){
            return ApiResponse::rollback($ex);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $job_position = $this->jobPositionRepository->find($id);

        return ApiResponse::sendResponse(new JobPositionResource($job_position),'', 'success', 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update($id, UpdateJobPositionRequest $request)
    {
        DB::beginTransaction();
        try{
            $job_position = $this->jobPositionRepository->update($id, $request->all());

            DB::commit();
            return ApiResponse::sendResponse(new JobPositionResource($job_position) , 'JobPosition Successful','success',201);

        }catch(\Exception $ex){
            return ApiResponse::rollback($ex);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $this->jobPositionRepository->delete($id);
        
        return ApiResponse::sendResponse('JobPosition Delete Successful','',204);
    }

    public function checkJobPositionCode($search)
    {
        $result = $this->jobPositionRepository->checkJobPositionCode($search);
    
        if ($result['status'] === 'no_jobPosition') {
            return ApiResponse::sendResponse(null, $result['message'], 'error', 404);
        }
    
        return ApiResponse::sendResponse($result['data'], $result['message'], 'success', 200);
    }
}
