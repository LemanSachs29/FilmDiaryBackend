/**
 * Maneja toda la lógica del dashboard principal
 */
class DashboardManager {
  constructor() {
    this.initializeElements();
    this.checkAuthentication();
    this.attachEventListeners();
    this.loadDashboardData();
  }

  /**
   * Inicializa referencias a elementos del DOM
   */
  initializeElements() {
    this.logoutBtn = document.getElementById("logout-btn");
    this.loadingSpinner = document.getElementById("loading-spinner");
    this.watchlistCount = document.getElementById("watchlist-count");

    // Contenedores principales
    this.lastMovieContainer = document.getElementById("last-movie-container");
    this.watchlistPreviewContainer = document.getElementById(
      "watchlist-preview-container"
    );

    // Estados vacíos
    this.noLastMovie = document.getElementById("no-last-movie");
    this.noWatchlist = document.getElementById("no-watchlist");
  }

  /**
   * Verifica autenticación al cargar la página
   */
  checkAuthentication() {
    if (!api.isAuthenticated()) {
      alert("Debes iniciar sesión para acceder al dashboard");
      window.location.href = "index.html";
      return;
    }
  }

  /**
   * Adjunta event listeners
   */
  attachEventListeners() {
    this.logoutBtn.addEventListener("click", () => this.handleLogout());
  }

  /**
   * Maneja el cierre de sesión
   */
  handleLogout() {
    if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
      api.logout();
      window.location.href = "index.html";
    }
  }

  /**
   * Carga todos los datos del dashboard
   */
  async loadDashboardData() {
    this.showLoading(true);

    try {
      // Cargar datos en paralelo para mejor rendimiento
      await Promise.all([
        this.loadUserInfo(),
        this.loadLastMovie(),
        this.loadWatchlistPreview(),
        this.loadWatchlistCount(),
      ]);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      this.showError("Error al cargar los datos del dashboard");
    } finally {
      this.showLoading(false);
    }
  }

  /**
   * Carga información del usuario para personalizar la bienvenida
   */
  async loadUserInfo() {
    try {
      const user = api.getCurrentUser();
      if (user && user.nombre) {
        // Personalizar el mensaje de bienvenida
        const welcomeTitle = document.querySelector("h1.h3");
        if (welcomeTitle) {
          welcomeTitle.textContent = `¡Bienvenido${
            user.nombre ? ", " + user.nombre : ""
          }! 🎬`;
        }
      }
    } catch (error) {
      console.error("Error loading user info:", error);
    }
  }

  /**
   * Carga la última película vista
   */
  async loadLastMovie() {
    try {
      const diaryResponse = await api.getDiary(0, 1); // Solo la primera (más reciente)

      if (diaryResponse.content && diaryResponse.content.length > 0) {
        const lastEntry = diaryResponse.content[0];
        this.displayLastMovie(lastEntry);
      } else {
        this.showNoLastMovie();
      }
    } catch (error) {
      console.error("Error loading last movie:", error);
      this.showNoLastMovie();
    }
  }

  /**
   * Carga preview de la watchlist (3 películas)
   */
  async loadWatchlistPreview() {
    try {
      const watchlistResponse = await api.getWatchlist(0, 6);

      if (watchlistResponse.content && watchlistResponse.content.length > 0) {
        this.displayWatchlistPreview(watchlistResponse.content);
      } else {
        this.showNoWatchlist();
      }
    } catch (error) {
      console.error("Error loading watchlist preview:", error);
      this.showNoWatchlist();
    }
  }

  /**
   * Carga el contador de la watchlist
   */
  async loadWatchlistCount() {
    try {
      const count = await api.getWatchlistCount();
      this.watchlistCount.textContent = count || 0;
    } catch (error) {
      console.error("Error loading watchlist count:", error);
      this.watchlistCount.textContent = "0";
    }
  }

  /**
   * Muestra la última película vista
   */
  displayLastMovie(diaryEntry) {
    const movie = diaryEntry.pelicula;
    const stars = this.generateStarRating(diaryEntry.puntuacion);
    const posterUrl = this.getTmdbImageUrlSmall(movie.posterUrl);

    const movieHtml = `
            <div class="card h-100">
                <div class="row g-0">
                    <div class="col-md-3 d-flex justify-content-center">
                        <div style="width: 70%; max-width: 120px; aspect-ratio: 2/3; overflow: hidden;" class="rounded-start">
                            <img src="${posterUrl}" 
                            class="movie-poster" 
                            alt="${movie.titulo}"
                            style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                    </div>
                    <div class="col-md-9">
                        <div class="card-body h-100 d-flex flex-column">
                            <h5 class="card-title">${movie.titulo}</h5>
                            <p class="card-text">
                                <small class="text-muted">
                                    <strong>Fecha de estreno:</strong> ${this.formatDate(
                                      movie.releaseDate
                                    )}<br>
                                    <strong>Visto el:</strong> ${this.formatDate(
                                      diaryEntry.fechaVisionado
                                    )}
                                </small>
                            </p>
                            <div class="mt-auto">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>Tu puntuación:</strong>
                                        <div class="star-rating">${stars}</div>
                                    </div>
                                    <div>
                                        <a href="movie-detail.html?id=${
                                          movie.idTmdb
                                        }" class="btn btn-outline-primary btn-sm">
                                            Ver Detalles
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

    this.lastMovieContainer.innerHTML = movieHtml;
  }

  /**
   * Muestra el preview de la watchlist
   */
  displayWatchlistPreview(watchlistItems) {
    const moviesHtml = watchlistItems
      .map((item) => {
        const movie = item.pelicula;
        const posterUrl = this.getTmdbImageUrlSmall(movie.posterUrl);

        return `
                <div class="col-lg-2 col-md-3 col-sm-4 col-6 mb-3 d-flex justify-content-center">
                    <div class="card h-100 movie-card">
                        <div style="width: 80%; max-width: 100px; aspect-ratio: 2/3; overflow: hidden; margin: 0 auto;">
                            <img src="${posterUrl}" 
                                class="movie-poster" 
                                alt="${movie.titulo}"
                                style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                        <div class="card-body d-flex flex-column">
                            <h6 class="card-title">${this.truncateText(
                              movie.titulo,
                              40
                            )}</h6>
                            <p class="card-text small text-muted mb-auto">
                                ${this.formatDate(movie.releaseDate)}
                            </p>
                            <div class="mt-2">
                                <a href="movie-detail.html?id=${movie.idTmdb}" 
                                   class="btn btn-outline-primary btn-sm w-100">
                                    Ver Detalles
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
      })
      .join("");

    const containerHtml = `
            <div class="row">
                ${moviesHtml}
            </div>
        `;

    this.watchlistPreviewContainer.innerHTML = containerHtml;
  }

  /**
   * Muestra el estado "sin última película"
   */
  showNoLastMovie() {
    // Ya está en el HTML por defecto
  }

  /**
   * Muestra el estado "sin watchlist"
   */
  showNoWatchlist() {
    // Ya está en el HTML por defecto
  }

  /**
   * Genera rating de estrellas HTML
   */
  generateStarRating(rating) {
    const maxStars = 5;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

    let starsHtml = "";

    // Estrellas llenas
    for (let i = 0; i < fullStars; i++) {
      starsHtml += "⭐";
    }

    // Media estrella
    if (hasHalfStar) {
      starsHtml += "⭐"; // Simplificado, podríamos usar media estrella
    }

    // Estrellas vacías
    for (let i = 0; i < emptyStars; i++) {
      starsHtml += "☆";
    }

    return `${starsHtml} (${rating}/5)`;
  }

  /**
   * Obtiene URL completa de imagen de TMDB
   */
  getTmdbImageUrl(posterPath) {
    if (!posterPath || posterPath === "null") {
      return "https://via.placeholder.com/300x450/cccccc/666666?text=Sin+Imagen";
    }

    // Si ya es una URL completa, devolverla tal cual
    if (posterPath.startsWith("http")) {
      return posterPath;
    }

    // Si es solo el path, construir URL de TMDB
    return `https://image.tmdb.org/t/p/w300${posterPath}`;
  }

  /**
   * Obtiene URL de imagen de TMDB optimizada para dashboard (tamaño pequeño)
   */
  getTmdbImageUrlSmall(posterPath) {
    if (!posterPath || posterPath === "null") {
      return "https://via.placeholder.com/154x231/cccccc/666666?text=Sin+Imagen";
    }

    // Si ya es una URL completa, devolverla tal cual
    if (posterPath.startsWith("http")) {
      return posterPath;
    }

    // Si es solo el path, construir URL de TMDB con tamaño w154 (más pequeño)
    return `https://image.tmdb.org/t/p/w185${posterPath}`;
  }

  /**
   * Formatea una fecha para mostrar
   */
  formatDate(dateString) {
    if (!dateString) return "No disponible";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  }

  /**
   * Trunca texto a cierta longitud
   */
  truncateText(text, maxLength) {
    if (!text) return "";

    if (text.length <= maxLength) {
      return text;
    }

    return text.substring(0, maxLength) + "...";
  }

  /**
   * Muestra/oculta spinner de carga
   */
  showLoading(isLoading) {
    this.loadingSpinner.style.display = isLoading ? "block" : "none";
  }

  /**
   * Muestra un error al usuario
   */
  showError(message) {
    // Crear un toast o alert simple
    const alertDiv = document.createElement("div");
    alertDiv.className =
      "alert alert-danger alert-dismissible fade show position-fixed";
    alertDiv.style.cssText =
      "top: 20px; right: 20px; z-index: 9999; min-width: 300px;";
    alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

    document.body.appendChild(alertDiv);

    // Auto-remover después de 5 segundos
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.remove();
      }
    }, 5000);
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  new DashboardManager();
});
