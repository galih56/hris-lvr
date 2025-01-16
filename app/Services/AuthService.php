<?php

namespace App\Services;

use App\Models\User;
use App\Models\Employee;
use App\Models\UserRole;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    public function authenticate($usernameOrEmail, $password, $remember, $ip)
    {
        $loginType = filter_var($usernameOrEmail, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
        $credentials = [$loginType => $usernameOrEmail, 'password' => $password];
    
        if (Auth::attempt($credentials, $remember)) {
            return Auth::user()->load(['role', 'employee']);
        }
        return null;
    }

    public function register($data)
    {
        $employee = Employee::where('code', $data['employee_code'])->first();
        if (empty($employee)) {
            return ['status' => 'error', 'message' => 'The employee code does not exist or is inactive.'];
        }

        $employee_user_role = UserRole::where('code','EMP')->first();
        
        if(empty($employee_user_role)){

            return [ 
                'status' => 'error',
                'message' => 'User role not found. Please contact the Administrator',
                'http_status_code' => 500
            ];
        }

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'username' => $data['employee_code'],
            'employee_id' => $employee->id,
            'role_id' => $employee_user_role->id,
            'password' => Hash::make($data['password']),
        ]);

        return ['status' => 'success', 'user' => $user];
    }
}
