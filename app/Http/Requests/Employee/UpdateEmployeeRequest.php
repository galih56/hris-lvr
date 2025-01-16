<?php

namespace App\Http\Requests\Employee;

use App\Enums\Gender;
use App\Rules\EnumRule;
use App\Services\HashIdService;
use Illuminate\Foundation\Http\FormRequest;

class UpdateEmployeeRequest extends FormRequest
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
     *
     * @return void
     */
    public function prepareForValidation(): void
    {
        $this->merge([
            'religion_id' => (new HashIdService())->decode($this->input('religion_id')),
            'tax_status_id' => (new HashIdService())->decode($this->input('tax_status_id')),
            'terminate_reason_id' => (new HashIdService())->decode($this->input('terminate_reason_id')),
            'work_location_id' => (new HashIdService())->decode($this->input('work_location_id')),
            'job_grade_id' => (new HashIdService())->decode($this->input('job_grade_id')),
            'employment_status_id' => (new HashIdService())->decode($this->input('employment_status_id')),
            'job_position_id' => (new HashIdService())->decode($this->input('job_position_id')),
        ]);
    }
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email'],
            'gender' => ['required', new EnumRule(Gender::class, 'Please select a valid gender.')],
            'join_date' => ['required', 'date'],
            'birth_place' => ['required', 'string', 'max:255'],
            'birth_date' => ['required', 'date'],
            'id_number' => ['required', 'string', 'max:50'],
            'employment_dates.employment_start_date' => ['required', 'date', 'before:employment_dates.employment_end_date'],
            'employment_dates.employment_end_date' => ['required', 'date', 'after:employment_dates.employment_start_date'],
            'terminate_date' => ['nullable', 'date'],
            'pension_date' => ['nullable', 'date'],
            'phone_number' => ['nullable', 'string', 'max:15'],
            'bank_branch' => ['required', 'string', 'max:255'],
            'bank_account' => ['required', 'string', 'max:50'],
            'marital_status' => ['required', 'string', 'max:50'],
            'tax_number' => ['nullable', 'string', 'max:50'],

            'religion_id' => ['required', 'exists:religions,id'],
            'tax_status_id' => ['required', 'exists:tax_statuses,id'],
            'terminate_reason_id' => ['nullable', 'exists:terminate_reasons,id'],
            'work_location_id' => ['required', 'exists:work_locations,id'],
            'job_grade_id' => ['required', 'exists:job_grades,id'],
            'employment_status_id' => ['required', 'exists:employment_statuses,id'],
            'job_position_id' => ['required', 'exists:job_positions,id'],
        ];
    }

    /**
     * Get custom error messages for validation rules.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'The employee name is required.',
            'email.email' => 'Please provide a valid email address.',
            'gender.required' => 'The gender is required.',
            'join_date.required' => 'The join date is required.',
            'birth_place.required' => 'The birth place is required.',
            'birth_date.required' => 'The birth date is required.',
            'id_number.required' => 'The ID number is required.',
            'employment_dates.employment_start_date.required' => 'The employment start date is required.',
            'employment_dates.employment_end_date.required' => 'The employment end date is required.',
            'employment_dates.employment_end_date.after' => 'The employment end date must be after the start date.',
            'employment_dates.employment_start_date.before' => 'The employment start date must be before the end date.',
            'pension_date.required' => 'The pension date is required.',
            'bank_branch.required' => 'The bank branch is required.',
            'bank_account.required' => 'The bank account number is required.',
            'marital_status.required' => 'The marital status is required.',
            'status.required' => 'The employment status is required.',
            'religion_id.exists' => 'The selected religion does not exist.',
            'tax_status_id.exists' => 'The selected tax status does not exist.',
            'terminate_reason_id.exists' => 'The selected termination reason does not exist.',
            'work_location_id.exists' => 'The selected work location does not exist.',
            'job_grade_id.exists' => 'The selected job grade does not exist.',
            'employment_status_id.exists' => 'The selected employment status does not exist.',
            'job_position_id.exists' => 'The selected job position does not exist.',
        ];
    }
}
