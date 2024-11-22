<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DirectoratesSeeder extends Seeder
{
    use WithoutModelEvents;
    
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('directorates')->insert([
            ['id' => 1, 'name' => 'CEO OFFICE', 'code' => 'CEO' ],
            ['id' => 2, 'name' => 'Human Capital', 'code' => 'HC'],
            ['id' => 3, 'name' => 'Internal Audit', 'code' => 'IA'],
            ['id' => 4, 'name' => 'International Alliance & Business Development', 'code' => 'IAB'],
            ['id' => 5, 'name' => 'Technical & Sustainability', 'code' => 'TES' ],
            ['id' => 6, 'name' => 'Risk, Technology & Compliance', 'code' => 'RTC' ],
            ['id' => 7, 'name' => 'Sales & Operational', 'code' => 'SOP' ],
            ['id' => 8, 'name' => 'Finance & Accounting', 'code' => 'FAT' ],
            ['id' => 9, 'name' => 'Property', 'code' => 'PPT' ],
            ['id' => 10, 'name' => 'QASHE', 'code' => 'QHE' ],
            ['id' => 11, 'name' => 'Board Of Director', 'code' => 'BOD' ],
            ['id' => 13, 'name' => 'License & Regional Development', 'code' => 'LRD' ],
            ['id' => 14, 'name' => 'Strategic Planning', 'code' => 'SPG'],
            ['id' => 15, 'name' => 'Technical & Project', 'code' => 'TEP' ],
        ]);
    }
}
