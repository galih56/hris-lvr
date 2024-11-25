<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use Auth;
use App\Imports\JobPositionMapImport;
use App\Imports\EmployeeImport;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Excel as ExportType;

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

    public function import_test(){
        return view('testing-view');
    }

    public function jobPositionsImport(Request $request){
        $request->validate([
            'file' => 'required|mimes:csv,xlsx,xls',
        ]);

        $import = new JobPositionMapImport();
        $data = Excel::import($import, $request->file('file'));
        $data = $import->getMappedData();

        return Excel::download(
            new class($data) implements \Maatwebsite\Excel\Concerns\FromArray , \Maatwebsite\Excel\Concerns\WithHeadings {
                protected $data;
                public function __construct(array $data)
                {
                    $this->data = $data;
                }
                public function array(): array
                {
                    return $this->data;
                }
                public function headings(): array
                {
                    // Define headers for the Excel file
                    return [
                        'Job Position',
                        'Area',
                        'Division',
                        'Department',
                        'Manager',
                        'OU Department ID',
                        'OU Department CODE',
                        'OU Division ID',
                        'OU Division CODE',
                        'OU Area ID',
                        'OU Area CODE',
                        'OU Job Position ID',
                        'OU Job Position Code',
                        'Job Position ID',
                    ];
                }
            },
            'job_position_map_export.xlsx',
            ExportType::XLSX
        );
    }

    
    public function employeesImport(Request $request){
        $request->validate([
            'file' => 'required|mimes:csv,xlsx,xls',
        ]);

        $import = new EmployeeImport();
        $data = Excel::import($import, $request->file('file'));
    }
}
