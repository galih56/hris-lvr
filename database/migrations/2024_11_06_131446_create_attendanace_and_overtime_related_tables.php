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

        if (!Schema::hasTable('shifts')) {
            Schema::create('shifts', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->string('code', 100);
                $table->string('name', 200);
                $table->text('description')->nullable();

                
                $table->time('start');
                $table->time('end');

                $table->timestamps();
            });
        }


        if (!Schema::hasTable('leave_types')) {
            Schema::create('leave_types', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->string('code', 100);
                $table->string('name', 200);
                $table->timestamps();
            });
        }

        
        

        if (!Schema::hasTable('attendances')) {
            Schema::create('attendances', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->string('code', 50);

                $table->unsignedBigInteger('employee_id');
                $table->foreign('employee_id')->references('id')->on('employees');
                
                $table->datetime('check_in')->nullable();
                $table->datetime('check_out')->nullable();
                $table->double('hours_worked')->default(0);
                $table->text('notes')->nullable();

                $table->enum('status', ['present', 'absent', 'leave'])->nullable(); 
                $table->timestamps();

            });
        }
        
        if (!Schema::hasTable('shift_assignments')) {
            Schema::create('shift_assignments', function (Blueprint $table) {
                $table->bigIncrements('id');

                $table->unsignedBigInteger('employee_id');
                $table->foreign('employee_id')->references('id')->on('employees');
                $table->unsignedBigInteger('shift_id');
                $table->foreign('shift_id')->references('id')->on('shifts');
                
                $table->text('notes')->nullable();

                $table->enum('status', ['active', 'inactive', 'completed'])->nullable(); 
                $table->timestamps();

            });
        }

        if (!Schema::hasTable('attendance_correction_requests')) {
            Schema::create('attendance_correction_requests', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->string('code', 50);
        
                $table->unsignedBigInteger('attendance_id');
                $table->foreign('attendance_id')->references('id')->on('attendances'); // Reference to the attendance record
        
                $table->unsignedBigInteger('employee_id');
                $table->foreign('employee_id')->references('id')->on('employees');
                /*
                    status in the correction_type could represent the correction of the attendance status (e.g., marking an employee who was absent as present, or changing the status from "leave" to "present").
                */
                $table->enum('correction_type', ['check_in', 'check_out', 'status']);
                $table->datetime('new_check_in')->nullable(); 
                $table->datetime('new_check_out')->nullable(); 
                $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
                $table->text('reason')->nullable(); 
        
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('attendance_corrections')) {
            Schema::create('attendance_corrections', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('attendance_id');
                $table->foreign('attendance_id')->references('id')->on('attendances');
                $table->unsignedBigInteger('request_id');
                $table->foreign('request_id')->references('id')->on('attendance_correction_requests');
        
                $table->datetime('corrected_check_in')->nullable();
                $table->datetime('corrected_check_out')->nullable();
                $table->double('corrected_hours_worked')->nullable();
                $table->text('notes')->nullable();
        
                $table->unsignedBigInteger('approved_by')->nullable();
                $table->foreign('approved_by')->references('id')->on('users');
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('leave_requests')) {
            Schema::create('leave_requests', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->string('code', 100);

                $table->unsignedBigInteger('employee_id');
                $table->foreign('employee_id')->references('id')->on('employees');

                $table->text('notes')->nullable();

                $table->datetime('start');
                $table->datetime('end');

                $table->enum('status', ['active', 'inactive', 'completed'])->nullable(); 
                $table->unsignedBigInteger('approved_by')->nullable();
                $table->foreign('approved_by')->references('id')->on('users');
                $table->timestamps();

            });
        }

        
        if (!Schema::hasTable('overtime_requests')) {
            Schema::create('overtime_requests', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->string('code', 100);

                $table->unsignedBigInteger('employee_id');
                $table->foreign('employee_id')->references('id')->on('employees');

                $table->text('notes')->nullable();

                $table->datetime('start');
                $table->datetime('end');

                $table->enum('status', ['active', 'inactive', 'completed'])->nullable(); 
                $table->unsignedBigInteger('approved_by')->nullable();
                $table->foreign('approved_by')->references('id')->on('users');
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('attendances');
        Schema::dropIfExists('leave_types');
        Schema::dropIfExists('leave_requests');
        Schema::dropIfExists('shifts');
        Schema::dropIfExists('shift_assignments');
        Schema::dropIfExists('overtime_requests');
        Schema::dropIfExists('attendance_corrections');
        Schema::dropIfExists('attendance_correction_requests');
        
    }
};
