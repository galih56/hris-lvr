<?php 
namespace App\Services;

use Carbon\Carbon;
use App\Models\Employee;

class EmployeeCodeService
{
    /**
     * Count the number of employees who joined in the same month and year.
     *
     * @param int $year
     * @param int $month
     * @return int
     */
    private static function countEmployeesJoinedInMonth(int $year, int $month, string $employeeTypeCode): int
    {
        // Use Eloquent to count employees joined in the given month and year, and by employee type
        return Employee::whereYear('join_date', $year)
                       ->whereMonth('join_date', $month)
                       ->where('code', 'like', "$employeeTypeCode%")
                       ->count();
    }

    /**
     * Generate an employee code based on the join date and employee type.
     *
     * @param string|Carbon $joinDate
     * @param string $employeeTypeCode
     * @return string
     */
    public static function generateEmployeeCode(string|Carbon $joinDate, string $employeeTypeCode): string
    {
        // Parse the join date into a Carbon instance if it's a string
        $joinDateObj = $joinDate instanceof Carbon ? $joinDate : Carbon::parse($joinDate);
        $year = $joinDateObj->year;  // Get year
        $month = $joinDateObj->month; // Get month

        // Get the count of employees who joined in the same month and year, and by employee type
        $employeeCount = self::countEmployeesJoinedInMonth($year, $month, $employeeTypeCode);

        // Generate the employee code as "EMP" or any other employee code type + year + month + (employee count + 1)
        $employeeCode = $employeeTypeCode . $year . str_pad($month, 2, '0', STR_PAD_LEFT) . str_pad(($employeeCount + 1), 3, '0', STR_PAD_LEFT);

        return $employeeCode;
    }

    /**
     * Find the first empty slot in the sequence of employee codes for a specific employee type.
     *
     * @param string|Carbon $joinDate
     * @param string $employeeTypeCode
     * @return string|null
     */
    public static function findFirstEmptySlot(string|Carbon $joinDate, string $employeeTypeCode): ?string
    {
        // Parse the join date into a Carbon instance if it's a string
        $joinDateObj = $joinDate instanceof Carbon ? $joinDate : Carbon::parse($joinDate);
        $year = $joinDateObj->year;
        $month = $joinDateObj->month;

        // Generate base code format (without the number part) using employee type code
        $baseEmployeeCode = $employeeTypeCode . $year . str_pad($month, 2, '0', STR_PAD_LEFT);

        // Get all employee codes for the specified month, year, and employee type
        $employeeCodes = Employee::whereYear('join_date', $year)
                                 ->whereMonth('join_date', $month)
                                 ->where('code', $employeeTypeCode)
                                 ->pluck('employee_code')
                                 ->toArray();

        // Extract the numeric part of the codes
        $existingNumbers = array_map(function ($code) use ($baseEmployeeCode) {
            return (int) substr($code, strlen($baseEmployeeCode));
        }, $employeeCodes);

        // Sort the numbers
        sort($existingNumbers);

        // Find the first empty slot
        for ($i = 1; $i <= count($existingNumbers) + 1; $i++) {
            if (!in_array($i, $existingNumbers)) {
                // Return the first available employee code with the missing number
                return $baseEmployeeCode . str_pad($i, 3, '0', STR_PAD_LEFT);
            }
        }

        return null; // No empty slot found
    }
}
