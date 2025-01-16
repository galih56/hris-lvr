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
        Schema::table('leave_types', function (Blueprint $table) {
            $table->integer('eligibility_days');
            $table->enum('day_type', ['full day', 'part of day', 'half day']);
            $table->boolean('deducted_leave')->default(0);
            $table->enum('day_count', ['work day', 'calendar day']);
            $table->boolean('repeat_period')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('leave_types', function (Blueprint $table) {
            if (Schema::hasColumn('leave_types', 'eligibility_days')) {
                $table->dropColumn('eligibility_days');
            }
            if (Schema::hasColumn('leave_types', 'day_type')) {
                $table->dropColumn('day_type');
            }
            if (Schema::hasColumn('leave_types', 'deducted_leave')) {
                $table->dropColumn('deducted_leave');
            }
            if (Schema::hasColumn('leave_types', 'day_count')) {
                $table->dropColumn('day_count');
            }
            if (Schema::hasColumn('leave_types', 'repeat_period')) {
                $table->dropColumn('repeat_period');
            }
        });
    }
};
