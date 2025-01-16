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
        Schema::table('attendances', function (Blueprint $table) {
            $table->decimal('check_in_latitude', 12, 10)->nullable()->after('hours_worked');
            $table->decimal('check_in_longitude', 12, 10)->nullable()->after('hours_worked');
            $table->decimal('check_out_latitude', 12, 10)->nullable()->after('hours_worked');
            $table->decimal('check_out_longitude', 12, 10)->nullable()->after('hours_worked');
            $table->string('check_in_photo')->nullable()->after('hours_worked');
            $table->string('check_out_photo')->nullable()->after('hours_worked');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->dropColumn(['check_in_latitude', 'check_in_longitude', 'check_out_latitude', 'check_out_longitude', 'check_in_photo', 'check_out_photo']);
        });
    }
};
