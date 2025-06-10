# FilmDiary - Aplicación de Diario de Películas

## 📋 Descripción del Proyecto

FilmDiary es una aplicación web completa para llevar un registro personal de películas vistas y por ver. Integra con la API de TMDB para búsqueda de películas y permite a los usuarios crear su diario personal y watchlist.

## 🏗️ Arquitectura

- **Backend**: Spring Boot + MariaDB + JWT + Integración TMDB
- **Frontend**: HTML + Bootstrap 5 + JavaScript vanilla (páginas tradicionales)

## 📁 Estructura del Proyecto

```
film-diary-backend/
├── src/                          # Código Java Spring Boot
├── frontend/                     # Aplicación web frontend
│   ├── index.html               # ✅ Login/Registro (FUNCIONANDO)
│   ├── dashboard.html           # ✅ Dashboard principal (FUNCIONANDO)
│   ├── search.html              # ✅ Búsqueda de películas (FUNCIONANDO)
│   ├── movie-detail.html        # ✅ Detalles de película (FUNCIONANDO)
│   ├── diary.html               # 🚧 Diario con tabla (PENDIENTE)
│   ├── watchlist.html           # 🚧 Lista de películas por ver (PENDIENTE)
│   ├── css/
│   │   └── styles.css           # ✅ Estilos personalizados
│   ├── js/
│   │   ├── api.js               # ✅ Clase para comunicación con backend
│   │   ├── auth.js              # ✅ Login/registro (index.html)
│   │   ├── dashboard.js         # ✅ Dashboard
│   │   ├── search.js            # ✅ Búsqueda películas
│   │   ├── movie-detail.js      # ✅ Detalles película
│   │   ├── diary.js             # 🚧 Diario (PENDIENTE)
│   │   └── watchlist.js         # 🚧 Watchlist (PENDIENTE)
```

## 🚀 Estado del Desarrollo

### ✅ COMPLETADO Y FUNCIONANDO

#### Backend (100% completo)
- ✅ Autenticación JWT
- ✅ Integración TMDB completa
- ✅ CRUD Diario y Watchlist
- ✅ Validaciones y manejo de errores
- ✅ CORS configurado correctamente

#### Frontend (70% completo)
- ✅ **index.html + auth.js** - Login/registro con validaciones, guarda datos del usuario automáticamente
- ✅ **dashboard.html + dashboard.js** - Página principal con última película vista, preview watchlist, navegación
- ✅ **search.html + search.js** - Búsqueda en TMDB con paginación, solo botón "Ver Detalles" 
- ✅ **movie-detail.html + movie-detail.js** - Página completa de detalles con:
  - Información completa de película (poster, sinopsis, géneros, duración, etc.)
  - Botón "Añadir al Diario" con modal (fecha + rating estrellas interactivo)
  - Botón "Añadir a Watchlist" 
  - Toasts de notificación
  - Manejo de estados y errores
- ✅ **api.js** - Clase completamente integrada que maneja automáticamente el usuario logueado
- ✅ **styles.css** - Estilos personalizados con Bootstrap 5

### 🚧 PENDIENTE

- 🚧 **diary.html + diary.js** - Tabla paginada de películas vistas + modal de edición
- 🚧 **watchlist.html + watchlist.js** - Grid de películas por ver + eliminar/mover al diario

## 🔌 API Endpoints (Backend)

### Autenticación
- `POST /api/auth/login` - Iniciar sesión (devuelve token + datos usuario)
- `POST /api/auth/register` - Registrar usuario (devuelve token + datos usuario)

### Búsqueda de Películas  
- `GET /api/movies/search?query={query}&page={page}` - Buscar películas en TMDB
- `GET /api/movies/{movieId}` - Detalles de película específica

### Diario Personal
- `GET /api/diario?usuarioId={id}&page={page}&size={size}` - Obtener diario paginado
- `POST /api/diario/tmdb/{tmdbId}?usuarioId={id}&puntuacion={rating}&fechaVisionado={date}` - Añadir película al diario
- `PUT /api/diario/{entryId}?fechaVisionado={date}&puntuacion={rating}` - Actualizar entrada
- `DELETE /api/diario/{entryId}` - Eliminar entrada
- `GET /api/diario/{entryId}` - Obtener entrada específica

### Watchlist
- `GET /api/watchlist?usuarioId={id}&page={page}&size={size}` - Obtener watchlist paginada
- `POST /api/watchlist/tmdb/{tmdbId}?usuarioId={id}` - Añadir película a watchlist
- `DELETE /api/watchlist/{peliculaId}?usuarioId={id}` - Eliminar de watchlist
- `GET /api/watchlist/check/{peliculaId}?usuarioId={id}` - Verificar si está en watchlist
- `GET /api/watchlist/count?usuarioId={id}` - Contar películas en watchlist

## 🔧 Configuración y Setup

### Requisitos
- Java 17+
- MariaDB
- API Key de TMDB
- Python 3 (para servir frontend) o servidor web

### Variables de Entorno
```bash
export TMDB_API_KEY="tu_api_key_de_tmdb"
```

### Base de Datos
MariaDB con esquemas: `usuario`, `pelicula`, `usuario_diario`, `usuario_watchlist`

### Ejecutar Backend
```bash
cd film-diary-backend
./mvnw spring-boot:run
```

### Ejecutar Frontend
```bash
cd frontend
python3 -m http.server 3000
# Abrir: http://localhost:3000
```

## 🚀 Flujo de Usuario (Funcionando)

1. **Login/Registro** (`index.html`) → Token JWT + datos usuario almacenados automáticamente
2. **Dashboard** (`dashboard.html`) → Vista general personalizada + navegación
3. **Búsqueda** (`search.html`) → Encontrar películas → "Ver Detalles"
4. **Detalles** (`movie-detail.html`) → Ver info completa → Añadir a diario/watchlist
5. **Diario** (`diary.html`) → 🚧 PENDIENTE - Gestionar películas vistas
6. **Watchlist** (`watchlist.html`) → 🚧 PENDIENTE - Gestionar películas por ver

## 💡 Características Implementadas

### Autenticación Automática
- El frontend guarda automáticamente los datos del usuario al login/registro
- Todos los métodos de API usan automáticamente el usuario logueado: `api.getDiary()`, `api.addToWatchlist()`
- Logout limpia todo + redirección automática

### Funcionalidades Avanzadas
- **Rating con estrellas** interactivo (1-5 estrellas + texto descriptivo)
- **Sistema de notificaciones** con Bootstrap toasts
- **Estados de carga** y manejo de errores en todas las páginas
- **Formateo inteligente** (fechas en español, dinero, duración "2h 30min")
- **Responsive design** completo con Bootstrap 5

### Integración TMDB
- Búsqueda en tiempo real (800ms delay)
- Detalles completos de películas
- Imágenes optimizadas con placeholders
- Paginación funcional

## 🔧 Problemas Resueltos

### ✅ CORS
- Configurado correctamente en `SecurityConfig.java`
- Permite desarrollo local (localhost:3000, localhost:8000)

### ✅ Manejo de Usuario
- AuthResponseDto devuelve datos completos del usuario
- Frontend guarda automáticamente token + datos usuario
- API automáticamente usa el usuario logueado

### ✅ Integración Frontend-Backend
- api.js completamente funcional
- Manejo de errores consistente
- Estados de carga en todas las páginas

## 🎯 URLs de Prueba

Una vez ejecutando:

### Páginas principales
- `http://localhost:3000/index.html` - Login/registro
- `http://localhost:3000/dashboard.html` - Dashboard principal
- `http://localhost:3000/search.html` - Búsqueda de películas

### Detalles de películas (ejemplos)
- `http://localhost:3000/movie-detail.html?id=550` - Fight Club
- `http://localhost:3000/movie-detail.html?id=13` - Forrest Gump  
- `http://localhost:3000/movie-detail.html?id=122` - El Señor de los Anillos

## 📝 Notas Técnicas

### Arquitectura API Frontend
```javascript
// Uso automático del usuario logueado:
await api.getDiary(0, 10);           // En lugar de api.getDiary(usuarioId, 0, 10)
await api.addToWatchlist(tmdbId);    // En lugar de api.addToWatchlist(usuarioId, tmdbId)
await api.getWatchlistCount();       // En lugar de api.getWatchlistCount(usuarioId)
```

### Manejo de Estados
- **LocalStorage**: Token JWT + datos usuario completos
- **Variables JS**: Datos temporales de la sesión
- **Bootstrap Modals**: Para forms (añadir al diario)
- **Bootstrap Toasts**: Para notificaciones

### Validaciones
- Frontend: Email válido, contraseña segura, campos obligatorios
- Backend: Validaciones con anotaciones Spring + manejo de errores
- Fechas: No futuras para fecha de visionado
- Puntuaciones: 0-5 estrellas

## 🎯 Siguiente Desarrollo

### Prioridad Alta
1. **diary.html + diary.js** - Tabla paginada con todas las películas vistas + modal de edición
2. **watchlist.html + watchlist.js** - Grid de películas por ver + eliminar/mover al diario

### Funcionalidades Avanzadas (Futuro)
- Estadísticas personales
- Exportar diario
- Recomendaciones basadas en historial
- Compartir listas

## 🔍 Debugging

### Problemas Comunes
1. **CORS**: Verificar que frontend esté en `http://localhost:3000` (no file://)
2. **API Key**: Verificar variable `TMDB_API_KEY` en backend
3. **Base de datos**: Verificar conexión MariaDB en `application.yml`
4. **Autenticación**: Verificar token JWT en localStorage del navegador

### Logs Útiles
```bash
# Backend - Ver peticiones
tail -f logs/spring.log

# Frontend - Console del navegador
F12 → Console → Ver errores JavaScript
```

---

**Desarrollado con Spring Boot + Bootstrap 5 + JavaScript Vanilla**  
**Integración TMDB para catálogo de películas**