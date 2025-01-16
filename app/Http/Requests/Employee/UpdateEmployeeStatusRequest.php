<?php

namespace App\Http\Requests\Employee;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEmployeeStatusRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'status' => [
                'required',
                Rule::in(['active', 'inactive']), // Define allowed statuses
            ],
            'terminate_reason_id' => [
                'required_if:status,inactive', // Only required if status is 'terminated'
                'nullable',
                Rule::exists('terminate_reasons', 'id'), // Must exist in terminate_reasons table
            ],
            'resignation' => [
                'nullable',
                'string',
                'max:255', // Adjust the max length if needed
            ],
        ];
    }

    /**
     * Customize error messages.
     *
     * @return array<string, string>
     */
    public function messages()
    {
        return [
            'status.required' => 'Employee status is required.',
            'status.in' => 'Invalid status. Allowed values are active or terminated.',
            'terminate_reason_id.required_if' => 'Termination reason is required when terminating the employee.',
            'terminate_reason_id.exists' => 'The selected termination reason is invalid.',
            'resignation.string' => 'Resignation details must be a valid string.',
            'resignation.max' => 'Resignation details cannot exceed 255 characters.',
        ];
    }
}
