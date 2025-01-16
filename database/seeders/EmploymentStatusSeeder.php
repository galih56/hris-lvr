<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EmploymentStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employment_statuses = [
            [ 'code' => 'OS', 'name' => 'Outsource', 'employee_code' => 'EOS', 'created_at' => date('Y-m-d H:i:s') ],
            [ 'code' => 'PKL', 'name' => 'PKL', 'employee_code' => 'PKL', 'created_at' => date('Y-m-d H:i:s') ],
            [ 'code' => 'PKWT', 'name' => 'PKWT',  'employee_code' => 'EMP', 'created_at' => date('Y-m-d H:i:s') ],
            [ 'code' => 'INTERN', 'name' => 'Internship (Magang)',  'employee_code' => 'INT',  'created_at' => date('Y-m-d H:i:s') ],
            [ 'code' => 'PKWTP', 'name' => 'PKWT Pasca Pensiun',  'employee_code' => 'EMP',  'created_at' => date('Y-m-d H:i:s') ],
            [ 'code' => 'PKWTT', 'name' => 'PKWTT',  'employee_code' => 'EMP',  'created_at' => date('Y-m-d H:i:s') ],
            [ 'code' => 'PERMANENT', 'name' => 'PKWTT',  'employee_code' => 'EMP',  'created_at' => date('Y-m-d H:i:s') ],
            [ 'code' => 'PROJECT', 'name' => 'Project/Freelance',  'employee_code' => 'PRO',  'created_at' => date('Y-m-d H:i:s') ],
        ];
	
        for ($i=0; $i < count($employment_statuses); $i++) { 
            $item = $employment_statuses[$i];
            $statusExists = DB::table('employment_statuses')->where('code',$item['code'])->first();
            
            if (!$statusExists) {
                DB::table('employment_statuses')->insert($item);
            }
        }
    }
}