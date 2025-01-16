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
        Schema::create('employees', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('code', 50);
            $table->string('name', 100);
            $table->string('email', 50)->nullable();
            $table->string('address', 200)->nullable();
            $table->string('state', 50)->nullable();
            $table->string('city', 50)->nullable();
            $table->string('district', 100)->nullable();
            $table->string('birth_place', 100)->nullable();
            $table->dateTime('birth_date')->nullable();
            $table->string('id_number', 100)->nullable();
            $table->integer('gender')->nullable();
            $table->dateTime('join_date');
            $table->dateTime('employment_start_date')->nullable();
            $table->dateTime('employment_end_date')->nullable();
            $table->dateTime('terminate_date')->nullable();
            $table->dateTime('pension_date')->nullable();
            $table->string('phone_number', 50)->nullable();
            $table->string('resignation', 150)->nullable();
            
            $table->string('bank_branch', 10)->nullable();
            $table->string('bank_account', 50)->nullable();

            $table->unsignedInteger('religion_id')->nullable();
            $table->unsignedInteger('tax_status_id')->nullable();
            $table->unsignedInteger('terminate_reason_id')->nullable();
            $table->unsignedInteger('job_grade_id')->nullable();
            $table->unsignedInteger('employment_status_id')->nullable();
            $table->unsignedBigInteger('work_location_id')->nullable();
            $table->unsignedBigInteger('organization_unit_id')->nullable();
            $table->unsignedBigInteger('job_position_id')->nullable();
            $table->unsignedBigInteger('outsource_vendor_id')->nullable();

            $table->foreign('tax_status_id')->references('id')->on('tax_statuses')->onDelete('set null');
            $table->foreign('religion_id')->references('id')->on('religions')->onDelete('set null');
            $table->foreign('terminate_reason_id')->references('id')->on('terminate_reasons')->onDelete('set null');
            $table->foreign('work_location_id')->references('id')->on('work_locations')->onDelete('set null');
            $table->foreign('job_grade_id')->references('id')->on('job_grades')->onDelete('set null');
            $table->foreign('employment_status_id')->references('id')->on('employment_statuses')->onDelete('set null');
            $table->foreign('organization_unit_id')->references('id')->on('organization_units')->onDelete('set null');
            $table->foreign('job_position_id')->references('id')->on('job_positions')->onDelete('set null');
            $table->foreign('outsource_vendor_id')->references('id')->on('outsource_vendors')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('employees');
    }
};


