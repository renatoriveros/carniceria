<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
Route::get('/prueba', function () {
    return response()->json([
        'status' => 'éxito',
        'mensaje' => '¡Conexión perfecta entre React y Laravel para la Carnicería!'
    ]);
});

Route::post('/login', [AuthController::class, 'login']);

// Todo lo que esté dentro de este grupo requerirá un Token válido
Route::middleware('auth:sanctum')->group(function () {
    
    Route::get('/perfil', function (Request $request) {
        // Si el token es válido, Laravel sabe exactamente quién eres
        return response()->json([
            'mensaje' => '¡Bienvenido a la zona VIP de la Carnicería!',
            'usuario' => $request->user() 
        ]);
    });

});