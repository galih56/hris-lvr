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
        Schema::table('career_transitions', function (Blueprint $table) {
            $table->unsignedBigInteger('letter_id')->after('effective_date');
            $table->foreign('letter_id')->references('id')->on('employee_letters')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('career_transitions', 'letter_id')) {
            Schema::table('career_transitions', function (Blueprint $table) {
                $table->dropForeign(['letter_id']); // Use an array to specify the column
                $table->dropColumn('letter_id');
            });
        }
    }
};
