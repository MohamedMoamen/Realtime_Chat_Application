<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MessageController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;

use App\Models\Message;
use App\Events\MessageSent;

Route::get('/test', function () {
    return ['status' => 'ok'];
});


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('messages', [MessageController::class, 'index']);
    Route::post('messages', [MessageController::class, 'store']);
    Route::get('/users', function () {
    return User::select('id', 'name')->get();
    });
    Route::get('/user', function (Request $request) {
    return $request->user();
});
});

