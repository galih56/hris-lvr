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
        Schema::create('tax_statuses', function (Blueprint $table) {
            $table->increments('id');
            $table->string('code',50);
            $table->string('name',100);
            $table->timestamps();
        });

        // Employment Status Table
        Schema::create('employment_statuses', function (Blueprint $table) {
            $table->increments('id');
            $table->string('code',50);
            $table->string('name',100);
            $table->timestamps();
        });

        // Cost Centers Table
        Schema::create('cost_centers', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('code',50);
            $table->string('name',100);
            $table->timestamps();
        });

        // Job Grades Table
        Schema::create('job_grades', function (Blueprint $table) {
            $table->increments('id');
            $table->string('code');
            $table->string('name');
            $table->timestamps();
        });

        // Job Positions Table
        Schema::create('job_positions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name', 100);
            $table->string('code', 50);
            $table->string('job_status', 100)->nullable();
            $table->string('cost_center', 100)->nullable();
            $table->string('job_grade', 100)->nullable();
            $table->string('work_location', 100)->nullable();
            $table->string('organization_unit', 100)->nullable();
            $table->text('job_description')->nullable();
            $table->enum('status', ['active', 'inactive'])->nullable(); 
            $table->timestamps();
        });

        // Work Location Types Table
        Schema::create('work_location_types', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->timestamps();
        });

        // Work Locations Table
        Schema::create('work_locations', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('code');
            $table->string('name');
            $table->unsignedBigInteger('type_id');
            $table->foreign('type_id')->references('id')->on('work_location_types');
            $table->timestamps();
        });

        // Outsource Vendors Table
        Schema::create('outsource_vendors', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('code');
            $table->string('name');
            $table->timestamps();
        });

        // organization Units Table
        Schema::create('organization_units', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('code',50);
            $table->string('name',100);
            $table->timestamps();
        });

        // Religions Table
        Schema::create('religions', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name', 50);
            $table->timestamps();
        });

        // Departments Table
        Schema::create('departments', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name', 255);
            $table->string('code', 10);
            $table->timestamps();
        });
        // Create terminate_types table
        Schema::create('terminate_types', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name',50);
            $table->timestamps();
        });

        // Create sf_terminate_reasons table
        Schema::create('terminate_reasons', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->unsignedInteger('type_id')->nullable();
            $table->timestamps(); 

            // Foreign key constraint
            $table->foreign('type_id')->references('id')->on('terminate_types');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('terminate_reasons');
        Schema::dropIfExists('terminate_types');
        Schema::dropIfExists('departments');
        Schema::dropIfExists('religions');
        Schema::dropIfExists('organization_units');
        Schema::dropIfExists('outsource_vendors');
        Schema::dropIfExists('work_locations');
        Schema::dropIfExists('work_location_types');
        Schema::dropIfExists('job_positions');
        Schema::dropIfExists('job_grades');
        Schema::dropIfExists('cost_centers');
        Schema::dropIfExists('tax_statuses');
        Schema::dropIfExists('employment_statuses');
    }
};
