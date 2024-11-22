<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use DB; 

class JobGradeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $grades = [
            ['code' => 'DIR', 'name' => 'DIRECTOR'],
            ['code' => 'PEL', 'name' => 'PELAKSANA'],
            ['code' => 'STAFF', 'name' => 'STAFF'],
            ['code' => 'MGR', 'name' => 'MANAGER'],
            ['code' => 'SPV', 'name' => 'SUPERVISOR'],
            ['code' => 'GM', 'name' => 'GENERAL MANAGER'],
            ['code' => 'SMGR', 'name' => 'SENIOR MANAGER'],
            ['code' => 'EXP', 'name' => 'EXPERT'],
            ['code' => 'CM', 'name' => 'CHAIRMAN']
        ];
        for ($i=0; $i < count($grades); $i++) { 
            $grade = $grades[$i];
            $gradeExists = DB::table('job_grades')->where('code',$grade['code'])->first();
    
            if (!$gradeExists) {
                DB::table('job_grades')->insert([
                    'code' => $grade['code'],
                    'name' => $grade['name'],
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s'),
                ]);
            }
        }
    }
}

