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
        Schema::table('terminate_reasons', function (Blueprint $table) {
            $table->dropForeign(['type_id']);
            $table->dropColumn(('type_id'));
        });
        Schema::dropIfExists('terminate_types');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('terminate_types', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name',50);
            $table->timestamps();
        });
    }
};
