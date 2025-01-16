<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            LeaveTypesSeeder::class,
            // UserRoleSeeder::class,
            // AdminUserSeeder::class,
            // ShiftSeeder::class,
            // EmploymentStatusSeeder::class,
            // ReligionSeeder::class,
            // JobGradeSeeder::class,
            // TaxStatusSeeder::class,
            // WorkLocationSeeder::class,
            // TerminateReasonSeeder::class,
            // OutsourceVendorSeeder::class,
            // EmployeesSeeder::class,
        ]);
    }
}
