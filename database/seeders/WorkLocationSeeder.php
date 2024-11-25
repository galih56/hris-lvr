<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WorkLocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $work_location_types = [
            [ 'name' => 'Office'],
            [ 'name' => 'Pabrik'],
        ];
        
        
        
        for ($i=0; $i < count($work_location_types); $i++) { 
            $work_location_type = $work_location_types[$i];
            $work_location_typeExists = \DB::table('work_location_types')->where('name',$work_location_type['name'])->first();
            
            if (!$work_location_typeExists) {
                \DB::table('work_location_types')->insert($work_location_type);
            }
        }

        
        $work_locations = [
            [ 'code' => 'JKT' , 'name' => 'Jakarta' , 'type_id' => 1],
            [ 'code' => 'SBY' , 'name' => 'Surabaya', 'type_id' => 2],
        ];
        
        
        
        for ($i=0; $i < count($work_locations); $i++) { 
            $work_location = $work_locations[$i];
            $work_locationExists = \DB::table('work_locations')->where('name',$work_location['name'])->first();
            
            if (!$work_locationExists) {
                \DB::table('work_locations')->insert($work_location);
            }
        }
    }
}
