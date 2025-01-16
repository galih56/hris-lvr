<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ShiftSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $shifts = [
            [
                'code' => '08_16',
                'name' => 'Morning Shift',
                'description' => 'Morning Shift',
                'start' => '08:00:00',
                'end' => '16:00:00',
                'is_flexible' => false,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'code' => '14_22',
                'name' => 'Afternoon Shift',
                'description' => 'Afternoon Shift',
                'start' => '14:00:00',
                'end' => '22:00:00',
                'is_flexible' => false,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'code' => '22_06',
                'name' => 'Night Shift',
                'description' => 'Night Shift',
                'start' => '22:00:00',
                'end' => '06:00:00',
                'is_flexible' => false,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'code' => 'FLEXIBLE',
                'name' => 'Flexible Shift',
                'description' => 'Flexible Shift',
                'start' => '00:00:00',
                'end' => '23:59:59',
                'is_flexible' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        for ($i=0; $i < count($shifts); $i++) { 
            $item = $shifts[$i];
            $shiftExist = DB::table('shifts')->where('code',$item['code'])->first();
            
            if (!$shiftExist) {
                DB::table('shifts')->insert($item);
            }
        }
    }
}
