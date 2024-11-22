<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use Auth;

class WebController extends Controller
{
    public function __construct()
    {

    }

    public function index(){
        $user = Auth::user();
        if(empty($user)) return redirect()->route('auth');
        $user = $user->load('role');
        if($user->role->code == 'admin') return redirect('hris');
        if($user->role->code == 'emp') return redirect('employee');
        return redirect()->route('auth');
    }

    public function authApp(){
        return view('authentication');
    }

    public function employeeServicesApp(){
        return view('employee-services');
    }
    
    public function hrisApp(){
        return view('hris-dashboard');
    }
}
