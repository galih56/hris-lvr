<?php namespace App\Services;

use App\Models\User;
use App\Models\Employee;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Client\RequestException;

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

    protected function findOrCreateUser($data, $password)
    {
        $user = User::where('email', $data['email'])->orWhere('username', $data['username'])->first();
    
        if (!$user) {
            // Create new user
            $user = User::create([
                'email' => $data['email'],
                'username' => $data['username'],
                'name' => $data['name'],
                'password' => Hash::make($password),
            ]);
    
            $employee = Employee::create([
                'code' => $data['username'], 
                'name' => $data['name'],
                'email' => $data['email'],
                'job_position' => $data['job_position'],
                'directorate' => $data['directorate'],
            ]);
    
            $user->employee()->save($employee);
    
        } else {
            // Optionally, create or update the employee associated with the user
            if ($user->employee) {
                $user->employee->update([
                    'job_position' => $data['job_position'],
                    'directorate' => $data['directorate'],
                ]);
            } else {
                // If no employee exists for the user, create one
                Employee::create([
                    'code' => $data['username'],  // Assuming the username is used as the employee code
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'job_position' => $data['job_position'],
                    'directorate' => $data['directorate'],
                ]);
            }
        }
    
        return $user;
    }
}
