<?php

namespace App\Http\Controllers\api;

use App\Helpers\ApiResponse;
use App\Interfaces\EmployeeRepositoryInterface;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Employee\StoreEmployeeRequest;
use App\Http\Requests\Employee\UpdateEmployeeRequest;
use App\Http\Requests\Employee\UpdateEmployeeStatusRequest;
use Illuminate\Support\Facades\DB ;
use App\Http\Resources\EmployeeResource;
use App\Services\HashIdService;

class EmployeeController extends Controller
{
    private EmployeeRepositoryInterface $employeeRepository;
    
    public function __construct(EmployeeRepositoryInterface $employeeRepository)
    {
        $this->employeeRepository = $employeeRepository;
    }

    public function updateEmployeeStatus($id, UpdateEmployeeStatusRequest $request){
        $employee = $this->employeeRepository->updateEmployeeStatus($id, $request->all());
        return ApiResponse::sendResponse(new EmployeeResource($employee), 'Employee Status Successfully Updated', 'success' ,201);
    }

    public function searchEmployee(Request $request){
        $keyword = $request->query('keyword');

        $filters = [];

        if($keyword){
            $filters[] = [
                'code:like' => $keyword,
                'name:like' => $keyword,
            ];
        }

        $employees = $this->employeeRepository->searchEmployee($filters);
        
        return ApiResponse::sendResponse(EmployeeResource::collection($employees), null, 'success', 200);
    }

    public function checkEmployeeCode($search)
    {
        $employees = $this->employeeRepository->checkEmployeeCode($search);
    
        if ($employees['status'] === 'no_employee') {
            return ApiResponse::sendResponse(null, $employees['message'], 'error', 404);
        }
    
        return ApiResponse::sendResponse($employees['data'], $employees['message'], 'success', 200);
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $per_page = $request->query('per_page') ?? 0;
        $search = $request->query('search');


        $prepare_search = [];
        if ($search) {
            $prepare_search[] = [
                'employees.code:like' => $search,
                'employees.name:like' => $search,
                'employees.email:like' => $search,
                'employees.address:like' => $search,
                'with:jobPosition:job_positions.id,job_positions.code,job_positions.name:like' => $search,
                'with:jobPosition.department:departments.id,departments.code,departments.name:like' => $search,
                'with:jobGrade:job_grades.name:like' => $search,
                'with:employmentStatus:code,name:like' => $search,
            ];
        }

        if ($request->has('filters')) {
            $filter_inputs = $request->get('filters');
            $prepare_filters = [];
            if (isset($filter_inputs['department_id'])) {
                $department_id = (new HashIdService())->decode($filter_inputs['department_id']);
                if($department_id) {
                    $prepare_filters['with:jobPosition:job_positions.department_id:equal']= $department_id;
                }
            }
            $prepare_search[] = $prepare_filters;
        }
        
        $data = $this->employeeRepository->get($prepare_search, $per_page);;

        if($per_page){
            $employees = [
                'data' => EmployeeResource::collection($data->items()),  // The actual resource data
                'meta' => [
                    'current_page' => $data->currentPage(),
                    'per_page' => $data->per_page(),
                    'total_count' => $data->total(),
                    'total_pages' => $data->lastPage(),
                ]
            ];
                
            return response()->json($employees,200);
        }else{
            $employees = EmployeeResource::collection($data);
            return ApiResponse::sendResponse($employees,'','success', 200);
        }

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEmployeeRequest $request)
    {
        DB::beginTransaction();
        try{
            $data = $request->all();
            $employee = $this->employeeRepository->create($data);

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
        $employee = $this->employeeRepository->find($id);

        return ApiResponse::sendResponse(new EmployeeResource($employee),'', 'success', 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update($id, UpdateEmployeeRequest $request)
    {
        DB::beginTransaction();
        try{
            $employee = $this->employeeRepository->update($id, $request->all());

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
        $this->employeeRepository->delete($id);
        
        return ApiResponse::sendResponse('Employee Delete Successful','',204);
    }

}
