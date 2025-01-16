<?php

namespace App\Http\Resources;

use App\Http\Resources\Common\JobGradeResource;
use App\Http\Resources\Common\JobPositionResource;
use App\Http\Resources\Common\WorkLocationResource;
use App\Models\Common\JobPosition;
use App\Services\HashIdService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttendanceResource extends JsonResource
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
            'check_in' => $this->check_in,
            'check_in_photo' => $this->check_in_photo,
            'check_in_latitude' => $this->check_in_latitude,
            'check_in_longitude' => $this->check_in_longitude,
            'check_out' => $this->check_out,
            'check_out_photo' => $this->check_out_photo,
            'check_out_latitude' => $this->check_out_latitude,
            'check_out_longitude' => $this->check_out_longitude,
            'hours_worked' => $this->hours_worked,
            'notes' => $this->notes,
            'status' => $this->status,

            'latitute' => $this->latitute,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            'corrected' => $this->corrected,
            'corrected_by' => $this->whenLoaded('correctedBy', fn() => $this->correctedBy),
            'corrected_at' => $this->corrected_at
        ];
        return $data;
    }
}
