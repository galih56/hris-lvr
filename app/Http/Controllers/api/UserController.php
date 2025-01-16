<?php

namespace App\Http\Controllers\api;

use App\Exceptions\RecordExistsException;
use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Interfaces\UserRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    
    private UserRepositoryInterface $userRepository;
    
    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->query('per_page') ?? 0;
        $data = $this->userRepository->get([], $perPage);

        if($perPage){
            $users = [
                'data' => UserResource::collection($data->items()),  // The actual resource data
                'meta' => [
                    'current_page' => $data->currentPage(),
                    'per_page' => $data->perPage(),
                    'total_count' => $data->total(),
                    'total_pages' => $data->lastPage(),
                ]
            ];
                
            return response()->json($users,200);
        }else{
            $users = UserResource::collection($data);
            return ApiResponse::sendResponse($users,'','success', 200);
        }

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        DB::beginTransaction();
        $data = $request->all();
        
        $userExists = $this->userRepository->isEmployeeRegistered($data['employee_id']);
        if($userExists){
            throw new RecordExistsException("Employee is already exists [$userExists->name - $userExists->username]");
        }

        try{
            $user = $this->userRepository->create($data);

            DB::commit();
            return ApiResponse::sendResponse(new UserResource($user),'User Create Successful','success', 201);
        }catch(\Exception $ex){
            return ApiResponse::rollback($ex);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $user = $this->userRepository->find($id);

        return ApiResponse::sendResponse(new UserResource($user),'', 'success', 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update($id, UpdateUserRequest $request)
    {
        DB::beginTransaction();
        try{
            $user = $this->userRepository->update($id, $request->all());

            DB::commit();
            return ApiResponse::sendResponse( $user , 'User Successful','success',201);

        }catch(\Exception $ex){
            return ApiResponse::rollback($ex);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $this->userRepository->delete($id);
        
        return ApiResponse::sendResponse('User Delete Successful','',204);
    }

    public function getUserRoles()
    {
        $data = $this->userRepository->getUserRoles();

        return ApiResponse::sendResponse($data,'','success', 200);
    }

    public function checkEmployeUserAccount(string $employee_id){
        $checkUsers = $this->userRepository->isEmployeeRegistered($employee_id);
        return ApiResponse::sendResponse($checkUsers,'','success', 200);
    }
}
