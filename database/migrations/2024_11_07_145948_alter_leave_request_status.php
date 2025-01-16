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
        Schema::table('leave_requests', function (Blueprint $table) {
            $table->enum('status', ['unverified', 'approved', 'partially_approved'])->nullable()->change(); 
            $table->double('days')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('leave_requests', function (Blueprint $table) {
            $table->enum('status', ['active', 'inactive', 'completed'])->nullable()->change(); 
            $table->dropColumn('days');
        });
    }
};
