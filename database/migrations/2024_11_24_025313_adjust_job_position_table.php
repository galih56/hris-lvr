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
        Schema::table('job_positions', function (Blueprint $table) {
            if (Schema::hasColumn('job_positions', 'job_status')) $table->dropColumn('job_status');
            if (Schema::hasColumn('job_positions', 'cost_center')) $table->dropColumn('cost_center');
            if (Schema::hasColumn('job_positions', 'job_grade')) $table->dropColumn('job_grade');
            if (Schema::hasColumn('job_positions', 'work_location')) $table->dropColumn('work_location');
            if (Schema::hasColumn('job_positions', 'organization_unit')) $table->dropColumn('organization_unit');
        
            if (!Schema::hasColumn('job_positions', 'work_location_id')){
                $table->unsignedBigInteger('work_location_id')->nullable();
                $table->foreign('work_location_id')->references('id')->on('work_locations');
            }

            if (!Schema::hasColumn('job_positions', 'job_grade_id')){
                $table->unsignedInteger('job_grade_id')->nullable();
                $table->foreign('job_grade_id')->references('id')->on('job_grades');
            }

            if (!Schema::hasColumn('job_positions', 'cost_center_id')){
                $table->unsignedBigInteger('cost_center_id')->nullable();
                $table->foreign('cost_center_id')->references('id')->on('cost_centers');
            }

            if (!Schema::hasColumn('job_positions', 'organization_unit_id')){
                $table->unsignedBigInteger('organization_unit_id')->nullable();
                $table->foreign('organization_unit_id')->references('id')->on('organization_units');
            }
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_positions', function (Blueprint $table) {
            if (!Schema::hasColumn('job_positions', 'job_status')) $table->string('job_status', 100)->nullable();
            if (!Schema::hasColumn('job_positions', 'cost_center')) $table->string('cost_center', 100)->nullable();
            if (!Schema::hasColumn('job_positions', 'job_grade'))$table->string('job_grade', 100)->nullable();
            if (!Schema::hasColumn('job_positions', 'work_location')) $table->string('work_location', 100)->nullable();
            if (!Schema::hasColumn('job_positions', 'organization_unit')) $table->string('organization_unit', 100)->nullable();
            
            if (Schema::hasColumn('job_positions', 'work_location_id')) {
                $table->dropForeign(['work_location_id']); 
                $table->dropColumn('work_location_id'); 
            }
            if (Schema::hasColumn('job_positions', 'job_grade_id')) {
                $table->dropForeign(['job_grade_id']); 
                $table->dropColumn('job_grade_id'); 
            }
            if (Schema::hasColumn('job_positions', 'cost_center_id')) {
                $table->dropForeign(['cost_center_id']); 
                $table->dropColumn('cost_center_id'); 
            }
            if (Schema::hasColumn('job_positions', 'organization_unit_id')){
                $table->dropForeign(['organization_unit_id']); 
                $table->dropColumn('organization_unit_id'); 
            }

        });
    }
};
