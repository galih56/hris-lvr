<?php

namespace App\Http\Controllers\api\Common;

use App\Helpers\ApiResponse;
use App\Interfaces\Common\JobGradeRepositoryInterface;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Common\JobGrade\StoreJobGradeRequest;
use App\Http\Requests\Common\JobGrade\UpdateJobGradeRequest;
use Illuminate\Support\Facades\DB ;
use App\Http\Resources\Common\JobGradeResource;

class JobGradeController extends Controller
{
    private JobGradeRepositoryInterface $jobGradeRepository;
    
    public function __construct(JobGradeRepositoryInterface $jobGradeRepository)
    {
        $this->jobGradeRepository = $jobGradeRepository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->query('per_page') ?? 0;
        $search = $request->query('search');

        $filters = [];

        $data = $this->jobGradeRepository->get($filters, $perPage, []);

        if($perPage){
            $job_grades = [
                'data' => JobGradeResource::collection($data->items()),  // The actual resource data
                'meta' => [
                    'current_page' => $data->currentPage(),
                    'per_page' => $data->perPage(),
                    'total_count' => $data->total(),
                    'total_pages' => $data->lastPage(),
                ]
            ];
                
            return response()->json($job_grades,200);
        }else{
            $job_grades = JobGradeResource::collection($data);
            return ApiResponse::sendResponse($job_grades,'','success', 200);
        }

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreJobGradeRequest $request)
    {
        DB::beginTransaction();
        try{
            $data = $request->all();
            $job_grade = $this->jobGradeRepository->create($data);

            DB::commit();
            return ApiResponse::sendResponse($job_grade,'JobGrade Create Successful','success', 201);

        }catch(\Exception $ex){
            return ApiResponse::rollback($ex);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $job_grade = $this->jobGradeRepository->find($id);

        return ApiResponse::sendResponse(new JobGradeResource($job_grade),'', 'success', 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update($id, UpdateJobGradeRequest $request)
    {
        DB::beginTransaction();
        try{
            $job_grade = $this->jobGradeRepository->update($id, $request->all());

            DB::commit();
            return ApiResponse::sendResponse( $job_grade , 'JobGrade Successful','success',201);

        }catch(\Exception $ex){
            return ApiResponse::rollback($ex);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $this->jobGradeRepository->delete($id);
        
        return ApiResponse::sendResponse('JobGrade Delete Successful','',204);
    }

    public function checkJobGradeCode($search)
    {
        $job_gradeData = $this->jobGradeRepository->checkJobGradeCode($search);
    
        if ($job_gradeData['status'] === 'no_jobGrade') {
            return ApiResponse::sendResponse(null, $job_gradeData['message'], 'error', 404);
        }
    
        return ApiResponse::sendResponse($job_gradeData['data'], $job_gradeData['message'], 'success', 200);
    }
}
