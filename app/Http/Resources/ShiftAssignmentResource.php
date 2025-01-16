<?php

namespace App\Http\Resources;

use App\Http\Resources\Common\JobGradeResource;
use App\Http\Resources\Common\JobPositionResource;
use App\Http\Resources\Common\WorkLocationResource;
use App\Services\HashIdService;
use Hashids\Hashids;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShiftAssignmentResource extends JsonResource
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
            'notes' => $this->notes,
            'status' => $this->status,
            'effective_date' => $this->effective_date,
            'end' => $this->end,
            'shift' => $this->whenLoaded('shift', fn() => new ShiftResource($this->shift)),
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
        ];
        
        return $data;
    }
}
