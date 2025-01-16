<?php

namespace App\Http\Resources;

use App\Http\Resources\Common\JobGradeResource;
use App\Http\Resources\Common\JobPositionResource;
use App\Http\Resources\Common\WorkLocationResource;
use App\Services\HashIdService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LeaveRequestResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $hashid = new HashIdService();
        $data = [
            'id' => $hashid->encode($this->id),
            'code' => $this->code,
            'employee_d' => $hashid->encode($this->employee_d),
            'employee' => $this->whenLoaded('employee', function() use($hashid) {
                            return [
                                'id' => $hashid->encode($this->employee->id),
                                'code' => $this->employee->code,
                                'name' => $this->employee->name,
                                'gender' => $this->employee->gender,
                                'work_location' => ($this->employee->workLocation ?  new WorkLocationResource($this->employee->workLocation) : null),
                                'job_grade' => ($this->employee->jobGrade ? new JobGradeResource($this->employee->jobGrade) : null),
                                'job_position' => ($this->employee->jobPosition? new JobPositionResource($this->employee->jobPosition) : null),
                            ];
                        }),
            'notes' => $this->notes,
            'start' => $this->start,
            'end' => $this->end,
            'status' => $this->status,
            'created_by' => $this->whenLoaded('createdBy', fn() => $this->createdBy),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'status' => $this->status,
        ];
        return $data;
    }
}
