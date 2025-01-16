<?php
namespace App\Http\Controllers\api;

use App\Helpers\ApiResponse;
use App\Helpers\DatetimeHelper;
use App\Interfaces\ShiftAssignmentRepositoryInterface;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\ShiftAssignment\StoreShiftAssignmentRequest;
use App\Http\Requests\ShiftAssignment\UpdateShiftAssignmentRequest;
use App\Http\Resources\ShiftAssignmentResource;
use App\Services\ShiftAssignmentService;
use Illuminate\Support\Facades\DB;

class ShiftAssignmentController extends Controller
{
    private ShiftAssignmentRepositoryInterface $shiftAssignmentRepository;
    private ShiftAssignmentService $shiftAssignmentService;
    
    public function __construct(ShiftAssignmentService $shiftAssignmentService, ShiftAssignmentRepositoryInterface $shiftAssignmentRepository)
    {
        $this->shiftAssignmentRepository = $shiftAssignmentRepository;
        $this->shiftAssignmentService = $shiftAssignmentService;
    }

    public function getActiveShiftAssignment(){
        return $this->shiftAssignmentService->getActiveShiftAssignment();
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->query('per_page') ?? 0;

        $filters = [];

        $data = $this->shiftAssignmentRepository->get($filters, $perPage, []);

        if($perPage){
            $shift_assignments = [
                'data' => ShiftAssignmentResource::collection($data->items()),  // The actual resource data
                'meta' => [
                    'current_page' => $data->currentPage(),
                    'per_page' => $data->perPage(),
                    'total_count' => $data->total(),
                    'total_pages' => $data->lastPage(),
                ]
            ];
                
            return response()->json($shift_assignments,200);
        }else{
            $shift_assignments = ShiftAssignmentResource::collection($data);
            return ApiResponse::sendResponse($shift_assignments,'','success', 200);
        }

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreShiftAssignmentRequest $request)
    {
        DB::beginTransaction();
        try{
            $data = $request->all();
            
            $employee = $this->shiftAssignmentService->assignShiftToEmployee($data['shift_id'], $data['employee_id'], $data);

            DB::commit();
            return ApiResponse::sendResponse($employee,'Employee Create Successful','success', 201);

        }catch(\Exception $ex){
            return ApiResponse::rollback($ex);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $employee = $this->shiftAssignmentRepository->find($id);

        return ApiResponse::sendResponse(new ShiftAssignmentResource($employee),'', 'success', 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update($id, UpdateShiftAssignmentRequest $request)
    {
        DB::beginTransaction();
        try{
            $employee = $this->shiftAssignmentRepository->update($id, $request->all());

            DB::commit();
            return ApiResponse::sendResponse( $employee , 'Employee Successful','success',201);

        }catch(\Exception $ex){
            return ApiResponse::rollback($ex);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $this->shiftAssignmentRepository->delete($id);
        
        return ApiResponse::sendResponse('Employee Delete Successful','',204);
    }
}
