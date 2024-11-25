<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TerminateReasonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $terminate_reasons = [
            ['name' => 'Resign'],
            ['name' => 'Terminate'],
            ['name' => 'Deceased'],
            ['name' => 'Pension'],
        ];
        for ($i=0; $i < count($terminate_reasons); $i++) { 
            $terminate_reason = $terminate_reasons[$i];
            $terminateReasonExists = \DB::table('terminate_reasons')->where('name',$terminate_reason['name'])->first();
    
            if (!$terminateReasonExists) {
                \DB::table('terminate_reasons')->insert([
                    'name' => $terminate_reason['name'],
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s'),
                ]);
            }
        }
    }
}
