<?php

namespace App\Http\Requests\Attendance;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\EnumRule;
use Illuminate\Support\Facades\Auth;

class StoreAttendanceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'current_date_time' => 'required|date|before_or_equal:now',
            'photo' => 'required|mimes:jpg,jpeg,png,gif,webp|max:5120|dimensions:max_width=4000,max_height=4000',
            'location.longitude' => 'nullable|numeric|min:-180|max:180',
            'location.latitude' => 'nullable|numeric|min:-90|max:90',
        ];
    }

    /**
     * Get the validation messages for the request.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'current_date_time.required' => 'Current date and time is required.',
            'current_date_time.date' => 'Current date must be in date format',
            'required' => 'The photo field is required.',
            'mimes' => 'The photo must be a file of type: jpg, jpeg, png, gif, webp.',
            'max' => 'The photo must not be greater than 5 MB.',
            'dimensions' => 'The photo must not exceed 4000px in width or 4000px in height.',
            'location.longitude.numeric' => 'Longitude must be a number.',
            'location.longitude.min' => 'Longitude must be greater than or equal to -180.',
            'location.longitude.max' => 'Longitude must be less than or equal to 180.',
            'location.latitude.numeric' => 'Latitude must be a number.',
            'location.latitude.min' => 'Latitude must be greater than or equal to -90.',
            'location.latitude.max' => 'Latitude must be less than or equal to 90.',
        ];
    }

    /**
     * Transform the validated data if necessary.
     *
     * @return array
     */
    public function validatedData(): array
    {
        $data = parent::validated();

        // Convert the current_date_time to a Carbon instance for easier manipulation
        $data['current_date_time'] = \Carbon\Carbon::parse($data['current_date_time']);

        return $data;
    }
}
