# FilmDiary - Aplicación de Diario de Películas

## 📋 Descripción del Proyecto

FilmDiary es una aplicación web completa para llevar un registro personal de películas vistas y por ver. Integra con la API de TMDB para búsqueda de películas y permite a los usuarios crear su diario personal y wishlist.

## 🏗️ Arquitectura

- **Backend**: Spring Boot + MariaDB + JWT + Integración TMDB
- **Frontend**: HTML + Bootstrap 5 + JavaScript vanilla (páginas tradicionales)

## 📁 Estructura del Proyecto

```
film-diary-backend/
├── src/                          # Código Java Spring Boot
├── frontend/                     # Aplicación web frontend
│   ├── index.html               # Login/Registro
│   ├── dashboard.html           # Dashboard principal  
│   ├── search.html              # Búsqueda de películas
│   ├── movie-detail.html        # Detalles de película
│   ├── diary.html               # Diario con tabla
│   ├── watchlist.html           # Lista de películas por ver
│   ├── css/
│   │   ├── bootstrap.min.css    # Bootstrap 5
│   │   └── styles.css           # Estilos personalizados
│   ├── js/
│   │   ├── api.js               # Clase para comunicación con backend
│   │   ├── auth.js              # Login/registro (index.html)
│   │   ├── dashboard.js         # Dashboard
│   │   ├── search.js            # Búsqueda películas
│   │   ├── movie-detail.js      # Detalles película
│   │   ├── diary.js             # Diario
│   │   └── watchlist.js         # Watchlist
│   └── assets/images/           # Imágenes estáticas
```

## 🔌 API Endpoints (Backend)

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario

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

## 🎨 Frontend - Páginas y Funcionalidades

### 1. index.html (Login/Registro)
- **Funcionalidad**: Formulario dinámico que cambia entre login y registro
- **JavaScript**: `auth.js`
- **Campos Login**: Email, Password
- **Campos Registro**: Username, Email, Password, Nombre (opt), Apellido (opt), Fecha Nac (opt)
- **Validaciones**: Frontend + backend (patrón contraseña, email válido)

### 2. dashboard.html (Dashboard Principal)
- **Funcionalidad**: Página principal post-login
- **JavaScript**: `dashboard.js`
- **Contenido**: 
  - Última película vista (card con detalles)
  - Watchlist preview (3 películas + total count)
  - Enlaces a búsqueda, diario completo, watchlist completa

### 3. search.html (Búsqueda de Películas)
- **Funcionalidad**: Búsqueda en TMDB + acciones
- **JavaScript**: `search.js`
- **Contenido**:
  - Barra de búsqueda
  - Grid de resultados (título, poster, fecha, rating)
  - Paginación
  - Botones: "Añadir a Watchlist", "Añadir a Diario", "Ver Detalles"

### 4. movie-detail.html (Detalles de Película)
- **Funcionalidad**: Vista completa de película individual
- **JavaScript**: `movie-detail.js`
- **Contenido**:
  - Poster grande, título, fecha, duración, sinopsis
  - Géneros, rating TMDB
  - Botones: "Añadir a Watchlist", "Añadir a Diario"
  - Si está en diario: mostrar puntuación personal

### 5. diary.html (Diario Personal)
- **Funcionalidad**: Tabla paginada + modal de edición
- **JavaScript**: `diary.js`
- **Contenido**:
  - Tabla: Mes, Día, Poster, Título, Año, Puntuación, Editar
  - Modal para editar: Fecha visionado, Puntuación (estrellas), Guardar/Cancelar
  - Paginación

### 6. watchlist.html (Lista por Ver)
- **Funcionalidad**: Grid de películas pendientes
- **JavaScript**: `watchlist.js`
- **Contenido**:
  - Grid de cards (poster, título, fecha)
  - Botón eliminar por card
  - Contador total
  - Botón "Mover a Diario" (añade al diario y quita de watchlist)

## 🔧 Configuración y Setup

### Variables de Entorno
- `TMDB_API_KEY`: API key de The Movie Database

### Base de Datos
- MariaDB con esquemas: `usuario`, `pelicula`, `usuario_diario`, `usuario_watchlist`

### Tecnologías Frontend
- **Bootstrap 5**: Framework CSS
- **JavaScript Vanilla**: Sin librerías adicionales
- **Arquitectura**: Páginas HTML tradicionales (no SPA)
- **Comunicación**: Fetch API para llamadas al backend

## 🚀 Flujo de Usuario

1. **Login/Registro** (`index.html`) → Token JWT almacenado
2. **Dashboard** (`dashboard.html`) → Vista general + navegación
3. **Búsqueda** (`search.html`) → Encontrar películas → Añadir a diario/watchlist
4. **Detalles** (`movie-detail.html`) → Ver info completa → Acciones
5. **Diario** (`diary.html`) → Gestionar películas vistas → Editar puntuaciones
6. **Watchlist** (`watchlist.html`) → Gestionar películas por ver

## 📝 Estado del Desarrollo

### Backend ✅ Completado
- Autenticación JWT
- Integración TMDB
- CRUD Diario y Watchlist
- Validaciones y manejo de errores

### Frontend 🚧 En Desarrollo
- Estructura de archivos definida
- Wireframes y diseño planificado
- Pendiente: Implementación HTML/CSS/JS

## 💡 Notas Técnicas

- **Autenticación**: JWT en header `Authorization: Bearer {token}`
- **Manejo de Estados**: LocalStorage para token, variables JS para datos temporales
- **Validaciones**: Puntuaciones 0-5, fechas válidas, campos obligatorios
- **Responsive**: Bootstrap 5 grid system
- **Error Handling**: Try-catch + mensajes de usuario amigables