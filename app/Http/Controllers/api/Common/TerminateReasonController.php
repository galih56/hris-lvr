<?php

namespace App\Http\Controllers\api\Common;

use App\Helpers\ApiResponse;
use App\Interfaces\Common\TerminateReasonRepositoryInterface;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Common\TerminateReason\StoreTerminateReasonRequest;
use App\Http\Requests\Common\TerminateReason\UpdateTerminateReasonRequest;
use Illuminate\Support\Facades\DB ;
use App\Http\Resources\Common\TerminateReasonResource;

class TerminateReasonController extends Controller
{
    private TerminateReasonRepositoryInterface $departmentRepository;
    
    public function __construct(TerminateReasonRepositoryInterface $departmentRepository)
    {
        $this->departmentRepository = $departmentRepository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->query('per_page') ?? 0;
        $search = $request->query('search');

        $filters = [];

        $data = $this->departmentRepository->get($filters, $perPage, []);

        if($perPage){
            $departments = [
                'data' => TerminateReasonResource::collection($data->items()),  // The actual resource data
                'meta' => [
                    'current_page' => $data->currentPage(),
                    'per_page' => $data->perPage(),
                    'total_count' => $data->total(),
                    'total_pages' => $data->lastPage(),
                ]
            ];
                
            return response()->json($departments,200);
        }else{
            $departments = TerminateReasonResource::collection($data);
            return ApiResponse::sendResponse($departments,'','success', 200);
        }

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTerminateReasonRequest $request)
    {
        DB::beginTransaction();
        try{
            $data = $request->all();
            $department = $this->departmentRepository->create($data);

            DB::commit();
            return ApiResponse::sendResponse($department,'TerminateReason Create Successful','success', 201);

        }catch(\Exception $ex){
            return ApiResponse::rollback($ex);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $department = $this->departmentRepository->find($id);

        return ApiResponse::sendResponse(new TerminateReasonResource($department),'', 'success', 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update($id, UpdateTerminateReasonRequest $request)
    {
        DB::beginTransaction();
        try{
            $department = $this->departmentRepository->update($id, $request->all());

            DB::commit();
            return ApiResponse::sendResponse( $department , 'TerminateReason Successful','success',201);

        }catch(\Exception $ex){
            return ApiResponse::rollback($ex);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $this->departmentRepository->delete($id);
        
        return ApiResponse::sendResponse('TerminateReason Delete Successful','',204);
    }

}
