/**
 * Clase para manejar toda la comunicación con el backend FilmDiary
 */
class FilmDiaryAPI {
    constructor() {
        this.baseURL = 'http://localhost:8080/api';
        this.token = localStorage.getItem('authToken');
    }

    /**
     * Guarda el token y datos del usuario en localStorage
     */
    setToken(token) {
        this.token = token;
        localStorage.setItem('authToken', token);
    }

    /**
     * Guarda los datos del usuario logueado
     */
    setUserData(userData) {
        localStorage.setItem('currentUser', JSON.stringify(userData));
    }

    /**
     * Obtiene los datos del usuario logueado
     */
    getCurrentUser() {
        const userData = localStorage.getItem('currentUser');
        return userData ? JSON.parse(userData) : null;
    }

    /**
     * Obtiene solo el ID del usuario actual
     */
    getCurrentUserId() {
        const user = this.getCurrentUser();
        return user ? user.userId : null;
    }

    /**
     * Elimina el token y datos del usuario (logout)
     */
    clearToken() {
        this.token = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
    }

    /**
     * Obtiene headers base para las peticiones
     */
    getHeaders(includeAuth = true) {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (includeAuth && this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    /**
     * Método genérico para hacer peticiones HTTP
     */
    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const config = {
            headers: this.getHeaders(options.auth !== false),
            ...options
        };

        try {
            const response = await fetch(url, config);
            
            // Si no hay contenido (204), devolver null
            if (response.status === 204) {
                return null;
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.mensaje || `Error ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // ==================== AUTENTICACIÓN ====================

    /**
     * Iniciar sesión
     */
    async login(email, password) {
        const response = await this.makeRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            auth: false // No necesita token para login
        });

        if (response.token && response.user) {
            this.setToken(response.token);
            this.setUserData(response.user);
        }

        return response;
    }

    /**
     * Registrar nuevo usuario
     */
    async register(userData) {
        const response = await this.makeRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
            auth: false // No necesita token para registro
        });

        if (response.token && response.user) {
            this.setToken(response.token);
            this.setUserData(response.user);
        }

        return response;
    }

    /**
     * Cerrar sesión (solo limpia token localmente)
     */
    logout() {
        this.clearToken();
    }

    /**
     * Verifica si el usuario está autenticado
     */
    isAuthenticated() {
        return !!this.token;
    }

    // ==================== BÚSQUEDA DE PELÍCULAS ====================

    /**
     * Buscar películas en TMDB
     */
    async searchMovies(query, page = 1, includeAdult = false) {
        const params = new URLSearchParams({
            query: query,
            page: page,
            includeAdult: includeAdult
        });

        return await this.makeRequest(`/movies/search?${params}`);
    }

    /**
     * Obtener detalles de una película específica
     */
    async getMovieDetails(movieId) {
        return await this.makeRequest(`/movies/${movieId}`);
    }

    // ==================== DIARIO ====================

    /**
     * Obtener diario paginado del usuario actual
     */
    async getDiary(page = 0, size = 10) {
        const usuarioId = this.getCurrentUserId();
        if (!usuarioId) {
            throw new Error('Usuario no autenticado');
        }

        const params = new URLSearchParams({
            usuarioId: usuarioId,
            page: page,
            size: size
        });

        return await this.makeRequest(`/diario?${params}`);
    }

    /**
     * Obtener diario paginado del usuario (versión con usuarioId explícito)
     */
    async getDiaryForUser(usuarioId, page = 0, size = 10) {
        const params = new URLSearchParams({
            usuarioId: usuarioId,
            page: page,
            size: size
        });

        return await this.makeRequest(`/diario?${params}`);
    }

    /**
     * Añadir película de TMDB al diario del usuario actual
     */
    async addToDiary(tmdbId, puntuacion = null, fechaVisionado = null) {
        const usuarioId = this.getCurrentUserId();
        if (!usuarioId) {
            throw new Error('Usuario no autenticado');
        }

        const params = new URLSearchParams({
            usuarioId: usuarioId
        });

        if (puntuacion !== null) {
            params.append('puntuacion', puntuacion);
        }

        if (fechaVisionado) {
            params.append('fechaVisionado', fechaVisionado);
        }

        return await this.makeRequest(`/diario/tmdb/${tmdbId}?${params}`, {
            method: 'POST'
        });
    }

    /**
     * Actualizar entrada del diario
     */
    async updateDiaryEntry(entryId, fechaVisionado = null, puntuacion = null) {
        const params = new URLSearchParams();

        if (fechaVisionado) {
            params.append('fechaVisionado', fechaVisionado);
        }

        if (puntuacion !== null) {
            params.append('puntuacion', puntuacion);
        }

        return await this.makeRequest(`/diario/${entryId}?${params}`, {
            method: 'PUT'
        });
    }

    /**
     * Eliminar entrada del diario
     */
    async removeDiaryEntry(entryId) {
        return await this.makeRequest(`/diario/${entryId}`, {
            method: 'DELETE'
        });
    }

    /**
     * Obtener entrada específica del diario
     */
    async getDiaryEntry(entryId) {
        return await this.makeRequest(`/diario/${entryId}`);
    }

    // ==================== WATCHLIST ====================

    /**
     * Obtener watchlist paginada del usuario actual
     */
    async getWatchlist(page = 0, size = 10) {
        const usuarioId = this.getCurrentUserId();
        if (!usuarioId) {
            throw new Error('Usuario no autenticado');
        }

        const params = new URLSearchParams({
            usuarioId: usuarioId,
            page: page,
            size: size
        });

        return await this.makeRequest(`/watchlist?${params}`);
    }

    /**
     * Obtener watchlist paginada del usuario (versión con usuarioId explícito)
     */
    async getWatchlistForUser(usuarioId, page = 0, size = 10) {
        const params = new URLSearchParams({
            usuarioId: usuarioId,
            page: page,
            size: size
        });

        return await this.makeRequest(`/watchlist?${params}`);
    }

    /**
     * Añadir película de TMDB a la watchlist del usuario actual
     */
    async addToWatchlist(tmdbId) {
        const usuarioId = this.getCurrentUserId();
        if (!usuarioId) {
            throw new Error('Usuario no autenticado');
        }

        const params = new URLSearchParams({
            usuarioId: usuarioId
        });

        return await this.makeRequest(`/watchlist/tmdb/${tmdbId}?${params}`, {
            method: 'POST'
        });
    }

    /**
     * Eliminar película de la watchlist del usuario actual
     */
    async removeFromWatchlist(peliculaId) {
        const usuarioId = this.getCurrentUserId();
        if (!usuarioId) {
            throw new Error('Usuario no autenticado');
        }

        const params = new URLSearchParams({
            usuarioId: usuarioId
        });

        return await this.makeRequest(`/watchlist/${peliculaId}?${params}`, {
            method: 'DELETE'
        });
    }

    /**
     * Verificar si una película está en la watchlist del usuario actual
     */
    async isInWatchlist(peliculaId) {
        const usuarioId = this.getCurrentUserId();
        if (!usuarioId) {
            throw new Error('Usuario no autenticado');
        }

        const params = new URLSearchParams({
            usuarioId: usuarioId
        });

        return await this.makeRequest(`/watchlist/check/${peliculaId}?${params}`);
    }

    /**
     * Obtener conteo de películas en watchlist del usuario actual
     */
    async getWatchlistCount() {
        const usuarioId = this.getCurrentUserId();
        if (!usuarioId) {
            throw new Error('Usuario no autenticado');
        }

        const params = new URLSearchParams({
            usuarioId: usuarioId
        });

        return await this.makeRequest(`/watchlist/count?${params}`);
    }
}

// Crear instancia global de la API
const api = new FilmDiaryAPI();