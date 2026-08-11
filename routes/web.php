<?php

use Illuminate\Support\Facades\Route;

// Captura todas las rutas y devuelve la vista React
// React Router se encarga del enrutamiento en el cliente
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');
