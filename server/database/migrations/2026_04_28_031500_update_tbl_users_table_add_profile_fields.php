<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('tbl_users')) {
            return;
        }

        Schema::table('tbl_users', function (Blueprint $table) {
            if (!Schema::hasColumn('tbl_users', 'first_name')) {
                $table->string('first_name', 50)->nullable()->after('id');
            }
            if (!Schema::hasColumn('tbl_users', 'middle_name')) {
                $table->string('middle_name', 50)->nullable()->after('first_name');
            }
            if (!Schema::hasColumn('tbl_users', 'last_name')) {
                $table->string('last_name', 50)->nullable()->after('middle_name');
            }
            if (!Schema::hasColumn('tbl_users', 'suffix_name')) {
                $table->string('suffix_name', 20)->nullable()->after('last_name');
            }
            if (!Schema::hasColumn('tbl_users', 'gender_id')) {
                $table->unsignedBigInteger('gender_id')->nullable()->after('suffix_name');
            }
            if (!Schema::hasColumn('tbl_users', 'birth_date')) {
                $table->date('birth_date')->nullable()->after('gender_id');
            }
            if (!Schema::hasColumn('tbl_users', 'username')) {
                $table->string('username', 50)->nullable()->unique()->after('birth_date');
            }
            if (!Schema::hasColumn('tbl_users', 'password')) {
                $table->string('password')->nullable()->after('username');
            }
            if (!Schema::hasColumn('tbl_users', 'is_deleted')) {
                $table->boolean('is_deleted')->default(false)->after('password');
            }
        });
    }

    public function down(): void
    {
        if (!Schema::hasTable('tbl_users')) {
            return;
        }

        Schema::table('tbl_users', function (Blueprint $table) {
            if (Schema::hasColumn('tbl_users', 'is_deleted')) {
                $table->dropColumn('is_deleted');
            }
            if (Schema::hasColumn('tbl_users', 'password')) {
                $table->dropColumn('password');
            }
            if (Schema::hasColumn('tbl_users', 'username')) {
                $table->dropUnique(['username']);
                $table->dropColumn('username');
            }
            if (Schema::hasColumn('tbl_users', 'birth_date')) {
                $table->dropColumn('birth_date');
            }
            if (Schema::hasColumn('tbl_users', 'gender_id')) {
                $table->dropColumn('gender_id');
            }
            if (Schema::hasColumn('tbl_users', 'suffix_name')) {
                $table->dropColumn('suffix_name');
            }
            if (Schema::hasColumn('tbl_users', 'last_name')) {
                $table->dropColumn('last_name');
            }
            if (Schema::hasColumn('tbl_users', 'middle_name')) {
                $table->dropColumn('middle_name');
            }
            if (Schema::hasColumn('tbl_users', 'first_name')) {
                $table->dropColumn('first_name');
            }
        });
    }
};
