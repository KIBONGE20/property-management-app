<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\PropertyInquiryController;

/*
|--------------------------------------------------------------------------
| Public Authentication Routes
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Public Property Routes
|--------------------------------------------------------------------------
*/

Route::get('/properties', [PropertyController::class, 'index']);

Route::get('/properties/{property}', [PropertyController::class, 'show']);

/*
|--------------------------------------------------------------------------
| Public Property Inquiry Route
|--------------------------------------------------------------------------
*/

Route::post(
    '/property-inquiries',
    [PropertyInquiryController::class, 'store']
);

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Authentication
    |--------------------------------------------------------------------------
    */

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/user', [AuthController::class, 'user']);

    /*
    |--------------------------------------------------------------------------
    | Property Management
    |--------------------------------------------------------------------------
    */

    Route::post('/properties', [PropertyController::class, 'store']);

    Route::post(
        '/properties/{property}',
        [PropertyController::class, 'update']
    );

    Route::delete(
        '/properties/{property}',
        [PropertyController::class, 'destroy']
    );

    /*
    |--------------------------------------------------------------------------
    | Inquiry Management
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/property-inquiries',
        [PropertyInquiryController::class, 'index']
    );

    Route::put(
        '/property-inquiries/{propertyInquiry}',
        [PropertyInquiryController::class, 'update']
    );
});
