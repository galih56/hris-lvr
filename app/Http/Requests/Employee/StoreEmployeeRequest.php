<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\Gender;
use App\Rules\EnumRule;

class StoreEmployeeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        
        return [
            'code' => ['required'],
            'name' => ['required'],
            'email' => ['nullable','email'],
            'gender' => ['required'],
            'join_date' => ['required'],
            'birth_place' => ['required'],
            'birth_date' => ['required'],
            'id_number' => ['required'],
            'gender' => ['required', new EnumRule(Gender::class, 'Please select a valid gender.')],
            'employment_start_date' => 'nullable|date_format:Y-m-d H:i:s', 
            'employment_end_date' => 'nullable|date_format:Y-m-d H:i:s|after_or_equal:employment_start_date',
            'terminate_date' => ['nullable','date_format:Y-m-d H:i:s'],
            'pension_date' => ['required'],
            'phone_number' => ['nullable'],
            'resignation' => ['nullable'],
            'bank_branch' => ['required'],
            'bank_account' => ['required'],
            'marital_status' => ['required'],
            'status' => ['required'],
            'insurance_number' => ['required'],
            'tax_number' => ['nullable'],
    
            'religion_id' => ['required'],
            'tax_status_id' => ['required'],
            'terminate_reason_id' => ['nullable'],
            'work_location_id' => ['required'],
            'directorate_id' => ['required'],
            'job_grade_id' => ['required'],
            'employment_status_id' => ['required'],
            'job_position_id' => ['required'],
            // 'organization_unit_id' => [],
            // 'outsource_vendor_id' => [],
        ];
    }
}
