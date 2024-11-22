<?php

namespace App\Http\Controllers\api;

use App\Helpers\ApiResponse;
use App\Interfaces\EmployeeRepositoryInterface;
use DB;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class EmployeeController extends Controller
{
    private EmployeeRepositoryInterface $employeeRepositoryInterface;
    
    public function __construct(EmployeeRepositoryInterface $employeeRepositoryInterface)
    {
        $this->employeeRepositoryInterface = $employeeRepositoryInterface;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = $this->employeeRepositoryInterface->getAll();

        return ApiResponse::sendResponse($data,'','success', 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEmployeeRequest $request)
    {
        DB::beginTransaction();
        try{
                $employee = $this->employeeRepositoryInterface->create($request->all());

                DB::commit();
                return ApiResponse::sendResponse($data,'Employee Create Successful','success', 201);

        }catch(\Exception $ex){
            return ApiResponse::rollback($ex);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $employee = $this->employeeRepositoryInterface->find($id);

        return ApiResponse::sendResponse($employee,'', 'success', 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update($id, UpdateEmployeeRequest $request)
    {
        DB::beginTransaction();
        try{
            $employee = $this->employeeRepositoryInterface->update($request->all(),$id);

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
        $this->employeeRepositoryInterface->delete($id);
        
        return ApiResponse::sendResponse('Employee Delete Successful','',204);
    }
    
    public function checkEmployeeName($search){

    }
}
