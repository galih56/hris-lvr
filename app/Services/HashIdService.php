<?php

namespace App\Services;

use Hashids\Hashids;

class HashIdService
{
    protected $hashids;

    public function __construct()
    {
        $this->hashids = new Hashids(env('HASHID_SALT'), 15);
    }

    public function decode($hashid)
    {
        $decoded = $this->hashids->decode($hashid);

        return !empty($decoded) ? $decoded[0] : null;
    }

}
