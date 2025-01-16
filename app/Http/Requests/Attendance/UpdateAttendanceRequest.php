<?php

namespace App\Http\Requests\Attendance;

use App\Enums\AttendanceStatus;
use App\Rules\EnumRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateAttendanceRequest extends FormRequest
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
            'check_in' => 'required_if:status,'.AttendanceStatus::PRESENT->value.'|date', 
            'check_out' => 'required_if:status,'.AttendanceStatus::PRESENT->value.'|date|after_or_equal:check_in',
            'notes' => ['nullable'],
            'status' => ['required', new EnumRule(AttendanceStatus::class, 'Please select a valid status.')],
        ];
    }

}
