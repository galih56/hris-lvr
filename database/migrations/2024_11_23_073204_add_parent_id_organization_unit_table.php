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
        if (!Schema::hasColumn('organization_units', 'parent_id')) {
            Schema::table('organization_units', function (Blueprint $table) {
                $table->unsignedBigInteger('parent_id')->nullable();
                $table->foreign('parent_id')->references('id')->on('organization_units');
            });   
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('organization_units', 'parent_id')){
            Schema::table('organization_units', function (Blueprint $table) {
                $table->dropForeign(['parent_id']); 
                $table->dropColumn(['parent_id']); 
            });
        }
    }
};