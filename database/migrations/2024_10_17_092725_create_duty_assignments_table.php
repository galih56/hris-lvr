<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('duty_assignments', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('code',50);

            $table->unsignedBigInteger('employee_id');
            $table->unsignedBigInteger('job_position_id');
            $table->unsignedBigInteger('requester_id');

            // Foreign key constraints
            $table->foreign('employee_id')->references('id')->on('employees');
            $table->foreign('job_position_id')->references('id')->on('job_positions');
            $table->foreign('requester_id')->references('id')->on('employees'); // Updated to 'employees'

            // Additional columns
            $table->datetime('est_star')->notNullable();
            $table->datetime('est_end')->nullable();
            $table->datetime('real_start')->nullable();
            $table->datetime('real_end')->nullable();
            $table->string('description', 255)->nullable();
            $table->string('destination', 100)->nullable();
            $table->string('status', 50)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('duty_assignments');
    }
};
