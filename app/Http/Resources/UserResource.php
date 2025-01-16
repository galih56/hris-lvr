<?php

namespace App\Http\Resources;

use App\Services\HashIdService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'employee_id' => $hashid->encode($this->employee_id), 
            'name' => $this->name,
            'username' => $this->username,
            'email' => $this->email,
            'role' => $this->whenLoaded('role', fn() => ([
                'id' => $hashid->encode($this->role->id), 
                'code' => $this->role->code,
                'name' => $this->role->name,
            ])),
            'employee' => $this->whenLoaded('employee', fn() => ([
                'id' => $hashid->encode($this->employee->id), 
                'code' => $this->employee->code,
                'name' => $this->employee->name,
                'jobPosition' => $this->when(
                    $this->relationLoaded('employee') && $this->employee->relationLoaded('jobPosition'),
                    fn() => [
                        'id' => $hashid->encode($this->employee->jobPosition->id),
                        'name' => $this->employee->jobPosition->name,
                        'department' => $this->when(
                            $this->employee->jobPosition->relationLoaded('department'),
                            fn() => [
                                'id' => $hashid->encode($this->employee->jobPosition->department->id),
                                'name' => $this->employee->jobPosition->department->name,
                            ]
                        )
                    ]
                ),
                'created_at' => $this->employee->created_at,
            ])),
            'updated_at' => $this->updated_at,
            'created_at' => $this->created_at
        ];

        return $data;
    }
}
