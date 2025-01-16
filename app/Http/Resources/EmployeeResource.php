<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Common\ReligionResource;
use App\Http\Resources\Common\JobPositionResource;
use App\Http\Resources\Common\JobGradeResource;
use App\Http\Resources\Common\OrganizationUnitResource;
use App\Http\Resources\Common\TaxStatusResource;
use App\Http\Resources\Common\TerminateReasonResource;
use App\Http\Resources\Common\EmploymentStatusResource;
use App\Http\Resources\Common\WorkLocationResource;
use App\Http\Resources\Common\OutsourceVendorResource;
use Hashids\Hashids;

class EmployeeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $hashid = new Hashids(env('HASHID_SALT'), 15);
        
        if ($request->routeIs('employees.search')) {
            return [
                'id' => $hashid->encode($this->id),
                'name' => $this->name,    
                'employment_status' => $this->whenLoaded('employmentStatus', fn() => [
                    'id' => $hashid->encode($this->employmentStatus->id),
                    'code' => $this->employmentStatus->code,
                    'name' => $this->employmentStatus->name,
                ]),
                'outsource_vendor' => $this->whenLoaded('outsourceVendor', fn() => [
                    'id' => $hashid->encode($this->outsourceVendor->id),
                    'name' => $this->outsourceVendor->name,
                ]),
                'work_location' => $this->whenLoaded('workLocation', fn() => [
                    'id' => $hashid->encode($this->workLocation->id),
                    'code' => $this->workLocation->code,
                    'name' => $this->workLocation->name,
                ]),
                'job_grade' => $this->whenLoaded('jobGrade', fn() => [
                    'id' => $hashid->encode($this->jobGrade->id),
                    'code' => $this->jobGrade->code,
                    'name' => $this->jobGrade->name,
                ]),
                'job_position' => $this->whenLoaded('jobPosition', fn() => [
                    'id' => $hashid->encode($this->jobPosition->id),
                    'name' => $this->jobPosition->name,
                ]),
                'organization_unit' => $this->whenLoaded('organizationUnit', fn() => [
                    'id' => $hashid->encode($this->organizationUnit->id),
                    'code' => $this->organizationUnit->code,
                    'name' => $this->organizationUnit->name,
                ]),
            ];
        }

        $data = [
            'id' => $hashid->encode($this->id), 
            'code' => $this->code,
            'name' => $this->name,
            'email' => $this->email,
            'marital_status' => $this->marital_status,
            'address' => $this->address,
            'state' => $this->state,
            'city' => $this->city,
            'district' => $this->district,
            'birth_place' => $this->birth_place,
            'birth_date' => $this->birth_date,
            'id_number' => $this->id_number,
            'gender' => $this->gender,
            'join_date' => $this->join_date,
            'insurance_number' => $this->insurance_number,
            'tax_number' => $this->tax_number,
            'organization_unit' => $this->organization_unit,
            'status' => $this->status,
            'employment_start_date' => $this->employment_start_date,
            'employment_end_date' => $this->employment_end_date,
            'terminate_date' => $this->terminate_date,
            'pension_date' => $this->pension_date,
            'phone_number' => $this->phone_number,
            'resignation' => $this->resignation,
            'bank_branch' => $this->bank_branch,
            'bank_account' => $this->bank_account,
            'tax_status' => $this->whenLoaded('taxStatus', fn() => new TaxStatusResource($this->taxStatus)),
            'religion' => $this->whenLoaded('religion', fn() => new ReligionResource($this->religion)),
            
            'terminate_reason' => $this->whenLoaded('terminateReason', fn() => new TerminateReasonResource($this->terminateReason)),
            'employment_status' => $this->whenLoaded('employmentStatus', fn() => new EmploymentStatusResource($this->employmentStatus)),
            'outsource_vendor' => $this->whenLoaded('outsourceVendor', fn() => new OutsourceVendorResource($this->outsourceVendor)),
            'work_location' => $this->whenLoaded('workLocation', fn() => new WorkLocationResource($this->workLocation)),
            'job_grade' => $this->whenLoaded('jobGrade', fn() => new JobGradeResource($this->jobGrade)),
            'job_position' => $this->whenLoaded('jobPosition', fn() => new JobPositionResource($this->jobPosition)),
            'organization_unit' => $this->whenLoaded('organizationUnit', fn() => new OrganizationUnitResource($this->organizationUnitResource)),
        ];

        return $data;
    }
}
