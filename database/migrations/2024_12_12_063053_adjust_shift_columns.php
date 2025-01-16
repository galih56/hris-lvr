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
        Schema::table('shifts', function (Blueprint $table) {
            $table->boolean('is_flexible')->default(false);
        });
        Schema::table('shift_assignments', function (Blueprint $table) {
            $table->datetime('effective_date');
            $table->datetime('end')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shifts', function (Blueprint $table) {
            $table->dropColumn('is_flexible');
        });
        Schema::table('shift_assignments', function (Blueprint $table) {
            $table->dropColumn('effective_date');
            $table->dropColumn('end')->nullable();
        });
    }
};
