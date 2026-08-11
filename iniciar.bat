@echo off
title Carniceria POS - Servidor
echo ============================================
echo   CARNICERIA - Punto de Venta
echo ============================================
echo.

:: Agregar PHP, Node y MySQL al PATH
set "PATH=C:\Users\Tobal\php;C:\Users\Tobal\node;C:\Program Files\MySQL\MySQL Server 8.0\bin;%PATH%"

echo Iniciando servidores...
echo.

:: Iniciar Vite (frontend React) en segundo plano
start "Vite - Frontend React" cmd /k "set PATH=C:\Users\Tobal\node;%%PATH%% && cd /d %~dp0 && npm run dev"

:: Esperar 2 segundos para que Vite inicie primero
timeout /t 2 /nobreak > nul

:: Iniciar Laravel en la misma ventana
echo [Laravel] Iniciando servidor PHP en http://localhost:8000
echo [Vite]    Frontend React en http://localhost:5173
echo.
echo Presiona CTRL+C en cualquier ventana para detener.
echo.
php artisan serve
