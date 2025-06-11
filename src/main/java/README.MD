# FilmDiary - Aplicación de Diario de Películas

## 📋 Descripción del Proyecto

FilmDiary es una aplicación web completa para llevar un registro personal de películas vistas y por ver. Integra con la API de TMDB para búsqueda de películas y permite a los usuarios crear su diario personal y watchlist.

## 🏗️ Arquitectura

- **Backend**: Spring Boot + MariaDB + JWT + Integración TMDB
- **Frontend**: HTML + Bootstrap 5 + JavaScript vanilla
- **Servidor Web**: Apache (para el frontend)

## 📁 Estructura del Proyecto

```
film-diary-backend/
├── src/                          # Código Java Spring Boot
├── frontend/                     # Aplicación web frontend
│   ├── index.html               # Login/Registro
│   ├── dashboard.html           # Dashboard principal
│   ├── search.html              # Búsqueda de películas
│   ├── movie-detail.html        # Detalles de película
│   ├── diary.html               # Diario personal
│   ├── watchlist.html           # Lista de películas por ver
│   ├── css/styles.css           # Estilos personalizados
│   └── js/                      # Lógica JavaScript
│       ├── api.js               # Comunicación con backend
│       ├── auth.js              # Autenticación
│       ├── dashboard.js         # Dashboard
│       ├── search.js            # Búsqueda
│       ├── movie-detail.js      # Detalles película
│       ├── diary.js             # Diario
│       └── watchlist.js         # Watchlist
```

## 🚀 Estado Actual - FUNCIONALIDADES VERIFICADAS

📋 FilmDiary - Checklist de Estado
✅ VERIFICADO Y FUNCIONANDO 100%
🔐 Sistema de Autenticación

✅ Registro de usuarios - Validaciones + JWT + almacenamiento
✅ Inicio de sesión - Email/password + token persistente
✅ Cierre de sesión - Limpieza localStorage + redirección

🔍 Búsqueda y Navegación

✅ Búsqueda de películas - TMDB API + paginación + resultados
✅ Detalles de película - Info completa + poster + géneros + sinopsis

🔧 Infraestructura Técnica

✅ localStorage - Funcionando correctamente con Apache
✅ API comunicación - Backend ↔ Frontend sin errores
✅ CORS - Configurado y operativo
✅ Responsive design - Bootstrap funcionando


🔍 PENDIENTE DE VERIFICAR
🏠 Dashboard Principal

🔍 Carga de página - ¿Se muestra correctamente?
🔍 Última película vista - ¿Aparece info o "vacío"?
🔍 Preview watchlist - ¿Muestra películas o "vacía"?
🔍 Contadores - ¿Estadísticas correctas?
🔍 Navegación - ¿Links funcionan?

🎬 Acciones de Película (movie-detail.html)

🔍 Botón "Añadir al Diario" - ¿Modal funciona?
🔍 Modal diario - ¿Fecha + estrellas + guardar?
🔍 Botón "Añadir a Mi Lista" - ¿Añade a watchlist?
🔍 Toasts/notificaciones - ¿Confirma acciones?

📖 Diario Personal (diary.html)

🔍 Carga de tabla - ¿Muestra películas vistas?
🔍 Paginación - ¿Navega entre páginas?
🔍 Filtros - ¿Año + rating + ordenamiento?
🔍 Modal editar - ¿Funciona edición de entradas?
🔍 Eliminar entradas - ¿Borra del diario?
🔍 Estadísticas - ¿Total + promedio rating?

⏰ Watchlist (watchlist.html)

🔍 Carga de grid/lista - ¿Muestra películas por ver?
🔍 Toggle vista - ¿Grid ↔ Lista funciona?
🔍 Botón "Ya la vi" - ¿Modal mover a diario?
🔍 Eliminar de lista - ¿Borra de watchlist?
🔍 Estadísticas - ¿Total + recientes?

## 🔧 Configuración y Setup

### **Requisitos**
- Java 17+
- MariaDB
- Apache HTTP Server
- API Key de TMDB

### **Variables de Entorno**
```bash
export TMDB_API_KEY="tu_api_key_de_tmdb"
```

### **Base de Datos**
MariaDB con esquemas: `usuario`, `pelicula`, `usuario_diario`, `usuario_watchlist`

### **Ejecutar Backend**
```bash
cd film-diary-backend
./mvnw spring-boot:run
```
El backend estará disponible en: `http://localhost:8080`

### **Configurar Frontend con Apache**

#### **1. Copiar archivos frontend**
```bash
# Copiar la carpeta frontend al directorio de Apache
sudo cp -r frontend/ /var/www/html/
```

#### **2. Configurar permisos**
```bash
sudo chown -R www-data:www-data /var/www/html/frontend/
sudo chmod -R 755 /var/www/html/frontend/
```

#### **3. Verificar Apache**
```bash
# Verificar que Apache esté ejecutándose
sudo systemctl status apache2

# Si no está activo, iniciarlo
sudo systemctl start apache2
```

#### **4. Acceder a la aplicación**
- **URL de acceso**: `http://localhost/frontend/index.html`
- **Login/Registro**: `http://localhost/frontend/index.html`
- **Búsqueda**: `http://localhost/frontend/search.html`

## 🔌 API Endpoints (Backend)

### **Autenticación**
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario

### **Búsqueda de Películas**  
- `GET /api/movies/search?query={query}&page={page}` - Buscar películas en TMDB
- `GET /api/movies/{movieId}` - Detalles de película específica

### **Diario Personal**
- `GET /api/diario?usuarioId={id}&page={page}&size={size}` - Obtener diario paginado
- `POST /api/diario/tmdb/{tmdbId}?usuarioId={id}` - Añadir película al diario
- `PUT /api/diario/{entryId}` - Actualizar entrada
- `DELETE /api/diario/{entryId}` - Eliminar entrada

### **Watchlist**
- `GET /api/watchlist?usuarioId={id}&page={page}&size={size}` - Obtener watchlist paginada
- `POST /api/watchlist/tmdb/{tmdbId}?usuarioId={id}` - Añadir película a watchlist
- `DELETE /api/watchlist/{peliculaId}?usuarioId={id}` - Eliminar de watchlist
- `GET /api/watchlist/count?usuarioId={id}` - Contar películas en watchlist

## 🚀 Flujo de Usuario

1. **Registro/Login** → Autenticación JWT + datos almacenados
2. **Dashboard** → Vista general personalizada
3. **Búsqueda** → Encontrar películas en TMDB
4. **Detalles** → Ver información completa + añadir a diario/watchlist
5. **Diario** → Gestionar películas vistas (editar, eliminar)
6. **Watchlist** → Gestionar películas por ver

## 💡 Características Técnicas

### **Frontend**
- **Autenticación automática** con localStorage
- **API centralizada** (api.js) que maneja automáticamente el usuario logueado
- **Sistema de notificaciones** con Bootstrap toasts
- **Estados de carga** y manejo de errores
- **Rating con estrellas** interactivo (1-5 estrellas)
- **Responsive design** con Bootstrap 5

### **Backend**
- **Seguridad JWT** con tokens persistentes
- **Integración TMDB** completa
- **Base de datos relacional** optimizada
- **Validaciones** exhaustivas
- **CORS** configurado para desarrollo local

## 🔧 Resolución de Problemas

### **Problemas Comunes**

#### **1. Error de CORS**
- Verificar que backend esté en `localhost:8080`
- Verificar que frontend acceda via `http://localhost/frontend/`

#### **2. Error "api is not defined"**
- Verificar que `js/api.js` se carga antes que otros scripts JS
- Forzar recarga: `Ctrl+F5`

#### **3. Error de localStorage**
- Verificar acceso via HTTP (no file://)
- Verificar que Apache esté sirviendo correctamente

#### **4. Problemas de autenticación**
- Verificar variable `TMDB_API_KEY` en backend
- Verificar conexión a MariaDB

### **Debugging**
```bash
# Backend - Ver logs
tail -f logs/spring.log

# Frontend - Console del navegador
F12 → Console → Ver errores JavaScript
```

### **Reset completo**
```javascript
// En consola del navegador si es necesario
localStorage.clear();
window.location.reload();
```

## 🔍 URLs de Acceso

### **Aplicación**
- **Inicio**: `http://localhost/frontend/index.html`
- **Dashboard**: `http://localhost/frontend/dashboard.html`
- **Búsqueda**: `http://localhost/frontend/search.html`

### **Backend**
- **API**: `http://localhost:8080/api`
- **Swagger**: `http://localhost:8080/swagger-ui.html`

---

**Desarrollado con Spring Boot + Bootstrap 5 + JavaScript Vanilla**  
**Integración TMDB para catálogo de películas**