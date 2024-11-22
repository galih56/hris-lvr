<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
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
        $data = [
            'id' => $hashid->encode($this->id), 
            'name' => $this->name,
        ];

        return $data;
    }
}
