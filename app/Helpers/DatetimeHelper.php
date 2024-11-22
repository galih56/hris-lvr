<?php
namespace App\Helpers;
use Carbon\Carbon;

class DatetimeHelper {
    public function convertToCarbon($date)
    {
        $formats = ['d-m-Y H:i:s', 'd-m-Y', 'd-m-Y H:i'];

        foreach ($formats as $format) {
            $parsed = $date;
            try {
                $parsed = Carbon::createFromFormat($format, $date);
            } catch (\Throwable $th) {
                $parsed = $date;
            }

            if ($parsed && !is_string($parsed) && $parsed->format($format) === $date) {
                return $parsed->toDateTimeString();
            }
        }

        return null;
    }
}