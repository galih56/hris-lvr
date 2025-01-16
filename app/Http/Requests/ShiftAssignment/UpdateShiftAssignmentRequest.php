<?php

namespace App\Http\Requests\ShiftAssignment;

use App\Services\HashIdService;
use Illuminate\Foundation\Http\FormRequest;

class UpdateShiftAssignmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }


    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {

        if ($this->filled('employee_id')) {
            // Decode the employee ID
            $hashid = new HashIdService();
            $decodedId = $hashid->decode($this->input('employee_id'));

            if (!empty($decodedId)) {
                // Replace employee_id with the decoded ID
                $this->merge([
                    'employee_id' => $decodedId,
                ]);
            }
        }

        if ($this->filled('shift_id')) {
            // Decode the employee ID
            $hashid = new HashIdService();
            $decodedId = $hashid->decode($this->input('shift_id'));

            if (!empty($decodedId)) {
                // Replace shift_id with the decoded ID
                $this->merge([
                    'shift_id' => $decodedId,
                ]);
            }
        }
    }
    
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        
        return [
            'employee_id' => 'required|integer|exists:employees,id', 
            'shift_id' => 'required|integer|exists:shifts,id',
            'effective_date' => 'required|date', 
            'end' => 'nullable|date',
            'status' => 'required|in:active,inactive', // Enum values for status
            'description' => 'nullable|string',
        ];
    }
}
