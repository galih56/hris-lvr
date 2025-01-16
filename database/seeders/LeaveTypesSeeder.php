<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LeaveTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        
        $leave_types = [
            ['code' => 'CM', 'name' => 'Cuti Melahirkan', 'eligibility_days' => 90, 'day_type' => 'full day', 'deducted_leave' => 0, 'day_count' => 'work day', 'repeat_period' => 0],
            ['code' => 'CT', 'name' => 'Cuti Tahunan', 'eligibility_days' => 12, 'day_type' => 'full day', 'deducted_leave' => 1, 'day_count' => 'work day', 'repeat_period' => 1],
            ['code' => 'IBH', 'name' => 'Izin Ibadah Haji', 'eligibility_days' => 40, 'day_type' => 'full day', 'deducted_leave' => 0, 'day_count' => 'calendar day', 'repeat_period' => 0],
            ['code' => 'IMG', 'name' => 'Cuti Pendampingan Istri', 'eligibility_days' => 2, 'day_type' => 'full day', 'deducted_leave' => 0, 'day_count' => 'work day', 'repeat_period' => 0],
            ['code' => 'IMK', 'name' => 'Izin Kurang Dari 4 Jam', 'eligibility_days' => 1, 'day_type' => 'half day', 'deducted_leave' => 0, 'day_count' => 'work day', 'repeat_period' => 0],
            ['code' => 'IP', 'name' => 'Izin Pribadi', 'eligibility_days' => 365, 'day_type' => 'full day', 'deducted_leave' => 0, 'day_count' => 'work day', 'repeat_period' => 0],
            ['code' => 'IPK', 'name' => 'Izin Pekerja Keguguran', 'eligibility_days' => 45, 'day_type' => 'full day', 'deducted_leave' => 0, 'day_count' => 'calendar day', 'repeat_period' => 0],
            ['code' => 'KB', 'name' => 'Pengkhitanan / Pembaptisan Anak', 'eligibility_days' => 2, 'day_type' => 'full day', 'deducted_leave' => 0, 'day_count' => 'work day', 'repeat_period' => 0],
            ['code' => 'KBA', 'name' => 'Korban Penggusuran/Kebakaran/Banjir/Bencana Alam', 'eligibility_days' => 2, 'day_type' => 'full day', 'deducted_leave' => 0, 'day_count' => 'work day', 'repeat_period' => 0],
            ['code' => 'MD', 'name' => 'Keluarga Inti Meninggal Dunia', 'eligibility_days' => 2, 'day_type' => 'full day', 'deducted_leave' => 0, 'day_count' => 'work day', 'repeat_period' => 0],
            ['code' => 'MDAK', 'name' => 'Anggota Keluarga Dalam Satu Rumah Meninggal Dunia', 'eligibility_days' => 1, 'day_type' => 'full day', 'deducted_leave' => 0, 'day_count' => 'work day', 'repeat_period' => 0],
            ['code' => 'MISA', 'name' => 'Menjaga Isteri/Suami/Anak Sakit Keras Di RS', 'eligibility_days' => 1, 'day_type' => 'full day', 'deducted_leave' => 0, 'day_count' => 'work day', 'repeat_period' => 0],
            ['code' => 'PAPK', 'name' => 'Perkawinan Anak Pekerja', 'eligibility_days' => 2, 'day_type' => 'full day', 'deducted_leave' => 0, 'day_count' => 'work day', 'repeat_period' => 0],
            ['code' => 'PPK', 'name' => 'Perkawinan Pekerja', 'eligibility_days' => 3, 'day_type' => 'full day', 'deducted_leave' => 0, 'day_count' => 'work day', 'repeat_period' => 0],
            ['code' => 'SID', 'name' => 'Sakit dengan Surat Dokter', 'eligibility_days' => 365, 'day_type' => 'full day', 'deducted_leave' => 0, 'day_count' => 'work day', 'repeat_period' => 0],
            ['code' => 'SKH', 'name' => 'Cuti Sakit Karena Haid', 'eligibility_days' => 2, 'day_type' => 'full day', 'deducted_leave' => 0, 'day_count' => 'work day', 'repeat_period' => 0],
        ];

        for ($i=0; $i < count($leave_types); $i++) { 
            $leave_type = $leave_types[$i];
            $leave_type_exists = \DB::table('leave_types')->where('code',$leave_type['code'])->first();
            
            if (!$leave_type_exists) {
                \DB::table('leave_types')->insert($leave_type);
            }
        }
    }

    /*
        enum
    */
}
