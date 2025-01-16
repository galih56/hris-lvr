<?php

namespace App\Imports;

use App\Models\Common\OrganizationUnit;
use App\Models\Common\Department;
use App\Models\Common\JobGrade;
use App\Models\Common\JobPosition;
use App\Models\Common\TaxStatus;
use App\Models\Common\EmploymentStatus;
use Maatwebsite\Excel\Concerns\ToArray;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Facades\Validator;
use DB;

class JobPositionMapImport implements ToArray, WithHeadingRow
{
    protected $mappedData = [];
    protected $errors = [];
    private function abbreviate($departmentName) {
        $departmentName = preg_replace('/\([^)]*\)|[()]/', '', $departmentName);
        // Remove vowels (vocal alphabets) from the department name
        $departmentNameWithoutVowels = preg_replace('/[aeiouAEIOU]/', '', $departmentName);
        
        // Split the department name into words
        $words = explode(' ', $departmentNameWithoutVowels);
        
        // Initialize an array to hold the abbreviations
        $abbreviatedName = [];

        // Loop through each word
        foreach ($words as $i => $word) {
            // Check if the word contains '&'
            if (str_contains($word, '&')) {
                // Split the word by '&' and take the first 2 characters from each part
                $parts = explode('&', $word);
                foreach ($parts as $part) {
                    // Take the first 2 characters from each part after removing vowels and spaces
                    $abbreviatedName[] = strtoupper(substr($part, 0, 1)); 
                }
            } else {
                if($i == 0) $abbreviatedName[] = strtoupper(substr($departmentName, 0, 2));
                else $abbreviatedName[] = strtoupper(substr(str_replace(' ', '', $word), 0, 2));
                
            }
        }
        
        // Join the letters into a single string
        $abbreviatedName = implode('', $abbreviatedName);
        return $abbreviatedName;
    }
    
    public function array(array $rows)
    {
        $allowed_datetime_format =  'multi_date_format:Y-m-d H:i:s,d-m-Y H:i,d-m-Y H:i';

        $organization_units = [];
        $validator = Validator::make($rows, [
            '*.job_position' => 'required|string',
            '*.area' => 'required|string',
            '*.division' => 'required|string',
            '*.department' => 'required|string',
            '*.supervisor' => 'nullable|string',
            '*.coordinator' => 'nullable|string',
            '*.job_grade_code' => 'required|string|exists:job_grades,code',
            '*.status' => 'nullable|string',
            '*.manager' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            $this->errors = $validator->errors();
            return $this->mappedData = [];
        }
        try{

            foreach ($rows as $row) {
                // Hierarchical Organization Unit Processing
                $organization_unit_codes = [];
                $organization_unit = null;

                $ou['department'] = $row['department'];
                $ou['division'] = $row['division'];
                $ou['area'] = $row['area'];
                $ou['job_position'] = $row['job_position'];
                $ou['job_grade_code'] = $row['job_grade_code'];
                $ou['manager'] = $row['manager'];

                $job_grade = JobGrade::where('code',$row['job_grade_code'])->first();
                $job_position = null;
                $department = null;
                // Process Department
                if ($row['department']) {
                    $department_code = $this->abbreviate($row['department']);
                    $department = Department::updateOrCreate(
                        ['code' => $department_code],
                        ['code' => $department_code, 'name' => $row['department']]
                    );
                    $organization_unit = OrganizationUnit::updateOrCreate(
                        ['code' => $department_code],
                        ['code' => $department_code, 'name' => $row['department']]
                    );
                    $ou['ou_department_id'] = $organization_unit->id;
                    $ou['ou_department_code'] = $organization_unit->code;
                    $organization_unit_codes[] = $department_code;
                    
                }
        
                // Process Division
                if ($row['division']) {
                    $division_code =  $this->abbreviate($row['division']) ;
                    $organization_unit_codes[] = $division_code;

                    $ou_division_code =  implode('-', $organization_unit_codes);
                    $organization_unit = OrganizationUnit::updateOrCreate(
                        ['code' => $ou_division_code],
                        ['code' => $ou_division_code, 'name' => $row['division'], 'parent_id' => $organization_unit->id]
                    );
                    $ou['ou_division_id'] = $organization_unit->id;
                    $ou['ou_division_code'] = $organization_unit->code;

                    
                    if(empty($row['job_position']) && empty($row['area'])){
                        $ou_job_position_code = implode('-', $organization_unit_codes).'-'.($job_grade ? $job_grade->code : '');
                        $job_position = JobPosition::updateOrCreate(
                            ['code' => $ou_job_position_code],
                            [
                                'code' => $ou_job_position_code, 
                                'name' => $row['job_position'],
                                'status' => isset($row['status']) ? $row['status'] :'active',
                                'organization_unit_id' => $organization_unit->id,
                                'job_grade_id' => $job_grade->id
                            ]
                        );
                        $ou['ou_job_position_id'] = $organization_unit->id;
                        $ou['ou_job_position_code'] = $ou_job_position_code;
                    }
                }
        
                // Process Area
                if ($row['area']) {
                    $area_code =  $this->abbreviate($row['area']);

                    $organization_unit_codes[] = $area_code;
                    $ou_area_code =  implode('-', $organization_unit_codes);

                    $organization_unit = OrganizationUnit::updateOrCreate(
                        ['code' => $ou_area_code],
                        ['code' => $ou_area_code, 'name' => $row['area'], 'parent_id' => $organization_unit->id]
                    );
                    $ou['ou_area_id'] = $organization_unit->id;
                    $ou['ou_area_code'] = $organization_unit->code;

                    if(empty($row['job_position'])){
                        $ou_job_position_code = implode('-', $organization_unit_codes).'-'.($job_grade ? $job_grade->code : '');
                        $job_position = JobPosition::updateOrCreate(
                            ['code' => $ou_job_position_code],
                            [
                                'code' => $ou_job_position_code, 
                                'name' => $row['job_position'],
                                'status' => isset($row['status']) ? $row['status'] :'active',
                                'organization_unit_id' => $organization_unit->id,
                                'job_grade_id' => $job_grade->id
                            ]
                        );
                        $ou['ou_job_position_id'] = $organization_unit->id;
                        $ou['ou_job_position_code'] = $ou_job_position_code;
                    }
                }
        
                // Process Job Position
                if ($row['job_position'] && empty($job_position)) {
                    $job_position_code = $this->abbreviate($row['job_position']);
                    $organization_unit_codes[] = $job_position_code; 
                    $ou_job_position_code = implode('-', $organization_unit_codes).'-'.($job_grade ? $job_grade->code : '');
                    $organization_unit = OrganizationUnit::updateOrCreate(
                        ['code' => $ou_job_position_code],
                        [
                            'code' => $ou_job_position_code, 
                            'name' => $row['job_position'], 
                            'parent_id' => $organization_unit->id,
                        ]
                    );

                    $data =  [
                        'code' => $ou_job_position_code, 
                        'name' => $row['job_position'],
                        'status' => isset($row['status']) ? $row['status'] :'active',
                        'organization_unit_id' => $organization_unit->id,
                        'job_grade_id' => $job_grade->id
                    ];

                    if($department){
                        $data['department_id'] = $department->id;
                    }

                    $job_position = JobPosition::updateOrCreate(
                        ['code' => $ou_job_position_code],
                       $data
                    );
                    $ou['ou_job_position_id'] = $organization_unit->id;
                    $ou['ou_job_position_code'] = $ou_job_position_code;
                }
                $ou['job_position_id'] = $job_position->id;
                $organization_units[] = $ou;
            
            }
        $this->mappedData  =  $organization_units;
            }catch(\Exception $e){
                
            }
    }

    /**
     * Get the mapped data.
     *
     * @return array
     */
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
}
