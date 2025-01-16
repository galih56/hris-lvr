<?php
namespace App\Http\Controllers\api;

use App\Helpers\ApiResponse;
use App\Interfaces\AttendanceRepositoryInterface;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Attendance\StoreAttendanceRequest;
use App\Http\Requests\Attendance\UpdateAttendanceRequest;
use App\Http\Resources\AttendanceResource;
use Illuminate\Support\Facades\DB;
use App\Services\AttendanceService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\Auth;

class AttendanceController extends Controller
{
    private AttendanceService $attendanceService;

    public function __construct(AttendanceService $attendanceService)
    {
        $this->attendanceService = $attendanceService;
    }

    public function getLastOpenAttendance(){
        return ApiResponse::sendResponse($this->attendanceService->getLastOpenAttendance(),'','success', 200);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->query('per_page') ?? 0;

        $filters = [];
        $sorts = [];
        $data = $this->attendanceService->getAttendances($filters, $perPage, $sorts);

        if($perPage){
            $attendances = [
                'data' => AttendanceResource::collection($data->items()),  // The actual resource data
                'meta' => [
                    'current_page' => $data->currentPage(),
                    'per_page' => $data->perPage(),
                    'total_count' => $data->total(),
                    'total_pages' => $data->lastPage(),
                ]
            ];
                
            return response()->json($attendances,200);
        }else{
            $attendances = AttendanceResource::collection($data);
            return ApiResponse::sendResponse($attendances,'','success', 200);
        }

    }

    /**
     * Store a newly created resource in storage.
     */public function store(StoreAttendanceRequest $request)
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
            $attendance = $this->attendanceService->recordAttendance($data, $user);

            DB::commit();
            return ApiResponse::sendResponse($attendance, 'Attendance record created successfully', 'success', 201);
        } catch (\Exception $ex) {
            return ApiResponse::rollback($ex);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $attendance = $this->attendanceService->getAttendanceById($id);
        return ApiResponse::sendResponse(new AttendanceResource($attendance),'', 'success', 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update($id, UpdateAttendanceRequest $request)
    {
        DB::beginTransaction();
        try{
            $attendance = $this->attendanceService->updateAttendance($id, $request->all());

            DB::commit();
            return ApiResponse::sendResponse( $attendance , 'Employee Successful','success',201);

        }catch(\Exception $ex){
            return ApiResponse::rollback($ex);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $this->attendanceService->deleteAttendance($id);
        
        return ApiResponse::sendResponse('Employee Delete Successful','',204);
    }
}
