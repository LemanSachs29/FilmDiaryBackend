/**
 * Clase para manejar toda la comunicación con el backend FilmDiary
 * VERSIÓN CON DEBUGGING COMPLETO
 */
class FilmDiaryAPI {
  constructor() {
    this.baseURL = "http://localhost:8080/api";

    console.log("🔧 Inicializando FilmDiary API...");
    console.log("🌐 Protocolo actual:", window.location.protocol);
    console.log("🏠 Host actual:", window.location.host);

    // Verificación completa de localStorage
    this.initializeStorage();
  }

  /**
   * Inicializa el sistema de almacenamiento con validaciones completas
   */
  initializeStorage() {
    console.log("💾 Verificando localStorage...");

    // Test 1: Verificar si localStorage existe
    if (typeof localStorage === "undefined") {
      console.error("❌ localStorage no está definido en este contexto");
      this.useTemporaryStorage = true;
      this.token = null;
      this.tempStorage = {};
      return;
    }

    // Test 2: Verificar si localStorage es accesible
    try {
      localStorage.setItem("test", "test");
      localStorage.removeItem("test");
      console.log("✅ localStorage funciona correctamente");
      this.useTemporaryStorage = false;
      this.token = localStorage.getItem("authToken");
      console.log("🔑 Token encontrado:", this.token ? "***existe***" : "null");
    } catch (error) {
      console.error("❌ localStorage no es accesible:", error);
      this.useTemporaryStorage = true;
      this.token = null;
      this.tempStorage = {};
    }
  }

  /**
   * Método seguro para obtener datos del storage
   */
  getFromStorage(key) {
    if (this.useTemporaryStorage) {
      console.log(`📦 Obteniendo "${key}" del almacenamiento temporal`);
      return this.tempStorage[key] || null;
    } else {
      console.log(`📦 Obteniendo "${key}" de localStorage`);
      return localStorage.getItem(key);
    }
  }

  /**
   * Método seguro para guardar datos en storage
   */
  setInStorage(key, value) {
    if (this.useTemporaryStorage) {
      console.log(`💾 Guardando "${key}" en almacenamiento temporal`);
      this.tempStorage[key] = value;
    } else {
      console.log(`💾 Guardando "${key}" en localStorage`);
      localStorage.setItem(key, value);
    }
  }

  /**
   * Método seguro para eliminar datos del storage
   */
  removeFromStorage(key) {
    if (this.useTemporaryStorage) {
      console.log(`🗑️ Eliminando "${key}" del almacenamiento temporal`);
      delete this.tempStorage[key];
    } else {
      console.log(`🗑️ Eliminando "${key}" de localStorage`);
      localStorage.removeItem(key);
    }
  }

  /**
   * Guarda el token y datos del usuario
   */
  setToken(token) {
    console.log("🔐 Guardando token de autenticación");
    this.token = token;
    this.setInStorage("authToken", token);
  }

  /**
   * Guarda los datos del usuario logueado
   */
  setUserData(userData) {
    console.log("👤 Guardando datos del usuario:", userData);
    this.setInStorage("currentUser", JSON.stringify(userData));
  }

  /**
   * Obtiene los datos del usuario logueado
   */
  getCurrentUser() {
    const userData = this.getFromStorage("currentUser");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        console.log("👤 Usuario actual:", parsed);
        return parsed;
      } catch (error) {
        console.error("❌ Error parsing user data:", error);
        return null;
      }
    }
    console.log("👤 No hay usuario logueado");
    return null;
  }

  /**
   * Obtiene solo el ID del usuario actual
   */
  getCurrentUserId() {
    const user = this.getCurrentUser();
    const userId = user ? user.id : null;
    console.log("🆔 ID del usuario actual:", userId);
    return userId;
  }

  /**
   * Elimina el token y datos del usuario (logout)
   */
  clearToken() {
    console.log("🚪 Cerrando sesión...");
    this.token = null;
    this.removeFromStorage("authToken");
    this.removeFromStorage("currentUser");

    if (this.tempStorage) {
      this.tempStorage = {};
    }
  }

  /**
   * Obtiene headers base para las peticiones
   */
  getHeaders(includeAuth = true) {
    const headers = {
      "Content-Type": "application/json",
    };

    if (includeAuth && this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
      console.log("🔐 Incluyendo header de autorización");
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
      ...options,
    };

    console.log(`🔄 API Request: ${options.method || "GET"} ${url}`);
    console.log("📋 Config:", config);

    try {
      const response = await fetch(url, config);

      console.log(`📡 API Response: ${response.status} ${response.statusText}`);

      // Si no hay contenido (204), devolver null
      if (response.status === 204) {
        return null;
      }

      // ✅ CORRECCIÓN: Manejar respuestas 200 vacías
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (!response.ok) {
          console.error("❌ API Error:", data);
          throw new Error(data.mensaje || `Error ${response.status}`);
        }
        console.log("✅ API Success:", data);
        return data;
      } else {
        // Respuesta exitosa sin JSON (200 vacío)
        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }
        console.log("✅ API Success: (sin contenido)");
        return null;
      }
    } catch (error) {
      console.error("🚨 API Error completo:", error);
      throw error;
    }
  }

  // ==================== AUTENTICACIÓN ====================

  async login(email, password) {
    console.log("🔐 Intentando login para:", email);

    const response = await this.makeRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      auth: false,
    });

    if (response.token && response.user) {
      this.setToken(response.token);
      this.setUserData(response.user);
      console.log("✅ Login exitoso");
    }

    return response;
  }

  async register(userData) {
    console.log("📝 Intentando registro para:", userData.email);

    const response = await this.makeRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
      auth: false,
    });

    if (response.token && response.user) {
      this.setToken(response.token);
      this.setUserData(response.user);
      console.log("✅ Registro exitoso");
    }

    return response;
  }

  logout() {
    this.clearToken();
  }

  isAuthenticated() {
    const isAuth = !!this.token;
    console.log("🔍 ¿Está autenticado?", isAuth);
    return isAuth;
  }

  // ==================== BÚSQUEDA DE PELÍCULAS ====================

  async searchMovies(query, page = 1, includeAdult = false) {
    console.log(`🎬 Buscando películas: "${query}" (página ${page})`);

    const params = new URLSearchParams({
      query: query,
      page: page,
      includeAdult: includeAdult,
    });

    return await this.makeRequest(`/movies/search?${params}`);
  }

  async getMovieDetails(movieId) {
    console.log("🎬 Obteniendo detalles de película:", movieId);
    return await this.makeRequest(`/movies/${movieId}`);
  }

  // ==================== DIARIO ====================

  async getDiary(page = 0, size = 10) {
    const usuarioId = this.getCurrentUserId();
    if (!usuarioId) {
      throw new Error("Usuario no autenticado");
    }

    console.log(`📖 Obteniendo diario (página ${page}, tamaño ${size})`);

    const params = new URLSearchParams({
      usuarioId: usuarioId,
      page: page,
      size: size,
    });

    return await this.makeRequest(`/diario?${params}`);
  }

  async addToDiary(tmdbId, puntuacion = null, fechaVisionado = null) {
    const usuarioId = this.getCurrentUserId();
    if (!usuarioId) {
      throw new Error("Usuario no autenticado");
    }

    console.log(`📖 Añadiendo película ${tmdbId} al diario`);

    const params = new URLSearchParams({
      usuarioId: usuarioId,
    });

    if (puntuacion !== null) {
      params.append("puntuacion", puntuacion);
    }

    if (fechaVisionado) {
      params.append("fechaVisionado", fechaVisionado);
    }

    return await this.makeRequest(`/diario/tmdb/${tmdbId}?${params}`, {
      method: "POST",
    });
  }

  // ==================== WATCHLIST ====================

  async getWatchlist(page = 0, size = 10) {
    const usuarioId = this.getCurrentUserId();
    if (!usuarioId) {
      throw new Error("Usuario no autenticado");
    }

    console.log(`⏰ Obteniendo watchlist (página ${page}, tamaño ${size})`);

    const params = new URLSearchParams({
      usuarioId: usuarioId,
      page: page,
      size: size,
    });

    return await this.makeRequest(`/watchlist?${params}`);
  }

  async addToWatchlist(tmdbId) {
    const usuarioId = this.getCurrentUserId();
    if (!usuarioId) {
      throw new Error("Usuario no autenticado");
    }

    console.log(`⏰ Añadiendo película ${tmdbId} a watchlist`);

    const params = new URLSearchParams({
      usuarioId: usuarioId,
    });

    return await this.makeRequest(`/watchlist/tmdb/${tmdbId}?${params}`, {
      method: "POST",
    });
  }

  async getWatchlistCount() {
    const usuarioId = this.getCurrentUserId();
    if (!usuarioId) {
      throw new Error("Usuario no autenticado");
    }

    const params = new URLSearchParams({
      usuarioId: usuarioId,
    });

    return await this.makeRequest(`/watchlist/count?${params}`);
  }
}

// Crear instancia global de la API con debugging
console.log("🚀 Creando instancia global de API...");
const api = new FilmDiaryAPI();
console.log("✅ API inicializada correctamente");

// Debug adicional del estado global
console.log("🔍 Estado inicial de la API:", {
  baseURL: api.baseURL,
  token: api.token ? "***existe***" : null,
  useTemporaryStorage: api.useTemporaryStorage,
  isAuthenticated: api.isAuthenticated(),
});
