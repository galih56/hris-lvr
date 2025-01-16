<?php

namespace App\Http\Requests\LeaveRequest;

use App\Enums\ApprovalStatus;
use App\Rules\EnumRule;
use App\Services\HashIdService;
use Illuminate\Foundation\Http\FormRequest;

class UpdateLeaveRequestRequest extends FormRequest
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
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'employee_id' => [
                'nullable',
                'integer',
                'required_if:role_code,EMP,HR',
                function ($attribute, $value, $fail) {
                    if (!\DB::table('employees')->where('id', $value)->exists()) {
                        $fail('The employee ID does not exist in the employees table.');
                    }
                },
            ],
            'notes' => ['nullable'],
            'start' => ['required', 'date'],	
            'end' => ['required', 'date'],	
            'status' => ['required', new EnumRule(ApprovalStatus::class, 'Please select a valid status.')],
        ];
    }

}
