# Cómo generar e instalar el APK en tu Android

## Lo que necesitas instalar (gratis)

1. **Android Studio** → https://developer.android.com/studio
   - Descarga e instala (tarda ~15 min)
   - Al abrirse por primera vez, acepta instalar Android SDK

2. **Java JDK 17** (normalmente Android Studio lo instala solo)

---

## Pasos para generar el APK

### Paso 1 — Abrir el proyecto Android
1. Abre Android Studio
2. Click en "Open" (o File → Open)
3. Navega a tu carpeta `C:\Users\Luigi\Documents\Ticket\android`
4. Selecciona esa carpeta y haz click en OK
5. Espera a que Android Studio sincronice el proyecto (puede tardar 2-3 min la primera vez)

### Paso 2 — Generar el APK
1. En el menú superior: **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. Espera ~1-2 minutos
3. Aparecerá un aviso abajo: "APK(s) generated successfully"
4. Click en **"locate"** en ese aviso para ver el archivo

El APK estará en:
```
C:\Users\Luigi\Documents\Ticket\android\app\build\outputs\apk\debug\app-debug.apk
```

---

## Pasos para instalar en tu Android por USB

### Opción A — Instalar directamente desde Android Studio (más fácil)

1. En tu teléfono Android: **Ajustes → Acerca del teléfono → Número de compilación**
   - Toca 7 veces hasta que aparezca "Eres un desarrollador"

2. Ve a **Ajustes → Opciones de desarrollador** → activa **Depuración USB**

3. Conecta el teléfono al PC con cable USB

4. En Android Studio verás tu teléfono en la barra superior

5. Click en **Run ▶** (botón verde) → selecciona tu teléfono → la app se instala automáticamente

### Opción B — Copiar APK y instalar manualmente

1. Activa la depuración USB (mismos pasos de arriba)
2. Conecta el teléfono por USB → elige "Transferir archivos"
3. Copia el archivo `app-debug.apk` a tu teléfono
4. En el teléfono, abre el gestor de archivos y toca el APK
5. Si pide permiso para instalar apps de fuentes desconocidas → acepta

---

## Actualizar la app cuando hagas cambios

Cuando modifiques algo en el código:

```cmd
cd C:\Users\Luigi\Documents\Ticket
npm run build
npx cap sync android
```

Luego vuelve a Android Studio y haz Build → Build APK(s).

---

## Datos importantes

- La app guarda todos los datos localmente en el teléfono (IndexedDB / WebView storage)
- Los datos NO se pierden al cerrar la app
- No necesita internet para funcionar (excepto para cargar los mapas)
- El OCR de tickets requiere internet la primera vez que se usa

---

## ¿Problemas frecuentes?

**"SDK not found"** → En Android Studio: File → Settings → Android SDK → instala Android 14 (API 34)

**"Gradle sync failed"** → Build → Clean Project → luego intenta de nuevo

**"App not installed" en el teléfono** → Desinstala versión anterior primero
