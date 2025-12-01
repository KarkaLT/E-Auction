<?php

use App\Models\User;

test('admin can switch to seller', function () {
    $user = User::factory()->create([
        'role' => 'admin',
        'is_admin' => true,
    ]);

    $response = $this
        ->actingAs($user)
        ->put(route('user-role.update'), [
            'role' => 'seller',
        ]);

    $response->assertRedirect();
    expect($user->fresh()->role)->toBe('seller');
    expect($user->fresh()->is_admin)->toBeTrue();
});

test('admin can switch to buyer', function () {
    $user = User::factory()->create([
        'role' => 'admin',
        'is_admin' => true,
    ]);

    $response = $this
        ->actingAs($user)
        ->put(route('user-role.update'), [
            'role' => 'buyer',
        ]);

    $response->assertRedirect();
    expect($user->fresh()->role)->toBe('buyer');
    expect($user->fresh()->is_admin)->toBeTrue();
});

test('admin can switch back to admin', function () {
    $user = User::factory()->create([
        'role' => 'seller',
        'is_admin' => true,
    ]);

    $response = $this
        ->actingAs($user)
        ->put(route('user-role.update'), [
            'role' => 'admin',
        ]);

    $response->assertRedirect();
    expect($user->fresh()->role)->toBe('admin');
});

test('regular user can switch to seller', function () {
    $user = User::factory()->create([
        'role' => 'buyer',
        'is_admin' => false,
    ]);

    $response = $this
        ->actingAs($user)
        ->put(route('user-role.update'), [
            'role' => 'seller',
        ]);

    $response->assertRedirect();
    expect($user->fresh()->role)->toBe('seller');
});

test('regular user cannot switch to admin', function () {
    $user = User::factory()->create([
        'role' => 'buyer',
        'is_admin' => false,
    ]);

    $response = $this
        ->actingAs($user)
        ->put(route('user-role.update'), [
            'role' => 'admin',
        ]);

    $response->assertForbidden();
    expect($user->fresh()->role)->toBe('buyer');
});
