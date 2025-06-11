# FilmDiary - Aplicación de Diario de Películas

## 📋 Resumen del Proyecto

FilmDiary es una aplicación web completa para llevar un registro personal de películas vistas y por ver. Integra con la API de TMDB para búsqueda de películas y permite a los usuarios crear su diario personal y watchlist.

**Stack Tecnológico:**
- **Backend**: Spring Boot + MariaDB + JWT + Integración TMDB
- **Frontend**: HTML + Bootstrap 5 + JavaScript vanilla
- **Servidor Web**: Apache (para el frontend)

## 🚀 Estado Actual del Desarrollo

### ✅ COMPLETADO Y FUNCIONANDO 100%

**🔐 Sistema de Autenticación**
- ✅ Registro de usuarios (validaciones + JWT + almacenamiento)
- ✅ Inicio de sesión (email/password + token persistente)
- ✅ Cierre de sesión (limpieza localStorage + redirección)

**🔍 Búsqueda y Gestión de Películas**
- ✅ Búsqueda de películas (TMDB API + paginación + resultados)
- ✅ Detalles de película (info completa + poster + géneros + sinopsis)
- ✅ **Añadir al Diario** (modal con fecha + rating + guardar funcionando)
- ✅ **Añadir a Watchlist** (botón funcional + estado persistente)
- ✅ **Verificación de estado** (botones muestran si película ya está añadida)

**🔧 Infraestructura Técnica**
- ✅ localStorage funcionando correctamente con Apache
- ✅ API comunicación Backend ↔ Frontend sin errores
- ✅ CORS configurado y operativo
- ✅ Responsive design con Bootstrap

### 🔍 PENDIENTE DE DEPURAR (Orden de Prioridad)

**📖 1. Diario Personal (diary.html) - SIGUIENTE**
- 🔍 Carga de tabla - ¿Muestra películas vistas?
- 🔍 Paginación - ¿Navega entre páginas?
- 🔍 Filtros - ¿Año + rating + ordenamiento?
- 🔍 Modal editar - ¿Funciona edición de entradas?
- 🔍 Eliminar entradas - ¿Borra del diario?
- 🔍 Estadísticas - ¿Total + promedio rating?

**⏰ 2. Watchlist (watchlist.html) - DESPUÉS**
- 🔍 Carga de grid/lista - ¿Muestra películas por ver?
- 🔍 Toggle vista - ¿Grid ↔ Lista funciona?
- 🔍 Botón "Ya la vi" - ¿Modal mover a diario?
- 🔍 Eliminar de lista - ¿Borra de watchlist?
- 🔍 Estadísticas - ¿Total + recientes?

**🏠 3. Dashboard Principal (dashboard.html) - ÚLTIMO**
- 🔍 Última película vista - ¿Aparece info o "vacío"?
- 🔍 Preview watchlist - ¿Muestra películas o "vacía"?
- 🔍 Contadores - ¿Estadísticas correctas?

## 🔧 Configuración y Setup

### **Requisitos**
- Java 17+, MariaDB, Apache HTTP Server, API Key de TMDB

### **Variables de Entorno**
```bash
export TMDB_API_KEY="tu_api_key_de_tmdb"
```

### **Ejecutar Proyecto**
```bash
# Backend
cd film-diary-backend
./mvnw spring-boot:run  # Puerto 8080

# Frontend (Apache)
sudo cp -r frontend/ /var/www/html/
# Acceso: http://localhost/frontend/index.html
```

## 🔌 API Endpoints Principales

- **Auth**: `POST /api/auth/login`, `POST /api/auth/register`
- **Búsqueda**: `GET /api/movies/search`, `GET /api/movies/{id}`
- **Diario**: `GET /api/diario`, `POST /api/diario/tmdb/{id}`, `PUT /api/diario/{id}`, `DELETE /api/diario/{id}`
- **Watchlist**: `GET /api/watchlist`, `POST /api/watchlist/tmdb/{id}`, `DELETE /api/watchlist/{id}`

## 🚀 Flujo de Usuario Actual

1. **✅ Registro/Login** → Autenticación JWT + datos almacenados
2. **✅ Búsqueda** → Encontrar películas en TMDB
3. **✅ Detalles** → Ver información completa + añadir a diario/watchlist (funcional)
4. **🔍 Diario** → Gestionar películas vistas (pendiente depurar)
5. **🔍 Watchlist** → Gestionar películas por ver (pendiente depurar)
6. **🔍 Dashboard** → Vista general personalizada (pendiente depurar)

## 💡 Características Técnicas

- **Autenticación automática** con localStorage
- **API centralizada** (api.js) que maneja automáticamente el usuario logueado
- **Sistema de notificaciones** con Bootstrap toasts
- **Rating con estrellas** interactivo (1-5 estrellas)
- **Estados de verificación** - botones muestran si película ya está añadida
- **Responsive design** completo

## 🔧 URLs de Acceso

- **Inicio**: `http://localhost/frontend/index.html`
- **Búsqueda**: `http://localhost/frontend/search.html` ✅
- **Detalles**: `http://localhost/frontend/movie-detail.html?id={tmdbId}` ✅
- **Diario**: `http://localhost/frontend/diary.html` 🔍
- **Watchlist**: `http://localhost/frontend/watchlist.html` 🔍
- **Dashboard**: `http://localhost/frontend/dashboard.html` 🔍

---

**📋 Estado Resume:** La base del proyecto está sólida. Búsqueda y gestión de películas funcionan perfectamente. Falta depurar las pantallas de visualización (diario, watchlist, dashboard) que es trabajo de frontend principalmente.