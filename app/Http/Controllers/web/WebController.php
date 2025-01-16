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

        if(empty($user->role)){
            
        }

        if(in_array($user->role->code, ['ADMIN','HR'])) {
            return view('hris-dashboard');
        }
        if($user->role->code == 'EMP') {
            return view('employee-services');
        }
    }

    public function authApp(){
        $user = Auth::user();
        if($user) return redirect()->route('main-app');
        return view('authentication');
    }

    public function import_test(){
        return view('testing-view');
    }

    public function jobPositionsImport(Request $request){
        $request->validate([
            'job_position_document' => 'required|mimes:csv,xlsx,xls',
        ]);

        $import = new JobPositionMapImport();
        $data = Excel::import($import, $request->file('job_position_document'));
        $data = $import->getMappedData();

        if($import->getErrors()){
            return response()->json([
                'errors' => $import->getErrors()
            ]);
        }

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
                        'Department',
                        'Division',
                        'Area',
                        'Job Position',
                        'Job Grade Code',
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
        set_time_limit(600);
        $request->validate([
            'employee_document' => 'required|mimes:csv,xlsx,xls',
        ]);

        $import = new EmployeeImport();
        $data = Excel::queueImport($import, $request->file('employee_document'));

        if($import->getErrors()){
            return response()->json([
                'status' => 'error',
                'errors' => $import->getErrors()
            ],500);
        }

        return response()->json([
            'status' => 'success',
            'data' =>$import->getMappedData()
        ], 200);
    }
}
