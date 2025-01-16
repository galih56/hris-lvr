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
            $table->boolean('corrected')->default(false)->after('status');
            $table->datetime('corrected_at')->nullable()->after('status');
            $table->unsignedBigInteger('corrected_by')->nullable()->after('status');
            $table->foreign('corrected_by')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->dropColumn('corrected'); 
            $table->dropColumn('corrected_at'); 
            $table->dropForeign(['corrected_by']); 
            $table->dropColumn('corrected_by'); 
        });
    }
};
