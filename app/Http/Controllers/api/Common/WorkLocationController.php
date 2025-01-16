<?php

namespace App\Http\Controllers\api\Common;

use App\Helpers\ApiResponse;
use App\Interfaces\Common\WorkLocationRepositoryInterface;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Common\WorkLocation\StoreWorkLocationRequest;
use App\Http\Requests\Common\WorkLocation\UpdateWorkLocationRequest;
use Illuminate\Support\Facades\DB ;
use App\Http\Resources\Common\WorkLocationResource;

class WorkLocationController extends Controller
{
    private WorkLocationRepositoryInterface $workLocationRepository;
    
    public function __construct(WorkLocationRepositoryInterface $workLocationRepository)
    {
        $this->workLocationRepository = $workLocationRepository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->query('per_page') ?? 0;
        $search = $request->query('search');

        $filters = [];

        $data = $this->workLocationRepository->get($filters, $perPage, []);

        if($perPage){
            $work_locations = [
                'data' => WorkLocationResource::collection($data->items()),  // The actual resource data
                'meta' => [
                    'current_page' => $data->currentPage(),
                    'per_page' => $data->perPage(),
                    'total_count' => $data->total(),
                    'total_pages' => $data->lastPage(),
                ]
            ];
                
            return response()->json($work_locations,200);
        }else{
            $work_locations = WorkLocationResource::collection($data);
            return ApiResponse::sendResponse($work_locations,'','success', 200);
        }

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreWorkLocationRequest $request)
    {
        DB::beginTransaction();
        try{
            $data = $request->all();
            $work_location = $this->workLocationRepository->create($data);

            DB::commit();
            return ApiResponse::sendResponse($work_location,'WorkLocation Create Successful','success', 201);

        }catch(\Exception $ex){
            return ApiResponse::rollback($ex);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $work_location = $this->workLocationRepository->find($id);

        return ApiResponse::sendResponse(new WorkLocationResource($work_location),'', 'success', 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update($id, UpdateWorkLocationRequest $request)
    {
        DB::beginTransaction();
        try{
            $work_location = $this->workLocationRepository->update($id, $request->all());

            DB::commit();
            return ApiResponse::sendResponse( $work_location , 'WorkLocation Successful','success',201);

        }catch(\Exception $ex){
            return ApiResponse::rollback($ex);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $this->workLocationRepository->delete($id);
        
        return ApiResponse::sendResponse('WorkLocation Delete Successful','',204);
    }

    public function checkWorkLocationCode($search)
    {
        $work_locationData = $this->workLocationRepository->checkWorkLocationCode($search);
    
        if ($work_locationData['status'] === 'no_work_location') {
            return ApiResponse::sendResponse(null, $work_locationData['message'], 'error', 404);
        }
    
        return ApiResponse::sendResponse($work_locationData['data'], $work_locationData['message'], 'success', 200);
    }
}
