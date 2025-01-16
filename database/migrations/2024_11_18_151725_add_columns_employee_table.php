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
        Schema::table('employees', function (Blueprint $table) {
            $table->enum('marital_status',['married','single','widow','widower','unverified'])->default('unverified')->after('phone_number');
            $table->string('tax_number',100)->after('phone_number')->nullable();
            $table->string('insurance_name',100)->after('phone_number')->nullable();
            $table->string('insurance_number',100)->after('phone_number')->nullable();
            $table->enum('status',['active','inactive'])->default('active')->after('phone_number');
            if (Schema::hasColumn('employees', 'gender')) $table->dropColumn('gender');
            $table->enum('gender',['male','female','unverified'])->default('unverified');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            if (Schema::hasColumn('employees', 'marital_status')) $table->dropColumn('marital_status');
            if (Schema::hasColumn('employees', 'status')) $table->dropColumn('status');
            if (Schema::hasColumn('employees', 'insurance_number')) $table->dropColumn('insurance_number');
            if (Schema::hasColumn('employees', 'tax_number')) $table->dropColumn('tax_number');
            if (Schema::hasColumn('employees', 'status')) $table->dropColumn('status');
            if (Schema::hasColumn('employees', 'gender')) $table->dropColumn('gender');
        });
    }
};
