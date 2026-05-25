<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('tbl_users') || Schema::hasColumn('tbl_users', 'profile_picture')) {
            return;
        }

        Schema::table('tbl_users', function (Blueprint $table) {
            $table->string('profile_picture')->nullable()->after('suffix_name');
        });
    }

    public function down(): void
    {
        if (!Schema::hasTable('tbl_users') || !Schema::hasColumn('tbl_users', 'profile_picture')) {
            return;
        }

        Schema::table('tbl_users', function (Blueprint $table) {
            $table->dropColumn('profile_picture');
        });
    }
};
