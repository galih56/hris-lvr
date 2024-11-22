<?php
namespace App\Console\Commands;

use App\Models\Logs\CronJobLog;
use App\Models\Employee;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Console\Command;

class SyncEmployeeData extends Command
{
    protected $signature = 'sync:employees';
    protected $description = 'Sync employee data from CI3';
    protected $batchSize;
    protected $fetchLimit;

    public function __construct($batchSize = 100, $fetchLimit = 100)
    {
        $this->batchSize = $batchSize;
        $this->fetchLimit = $fetchLimit; 
        parent::__construct();
    }

    public function handle()
    {
        // Start the cron job and log the start time
        $jobHistory = CronJobLog::create([
            'job_name' => 'SyncEmployeeData', 
            'model_class' => Employee::class, 
            'started_at' => now(),
            'status' => true,
        ]);

        // Get the last processed ID for this model from the job history
        $lastProcessedId = $jobHistory->last_processed_id ?? 0;

        // Fetch employee data from the external source based on the last processed ID
        $externalData = $this->fetchExternalEmployeeData($lastProcessedId);

        // If external data is empty, log and exit
        if (empty($externalData)) {
            Log::info("No new employee data to sync.");
            return;
        }

        // Loop through each fetched external data entry
        foreach ($externalData as $externalRecord) {
            // Sync or create the employee record in the local database
            $this->syncOrCreateEmployee($externalRecord);

            // Update the job history with the last processed ID
            $jobHistory->update([
                'last_processed_id' => $externalRecord['id'],
                'next_id' => $externalRecord['id'] + 1,
            ]);
        }

        // Mark the job as completed
        $jobHistory->update([
            'completed_at' => now(),
            'status' => true,
        ]);

        Log::info("Employee data sync job completed.");
    }

    /**
     * Fetch external employee data for a batch based on the last processed ID
     *
     * @param int $lastProcessedId
     * @return array
     */
    private function fetchExternalEmployeeData(int $lastProcessedId)
    {
        try {
            // Fetch data from external API using the last processed ID and limit
            $url = env('HCTRACKER_API') . '/employees';
            $response = Http::get($url, [
                'prev_id' => $lastProcessedId,
                'limit' => $this->fetchLimit,
            ]);

            // Check if the response is valid
            if ($response->successful()) {
                return $response->json(); // Expected to return an array of employee records
            } else {
                Log::error("Failed to fetch external employee data starting from ID: {$lastProcessedId}");
                return [];
            }
        } catch (\Exception $e) {
            Log::error("Error fetching external employee data: {$e->getMessage()}");
            return [];
        }
    }

    /**
     * Sync or create the local employee record based on the fetched external data
     *
     * @param array $externalData
     */
    private function syncOrCreateEmployee(array $externalData)
    {
        try {
            // Check if an employee record exists based on external ID
            $employee = Employee::where('external_id', $externalData['id'])->first();

            if ($employee) {
                // Update the existing employee record
                $employee->update([
                    'name' => $externalData['name'] ?? $employee->name,
                    'email' => $externalData['email'] ?? $employee->email,
                    'position' => $externalData['position'] ?? $employee->position,
                    // Add more fields as necessary
                ]);

                Log::info("Updated existing employee ID: {$employee->id}");
            } else {
                // Create a new employee record
                Employee::create([
                    'external_id' => $externalData['id'],
                    'name' => $externalData['name'],
                    'email' => $externalData['email'],
                    'position' => $externalData['position'],
                    // Add more fields as necessary
                ]);

                Log::info("Created new employee with external ID: {$externalData['id']}");
            }
        } catch (\Exception $e) {
            Log::error("Error syncing or creating employee data: {$e->getMessage()}");
        }
    }
}
