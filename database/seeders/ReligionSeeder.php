<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ReligionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        
        $religions = [
            [ 'name' => 'Budha'],
            [ 'name' => 'Islam'],
            [ 'name' => 'Hindu'],
            [ 'name' => 'Katolik'],
            [ 'name' => 'Kristen'],
            [ 'name' => 'Kong Hu Cu'],
        ];
        
        
        
        for ($i=0; $i < count($religions); $i++) { 
            $religion = $religions[$i];
            $religionExists = \DB::table('religions')->where('name',$religion['name'])->first();
            
            if (!$religionExists) {
                \DB::table('religions')->insert($religion);
            }
        }
    }
}
