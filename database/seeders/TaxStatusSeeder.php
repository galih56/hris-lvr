<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TaxStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tax_status = [
            'code' => 'TK0', 'name' => 'TK0',
            'code' => 'TK1', 'name' => 	'TK1',
            'code' => 'TK2', 'name' => 	'TK2',
            'code' => 'K0', 'name' => 	'K0',
            'code' => 'K1', 'name' => 	'K1',
            'code' => 'K2', 'name' => 	'K2'
        ];
        
        for ($i=0; $i < count($grades); $i++) { 
            $status = $tax_status[$i];
            $tax_statusExists = DB::table('tax_statuses')->where('code',$status['code'])->first();
    
            if (!$tax_statusExists) {
                DB::table('tax_statuses')->insert([
                    'code' => $tax_status['code'],
                    'name' => $tax_status['name'],
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s'),
                ]);
            }
        }
    }
}