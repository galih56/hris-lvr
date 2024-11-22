<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use DB;

class EmploymentStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employment_statuses = [
            [ 'code' => 'OS', 'name' => 'Outsource', 'created_at' => date('Y-m-d H:i:s') ],
            [ 'code' => 'PKL', 'name' => 'PKL', 'created_at' => date('Y-m-d H:i:s') ],
            [ 'code' => 'PKWT', 'name' => 'PKWT', 'created_at' => date('Y-m-d H:i:s') ],
            [ 'code' => 'INTERN', 'name' => 'Internship (Magang)', 'created_at' => date('Y-m-d H:i:s') ],
            [ 'code' => 'PKWTP', 'name' => 'PKWT Pasca Pensiun', 'created_at' => date('Y-m-d H:i:s') ],
            [ 'code' => 'PKWTT', 'name' => 'PKWTT', 'created_at' => date('Y-m-d H:i:s') ],
            [ 'code' => 'PERMANENT', 'name' => 'PKWTT', 'created_at' => date('Y-m-d H:i:s') ],
        ];
	
        for ($i=0; $i < count($employment_statuses); $i++) { 
            $item = $employment_statuses[$i];
            $statusExists = DB::table('employment_statuses')->where('code',$item['code'])->first();
            
            if (!$statusExists) {
                DB::table('employment_statuses')->insert($item[$i]);
            }
        }
    }
}