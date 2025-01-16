<?php

namespace App\Imports;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Bus\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use App\Models\Common\JobGrade;
use App\Models\Common\JobPosition;
use App\Models\Common\TaxStatus;
use App\Models\Common\Religion;
use App\Models\Common\EmploymentStatus;
use App\Models\Employee;
use Maatwebsite\Excel\Concerns\ToArray;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Facades\Validator;
use App\Helpers\DatetimeHelper;
use App\Models\Common\WorkLocation;
use App\Services\EmployeeCodeService;
use Exception;
use Illuminate\Support\Facades\DB;

class EmployeeImport implements ToArray, WithHeadingRow,WithChunkReading, ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable;
    protected $mappedData = [];
    protected $errors = [];

    public function array(array $rows)
    {
        $allowed_datetime_format =  'd-m-Y,Y-m-d';
       
        $validator = Validator::make($rows,[
            '*.employee_number' => 'required|string',
            '*.name' => 'required|string',
            '*.email' => 'nullable|string|email',
            '*.birth_place' => 'nullable|string',
            '*.employment_status' => 'required|string',
            '*.supervisor' => 'nullable|string',
            '*.coordinator' => 'nullable|string',
            '*.manager' => 'required|string',
            '*.id_number' => 'required|string',
            '*.phone_number' => 'nullable|string',
            '*.join_date' => ['nullable', "string",  "multi_date_format:$allowed_datetime_format" ],
            '*.birth_date' => ['nullable', "string",  "multi_date_format:$allowed_datetime_format" ],
            '*.employment_start_date' => ['nullable', "string",  "multi_date_format:$allowed_datetime_format" ],
            '*.employment_end_date' => ['nullable', "string",  "multi_date_format:$allowed_datetime_format" ],
            '*.terminate_date' => ['nullable', "string",  "multi_date_format:$allowed_datetime_format" ],
            '*.pension_date' =>['nullable', "string",  "multi_date_format:$allowed_datetime_format" ],
            '*.resignation' => 'nullable|string',
            '*.bank_branch' => 'nullable|string',
            '*.bank_account' => 'nullable|string',
            '*.marital_status' => 'nullable|string|in:married,single,widow,widower,unverified',
            '*.insurance_name' => 'nullable|string',
            '*.insurance_number' => 'nullable|string',
            '*.tax_number' => 'nullable|string',
            '*.status' => 'nullable|in:active,inactive',

            '*.employment_status' => 'nullable|string',
            '*.job_grade' => 'nullable|string', 
            '*.job_position_code' => 'nullable|exists:job_positions,code',
            '*.work_location_code' => 'nullable|exists:work_locations,code',
        ]);

        if ($validator->fails()) {
            $this->errors = $validator->errors();
            return $employees = [];
        }
        try{
            DB::beginTransaction(); 
            $employees = [];
            foreach ($rows as $employee) {

                $job_grade = null;
                if(isset($employee['job_grade']) && $employee['job_grade']){
                    $job_grade = JobGrade::where('name',$employee['job_grade'])->first();
                }

                if(isset($employee['job_grade_code']) && $employee['job_grade_code']){
                    $job_grade = JobGrade::where('code', $employee['job_grade_code'])->first();
                }

                $job_position = null;
                if(isset($employee['job_position_code']) && $employee['job_position_code']){
                    $job_position = JobPosition::where('code', $employee['job_position_code'])->first();
                    if($job_position) $data['job_position_id'] = $job_position->id;
                }
                
                if(isset($employee['job_position_id']) && $employee['job_position_id']){
                    $job_position = JobPosition::where('id', $employee['job_position_id'])->first();
                }
                

                $work_location = null;
                if(isset($employee['work_location_code']) && $employee['work_location_code']){
                    $work_location = WorkLocation::where('code', $employee['work_location_code'])->first();
                }
                
                if(isset($employee['work_location_id']) && $employee['work_location_id']){
                    $work_location = WorkLocation::where('id',$employee['work_location_id'])->first();
                }

                $employment_status = null;
                if($employee['employment_status']){
                    $employment_status = EmploymentStatus::where('code',$employee['employment_status'])->first();
                }
                
                $tax_status = null;
                if($employee['tax_status']){
                    $tax_status = TaxStatus::where('code',$employee['tax_status'])->first();
                }

                $religion = null;
                if($employee['religion']){
                    $religion = Religion::where('name',$employee['religion'])->first();
                }




                $employee_code = EmployeeCodeService::generateEmployeeCode(DatetimeHelper::createDateTimeObject($employee['join_date'],explode(',',$allowed_datetime_format)),$employment_status->employee_code);
                $data = [
                    'code' => $employee_code,
                ];

                /* Basic Information */
                if(isset($employee['employeee_number']) && $employee['employeee_number']) $data['employeee_number'] = $employee['code'];
                if(isset($employee['name']) && $employee['name']) $data['name'] = $employee['name'];
                if(isset($employee['email']) && $employee['email']) $data['email'] = $employee['email'];
                if(isset($employee['address']) && $employee['address']) $data['address'] = $employee['address'];
                if(isset($employee['state']) && $employee['state']) $data['state'] = $employee['state'];
                if(isset($employee['city']) && $employee['city']) $data['city'] = $employee['city'];
                if(isset($employee['district']) && $employee['district']) $data['district'] = $employee['district'];
                if(isset($employee['id_number']) && $employee['id_number']) $data['id_number'] = $employee['id_number'];
                if(isset($employee['phone_number']) && $employee['phone_number']) $data['phone_number'] = $employee['phone_number'];
                /* End of basic information */

                if(isset($employee['join_date'])){ 
                    $join_date = DatetimeHelper::createDateTimeObject($employee['join_date'],explode(',',$allowed_datetime_format));
                    $data['join_date'] =  $join_date ? $join_date->format('Y-m-d H:i:s') : null;
                }
                if(isset($employee['employment_start_date'])){ 
                    $employment_start_date = DatetimeHelper::createDateTimeObject($employee['employment_start_date'],explode(',',$allowed_datetime_format));
                    $data['employment_start_date'] =  $employment_start_date ? $employment_start_date->format('Y-m-d H:i:s') : null;
                }
                if(isset($employee['employment_end_date'])){ 
                    $employment_end_date = DatetimeHelper::createDateTimeObject($employee['employment_end_date'],explode(',',$allowed_datetime_format));
                    $data['employment_end_date'] = $employment_end_date ? $employment_end_date->format('Y-m-d H:i:s') : null;
                }
                if(isset($employee['terminate_date'])){ 
                    $terminate_date = DatetimeHelper::createDateTimeObject($employee['terminate_date'],explode(',',$allowed_datetime_format));
                    $data['terminate_date'] = $terminate_date ? $terminate_date->format('Y-m-d H:i:s') : null;
                }
                if(isset($employee['pension_date'])) {
                    $pension_date = DatetimeHelper::createDateTimeObject($employee['pension_date'],explode(',',$allowed_datetime_format));
                    $data['pension_date'] =  $pension_date ? $pension_date->format('Y-m-d H:i:s') : null;
                }
                if(isset($employee['resignation'])) $data['resignation'] = $employee['resignation'];
                if(isset($employee['bank_branch'])) $data['bank_branch'] = $employee['bank_branch'];
                if(isset($employee['bank_account'])) $data['bank_account'] = $employee['bank_account'];
                if(isset($employee['marital_status'])) $data['marital_status'] = $employee['marital_status'];
                if(isset($employee['insurance_number'])) $data['insurance_number'] = $employee['insurance_number'];
                if(isset($employee['tax_number'])) $data['tax_number'] = $employee['tax_number'];
                
                if($job_grade) $data['job_grade_id'] = $job_grade->id;
                if($job_position) $data['job_position_id'] = $job_position->id;
                if($religion) $data['religion_id'] = $religion->id;
                if($job_position) $data['job_position_id'] = $job_position->id;
                if($work_location) $data['work_location_id'] = $work_location->id;
                if($tax_status) $data['tax_status_id'] = $tax_status->id;
                if($employment_status) $data['employment_status_id'] = $employment_status->id;
                if(isset($employee['status'])) $data['status'] = $employee['status'];

                $employee = Employee::create($data);
                
                $employees[] = $data;
            }
            $this->mappedData = $employees;
            DB::commit(); 
        }  catch (Exception $e) {
            DB::rollBack();
            $this->errors = [
                $e->getMessage()
            ];
        }
    
        return $employees;
    }
    
    public function getMappedData(): array
    {
        return $this->mappedData;
    }

    public function getErrors()
    {
        return $this->errors;
    }

    public function headingRow(): int
    {
        return 1;
    }


    public function chunkSize(): int
    {
        return 1000; 
    }
}
