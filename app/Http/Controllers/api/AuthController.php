<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\JsonResponse;
use App\Services\AuthService;
use App\Models\User;
use Hash;
use Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\AuthenticationException;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }


    public function login(LoginRequest $request): JsonResponse
    {
        $user = $this->authService->authenticate(
            $request->input('username_or_email'),
            $request->input('password'),
            $request->boolean('remember'),
            $request->ip()
        );

        if(empty($user)) {
            throw new AuthenticationException('Unauthenticated.');
        }

        $token = $user->createToken(env('APP_NAME'))->plainTextToken;
        return response()->json([
            'status' => 'success',
            'message' => 'Login successful',
            'data' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer'
        ], 200);
    }
    public function me(Request $request){
        $user = Auth::user();
        if(empty($user)){
            return response([
                'status' => 'error',
                'message' => "Unauthenticated"
            ],401);
        }

        $user = $user->load(['role','employee']);
        // $user->tokens->each(function ($token) {
        //     $token->delete();
        // });
        // $token = $user->createToken(env('APP_NAME'))->plainTextToken;
        
        $user->makeHidden('tokens');
        return response()->json([
            "status" => "success",
            "data" => $user,
            // 'access_token' => $token,
            // 'token_type' => 'Bearer'
        ]);

    }

    public function register(RegisterRequest $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|unique:users,email|max:255',
            'password' => 'string|required_with:password_confirmation|same:password_confirmation',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 400);
        }
        
        $fields = $validator->validated();
    
        $user = User::create([
            'name' => $fields['name'],
            'email' => $fields['email'],
            'password' => Hash::make($fields['password']),
        ]);
        $user = User::with('role')->with('employee')->find($user->id);
        $token = $user->createToken(env('APP_NAME'))->plainTextToken;
        return response()->json([
            'status' => 'success',
            'message' => 'Register success',
            'data' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer'
        ]);
    }

    public function projects(){
        $user = Auth::user()->load([
            'role',
            'employee'
        ]);

        if(empty($user->employee)){
            return response()->json([
                'status' => 'error',
                'message' => 'Employee data not found'
            ], 400);
        }
        $projects = $user->employee->projects;
        return response()->json($projects);    
    }

    public function logout()
    {
        Auth::user()->tokens()->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Logout success'
        ]);
    }
}
