<?php

namespace App\Http\Controllers\api\Common;

use App\Helpers\ApiResponse;
use App\Interfaces\Common\EmploymentStatusRepositoryInterface;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Common\EmploymentStatus\StoreEmploymentStatusRequest;
use App\Http\Requests\Common\EmploymentStatus\UpdateEmploymentStatusRequest;
use Illuminate\Support\Facades\DB ;
use App\Http\Resources\Common\EmploymentStatusResource;

class EmploymentStatusController extends Controller
{
    private EmploymentStatusRepositoryInterface $employmentStatusRepository;
    
    public function __construct(EmploymentStatusRepositoryInterface $employmentStatusRepository)
    {
        $this->employmentStatusRepository = $employmentStatusRepository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->query('per_page') ?? 0;
        $search = $request->query('search');

        $filters = [];

        $data = $this->employmentStatusRepository->get($filters, $perPage, []);

        if($perPage){
            $employment_statuses = [
                'data' => EmploymentStatusResource::collection($data->items()),  // The actual resource data
                'meta' => [
                    'current_page' => $data->currentPage(),
                    'per_page' => $data->perPage(),
                    'total_count' => $data->total(),
                    'total_pages' => $data->lastPage(),
                ]
            ];
                
            return response()->json($employment_statuses,200);
        }else{
            $employment_statuses = EmploymentStatusResource::collection($data);
            return ApiResponse::sendResponse($employment_statuses,'','success', 200);
        }

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEmploymentStatusRequest $request)
    {
        DB::beginTransaction();
        try{
            $data = $request->all();
            $employmentStatus = $this->employmentStatusRepository->create($data);

            DB::commit();
            return ApiResponse::sendResponse($employmentStatus,'EmploymentStatus Create Successful','success', 201);

        }catch(\Exception $ex){
            return ApiResponse::rollback($ex);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $employmentStatus = $this->employmentStatusRepository->find($id);

        return ApiResponse::sendResponse(new EmploymentStatusResource($employmentStatus),'', 'success', 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update($id, UpdateEmploymentStatusRequest $request)
    {
        DB::beginTransaction();
        try{
            $employmentStatus = $this->employmentStatusRepository->update($id, $request->all());

            DB::commit();
            return ApiResponse::sendResponse( $employmentStatus , 'EmploymentStatus Successful','success',201);

        }catch(\Exception $ex){
            return ApiResponse::rollback($ex);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $this->employmentStatusRepository->delete($id);
        
        return ApiResponse::sendResponse('EmploymentStatus Delete Successful','',204);
    }

    public function checkEmploymentStatusCode($search)
    {
        $employmentStatusData = $this->employmentStatusRepository->checkEmploymentStatusCode($search);
    
        if ($employmentStatusData['status'] === 'no_employmentStatus') {
            return ApiResponse::sendResponse(null, $employmentStatusData['message'], 'error', 404);
        }
    
        return ApiResponse::sendResponse($employmentStatusData['data'], $employmentStatusData['message'], 'success', 200);
    }
}
