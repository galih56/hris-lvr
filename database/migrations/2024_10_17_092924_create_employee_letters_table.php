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
        Schema::create('employee_letters', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('code',150);
            $table->string('document_number', 100)->nullable();
            
            $table->unsignedInteger('job_grade_id');
            $table->unsignedBigInteger('employee_id');
            $table->unsignedBigInteger('cost_center_id');
            $table->unsignedInteger('employment_status_id');
            $table->unsignedBigInteger('job_position_id');
            $table->unsignedBigInteger('work_location_id');
            $table->unsignedBigInteger('organization_unit_id');
           

            $table->string('number', 150)->notNullable();
            $table->string('name', 250)->notNullable();
            $table->text('address')->nullable();
            $table->string('state', 100)->nullable();
            $table->string('city', 100)->nullable();
            $table->string('district', 100)->nullable();
            $table->string('birth_place', 200)->nullable();
            $table->datetime('birth_date')->nullable();
            $table->string('id_number', 200)->nullable();
            $table->tinyInteger('gender')->nullable();
            $table->string('religion', 50)->nullable();
            $table->datetime('join_date')->notNullable();

            $table->foreign('employee_id')->references('id')->on('employees');
            $table->foreign('cost_center_id')->references('id')->on('cost_centers');
            $table->foreign('employment_status_id')->references('id')->on('employment_statuses');
            $table->foreign('job_position_id')->references('id')->on('job_positions');
            $table->foreign('work_location_id')->references('id')->on('work_locations');
            $table->foreign('job_grade_id')->references('id')->on('job_grades');
            $table->foreign('organization_unit_id')->references('id')->on('organization_units');

            $table->datetime('employment_start_date')->nullable();
            $table->datetime('employment_end_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('employee_letters');
    }
};
