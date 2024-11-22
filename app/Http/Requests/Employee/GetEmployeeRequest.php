<?php

namespace App\Http\Requests\Employee;

use App\Http\Requests\BaseRequest;
use App\Models\EmployeeCategory;


class GetEmployeeRequest extends BaseRequest
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
        // $drectorate = Directorate::pluck('code')->toArray();
        // return [
        //     'directorate' => ['required', 'array'], // Category should be an array
        //     'directorate.*' => ['in:' . implode(',', $categories)], // Each item in the array must be a valid directorate
        // ];
    }
    
}
