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
        Schema::create('career_transitions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('code');
            $table->unsignedBigInteger('employee_id');
            $table->foreign('employee_id')->references('id')->on('employees');
            
            $table->unsignedInteger('prev_job_grade_id');
            $table->unsignedInteger('prev_employment_status_id');
            $table->unsignedBigInteger('prev_cost_center_id');
            $table->unsignedBigInteger('prev_job_position_id');
            $table->unsignedBigInteger('prev_work_location_id');
            $table->unsignedBigInteger('prev_organization_unit_id');


            $table->unsignedInteger('new_job_grade_id');
            $table->unsignedInteger('new_employment_status_id')->nullable();
            $table->unsignedBigInteger('new_cost_center_id');
            $table->unsignedBigInteger('new_job_position_id');
            $table->unsignedBigInteger('new_work_location_id');
            $table->unsignedBigInteger('new_organization_unit_id');

            $table->datetime('effective_date')->notNullable();

            $table->foreign('prev_cost_center_id')->references('id')->on('cost_centers');
            $table->foreign('prev_employment_status_id')->references('id')->on('employment_statuses');
            $table->foreign('prev_job_position_id')->references('id')->on('job_positions');
            $table->foreign('prev_work_location_id')->references('id')->on('work_locations');
            $table->foreign('prev_job_grade_id')->references('id')->on('job_grades');
            $table->foreign('prev_organization_unit_id')->references('id')->on('organization_units');

            $table->foreign('new_cost_center_id')->references('id')->on('cost_centers');
            $table->foreign('new_employment_status_id')->references('id')->on('employment_statuses');
            $table->foreign('new_job_position_id')->references('id')->on('job_positions');
            $table->foreign('new_work_location_id')->references('id')->on('work_locations');
            $table->foreign('new_job_grade_id')->references('id')->on('job_grades');
            $table->foreign('new_organization_unit_id')->references('id')->on('organization_units');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('career_transitions');
    }
};
