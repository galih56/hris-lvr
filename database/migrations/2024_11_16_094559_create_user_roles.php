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
        if (!Schema::hasTable('user_roles')) {
            Schema::create('user_roles', function (Blueprint $table) {
                $table->id();
                $table->string('code');
                $table->string('name')->nullable();
                $table->string('description')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasColumn('users', 'role_id')) {
            Schema::table('users', function (Blueprint $table) {
                $table->unsignedBigInteger('role_id')->nullable();
                $table->foreign('role_id')->references('id')->on('user_roles');
            });

            \DB::table('user_roles')->insert([
                ['id' => 1, 'code' => 'emp', 'name' => 'employee', 'description' => 'Employee as regular user, No special access'],
                ['id' => 0, 'code' => 'admin', 'name' => 'admin', 'description' => 'All Access'],
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('users', 'role_id')) {
            Schema::table('users', function (Blueprint $table) {
                // Drop the foreign key using the automatically generated name
                $table->dropForeign(['role_id']); 
                $table->dropColumn('role_id');
            });
        }

        Schema::dropIfExists('user_roles');
    }
};