<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // 1. Validar que nos envíen email y password
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // 2. Buscar al usuario en la base de datos
        $user = User::where('email', $request->email)->first();

        // 3. Verificar si el usuario existe y la contraseña es correcta
        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json(['mensaje' => 'Credenciales incorrectas'], 401);
        }

        // 4. Crear el Token de acceso con Sanctum
        $token = $user->createToken('token_acceso')->plainTextToken;

        // 5. Devolver el Token a React
        return response()->json([
            'mensaje' => '¡Login exitoso!',
            'token' => $token
        ]);
    }
}
