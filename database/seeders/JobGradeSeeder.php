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
            ['code' => 'CM', 'name' => 'CHAIRMAN', 'group_order' => 0],
            ['code' => 'DIR', 'name' => 'DIRECTOR', 'group_order' => 1],
            ['code' => 'GM', 'name' => 'GENERAL MANAGER', 'group_order' => 2],
            ['code' => 'SMGR', 'name' => 'SENIOR MANAGER', 'group_order' => 4],
            ['code' => 'MGR', 'name' => 'MANAGER', 'group_order' => 5],
            ['code' => 'EXP', 'name' => 'EXPERT', 'group_order' => 5],
            ['code' => 'SPV', 'name' => 'SUPERVISOR', 'group_order' => 6],
            ['code' => 'COOR', 'name' => 'COORDINATOR', 'group_order' => 6],
            ['code' => 'STAFF', 'name' => 'STAFF', 'group_order' => 7],
            ['code' => 'PEL', 'name' => 'PELAKSANA', 'group_order' => 8],
        ];

        for ($i=0; $i < count($grades); $i++) { 
            $grade = $grades[$i];
            $gradeExists = DB::table('job_grades')->where('code',$grade['code'])->first();
    
            if (!$gradeExists) {
                DB::table('job_grades')->insert([
                    'code' => $grade['code'],
                    'name' => $grade['name'],
                    'group_order' => $grade['group_order'],
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s'),
                ]);
            }
        }
    }
}

