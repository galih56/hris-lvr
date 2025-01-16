<?php

namespace App\Http\Resources\Common;

use App\Services\HashIdService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReligionResource extends JsonResource
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
            'name' => $this->name,
        ];
        return $data;
    }
}
