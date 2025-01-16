<?php

namespace App\Http\Resources\Common;

use App\Services\HashIdService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DepartmentResource extends JsonResource
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
            'updated_at' => $this->whenLoaded('updated_at', fn() => $this->updated_at),
            'created_at' => $this->whenLoaded('created_at', fn() => $this->created_at),
        ];
        
        return $data;
    }
}
