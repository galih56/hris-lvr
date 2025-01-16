<?php

namespace App\Http\Resources;

use App\Services\HashIdService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LeaveTypeResource extends JsonResource
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
            'name' => $this->name,
            'eligibility_days' => $this->eligibility_days,
            'day_type' => $this->day_type,
            'deducted_leave' => $this->deducted_leave,
            'day_count' => $this->day_count,
            'repeat_period' => $this->repeat_period,
        ];
        return $data;
    }
}
