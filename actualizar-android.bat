@echo off
echo ==========================================
echo  TicketTracker - Actualizar app Android
echo ==========================================
echo.
echo Compilando la web app...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Fallo al compilar. Comprueba los errores arriba.
    pause
    exit /b 1
)

echo.
echo Sincronizando con Android...
call npx cap sync android
if %errorlevel% neq 0 (
    echo ERROR: Fallo al sincronizar con Android.
    pause
    exit /b 1
)

echo.
echo ==========================================
echo  Listo! Ahora ve a Android Studio y haz:
echo  Build - Build APK(s)
echo ==========================================
pause
