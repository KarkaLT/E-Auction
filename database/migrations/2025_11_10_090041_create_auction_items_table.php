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
        Schema::create('auction_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained('users');
            $table->foreignId('winner_id')->nullable()->constrained('users');
            $table->string('title');
            $table->text('description');
            $table->decimal('starting_price', 10, 2);
            $table->decimal('current_price', 10, 2)->nullable();
            $table->decimal('bid_increment', 10, 2);
            $table->dateTime('end_time');
            $table->enum('status', ['active', 'finished', 'sold', 'canceled'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('auction_items');
    }
};

