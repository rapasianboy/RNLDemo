<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\GenderController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::controller(GenderController::class)->prefix('/gender')->group(function () {

    Route::get('/loadGenders', 'loadGenders'); // /gender/loadGenders
    Route::get('/getGender/{genderId}', 'getGender');
    Route::post('/storeGender', 'storeGender'); // /gender/storeGender
    Route::put('/updateGender/{gender}', 'updateGender');
    Route::delete('/deleteGender/{genderId}', 'deleteGender');

});

Route::controller(UserController::class)->prefix('/user')->group(function () {
    Route::get('/loadUsers', 'loadUsers');
    Route::get('/getUser/{userId}', 'getUser');
    Route::post('/storeUser', 'storeUser');
    Route::put('/updateUser/{userId}', 'updateUser');
    Route::delete('/deleteUser/{userId}', 'deleteUser');
});

Route::controller(AuthController::class)->prefix('/auth')->group(function () {
    Route::post('/login', 'login');
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', 'me');
        Route::post('/logout', 'logout');
    });
});

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');
