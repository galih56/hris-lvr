<?php

namespace App\Imports;

use App\Models\Common\OrganizationUnit;
use App\Models\Common\Directorate;
use App\Models\Common\JobGrade;
use App\Models\Common\JobPosition;
use App\Models\Common\TaxStatus;
use App\Models\Common\Religion;
use App\Models\Common\EmploymentStatus;
use Maatwebsite\Excel\Concerns\ToArray;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Facades\Validator;
use DB;
use App\Services\EmployeeCodeService;

class EmployeeImport implements ToArray, WithHeadingRow
{

    public function array(array $rows)
    {
        $allowed_datetime_format =  'multi_date_format:Y-m-d H:i:s,d-m-Y H:i,d-m-Y H:i';
        $validator = Validator::make($rows,[
            '*.code' => 'required|string',
            '*.name' => 'required|string',
            '*.employment_status' => 'required|string',
            '*.job_position' => 'required|string',
            '*.area' => 'required|string',
            '*.division' => 'required|string',
            '*.department' => 'required|string',
            '*.supervisor' => 'nullable|string',
            '*.coordinator' => 'nullable|string',
            '*.manager' => 'required|string',
            '*.id_number' => 'required|string',
            '*.phone_number' => 'required|string',
            '*.employment_start_date' => 'nullable|string',
            '*.employment_end_date' => 'nullable|string',
            '*.terminate_date' => ['nullable|string'],
            '*.pension_date' => ['nullable|string'],
            '*.terminate_date' => ['nullable', "string",  $allowed_datetime_format ],
            '*.pension_date' => ['nullable', "string",  $allowed_datetime_format ],
            '*.resignation' => 'nullable|string',
            '*.bank_branch' => 'nullable|string',
            '*.bank_account' => 'nullable|string',
            '*.marital_status' => 'nullable|string|in:married,single,widow,widower,unverified',
            '*.employment_status' => 'nullable|string',
            '*.insurance_number' => 'nullable|string',
            '*.tax_number' => 'nullable|string',
            '*.status' => 'nullable|in:active,inactive',

            '*.employment_status' => 'nullable|string',
            '*.work_location' => 'nullable|string',
            '*.job_grade' => 'nullable|string',
            '*.department' => 'nullable|string|exists:organization_units,name',  // Ensure valid department name
            '*.directorate' => 'nullable|string|exists:directorates,name',
            '*.job_position_id' => 'nullable|string|exists:job_positions,id',
            '*.work_location_id' => 'nullable|string|exists:work_locations,id',
            '*.department' => 'nullable|string',
            '*.organization_unit' => 'nullable|string',

        ]);


        if ($validator->fails()) {
            // Handle validation errors
            return response()->json([
                'message' => 'Validation failed for some rows.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $employees = [];
        DB::transaction(function () use ($rows) {
            foreach ($rows as $employee) {
                if($employee['job_grade']){
                    $job_grade = JobGrade::where('name',$employee['job_grade'])->first();
                    if($job_grade) $employee['job_grade_id'] = $job_grade->id;
                }

                if($employee['job_grade_code']){
                    $job_grade = JobGrade::where('code', $employee['job_grade_code'])->first();
                    if($job_grade) $employee['job_grade_id'] = $job_grade->id;
                }

                if($employee['job_position_code']){
                    $job_position = JobPosition::where($employee['job_position_code'])->first();
                    if($job_position) $employee['job_position_id'] = $job_position->id;
                }
                
                if($employee['work_location_code']){
                    $work_location = JobPosition::where($employee['work_location_code'])->first();
                    if($work_location) $employee['work_location_id'] = $job_position->id;
                }
                
                if($employee['employment_status']){
                    $employment_status = EmployeeStatus::where('code',$employee['employment_status'])->first();
                    if($employment_status) $employee['employment_status_id'] = $employment_status->id;
                }
                
                if($employee['tax_status']){
                    $tax_status = TaxStatus::where('code',$employee['tax_status'])->first();
                    if($tax_status) $employee['tax_status_id'] = $tax_status->id;
                }

                if($employee['directorate']){
                    $directorate = Directorate::where('code',$employee['directorate'])->first();
                    if($directorate) $employee['directorate_id'] = $directorate->id;
                }

                if($employee['religion']){
                    $religion = Religion::where('name',$employee['religion'])->first();
                    if($religion) $employee['religion_id'] = $directorate->id;
                }

                $employee = [
                    'code' => $employee['code'] ?? null,
                    'name' => $employee['name'] ?? null,
                    'employment_status' => $employee['employment_status'] ?? null,
                    'department' => $employee['department'] ?? null,
                    'id_number' => $employee['id_number'] ?? null,
                    'phone_number' => $employee['phone_number'] ?? null,
                    'employment_start_date' => $employee['employment_start_date'] ?? null,
                    'employment_end_date' => $employee['employment_end_date'] ?? null,
                    'terminate_date' => $employee['terminate_date'] ?? null,
                    'pension_date' => $employee['pension_date'] ?? null,
                    'resignation' => $employee['resignation'] ?? null,
                    'bank_branch' => $employee['bank_branch'] ?? null,
                    'bank_account' => $employee['bank_account'] ?? null,
                    'marital_status' => $employee['marital_status'] ?? null,
                    'insurance_number' => $employee['insurance_number'] ?? null,
                    'tax_number' => $employee['tax_number'] ?? null,
                    'job_position_id' => $employee['job_position_id'] ?? null,
                    'status' => $employee['status'] ?? null,
                ];
                
                $inserted_employee = Employee::updateOrCreate([
                                        'code' => $employee['code'],
                                    ], $employee);
                $employees[] = $inserted_employee;
            }
        });
    
        return $employees;
    }
    
    public function headingRow(): int
    {
        return 1;
    }
}
