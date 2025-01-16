<?php
namespace App\Http\Controllers\api;

use App\Helpers\ApiResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\LeaveRequest\StoreLeaveRequestRequest;
use App\Http\Requests\LeaveRequest\UpdateLeaveRequestRequest;
use App\Http\Resources\LeaveRequestResource;
use App\Http\Resources\LeaveTypeResource;
use App\Models\LeaveType;
use Illuminate\Support\Facades\DB;
use App\Services\LeaveRequestService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\Auth;

class LeaveRequestController extends Controller
{
    private LeaveRequestService $leaveRequestService;

    public function __construct(LeaveRequestService $leaveRequestService)
    {
        $this->leaveRequestService = $leaveRequestService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->query('per_page') ?? 0;

        $filters = [];

        $data = $this->leaveRequestService->getLeaveRequests($filters, $perPage, []);

        if($perPage){
            $leaveRequests = [
                'data' => LeaveRequestResource::collection($data->items()),  // The actual resource data
                'meta' => [
                    'current_page' => $data->currentPage(),
                    'per_page' => $data->perPage(),
                    'total_count' => $data->total(),
                    'total_pages' => $data->lastPage(),
                ]
            ];
                
            return response()->json($leaveRequests,200);
        }else{
            $leaveRequests = LeaveRequestResource::collection($data);
            return ApiResponse::sendResponse($leaveRequests,'','success', 200);
        }

    }

    /**
     * Store a newly created resource in storage.
     */public function store(StoreLeaveRequestRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->all();

            $user = Auth::user();
            if (!$request->has('employee_id')) {
                if (!empty($user)) {
                    $user = $user->load(['role', 'employee']);
                    $data['created_by'] = $user->id;

                    if ($user->employee) {
                        $data['employee_id'] = $user->employee->id;
                    } else {
                        throw new AuthorizationException('Employee not found');
                    }
                } else {
                    throw new AuthorizationException();
                }
            }

            // Pass the request data to the service
            $leaveRequest = $this->leaveRequestService->recordLeaveRequest($data, $user);

            DB::commit();
            return ApiResponse::sendResponse($leaveRequest, 'LeaveRequest record created successfully', 'success', 201);
        } catch (\Exception $ex) {
            return ApiResponse::rollback($ex);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $leaveRequest = $this->leaveRequestService->getLeaveRequestById($id);
        return ApiResponse::sendResponse(new LeaveRequestResource($leaveRequest),'', 'success', 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update($id, UpdateLeaveRequestRequest $request)
    {
        DB::beginTransaction();
        try{
            $leaveRequest = $this->leaveRequestService->updateLeaveRequest($id, $request->all());

            DB::commit();
            return ApiResponse::sendResponse( $leaveRequest , 'Employee Successful','success',201);

        }catch(\Exception $ex){
            return ApiResponse::rollback($ex);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $this->leaveRequestService->deleteLeaveRequest($id);
        
        return ApiResponse::sendResponse('Employee Delete Successful','',204);
    }

    public function getLeaveTypes(){
        return LeaveTypeResource::collection(LeaveType::get());
    }
}
