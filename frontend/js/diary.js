/**
 * Maneja toda la lógica del diario personal de películas
 */
class DiaryManager {
  constructor() {
    this.currentPage = 0;
    this.pageSize = 10;
    this.totalPages = 0;
    this.totalElements = 0;
    this.diaryData = [];
    this.currentEditEntry = null;
    this.currentRating = 0;

    // Filtros
    this.filters = {
      year: "",
      rating: "",
      sort: "date-desc",
    };

    this.initializeElements();
    this.checkAuthentication();
    this.attachEventListeners();
    this.loadDiary();
  }

  /**
   * Inicializa referencias a elementos del DOM
   */
  initializeElements() {
    // Containers
    this.loadingContainer = document.getElementById("loading-container");
    this.emptyContainer = document.getElementById("empty-container");
    this.errorContainer = document.getElementById("error-container");
    this.diaryContainer = document.getElementById("diary-container");

    // Tabla
    this.diaryTableBody = document.getElementById("diary-table-body");
    this.paginationInfo = document.getElementById("pagination-info");
    this.pagination = document.getElementById("pagination");

    // Estadísticas
    this.totalMovies = document.getElementById("total-movies");
    this.averageRating = document.getElementById("average-rating");

    // Filtros
    this.yearFilter = document.getElementById("year-filter");
    this.ratingFilter = document.getElementById("rating-filter");
    this.sortFilter = document.getElementById("sort-filter");

    // Modal de edición
    this.editModal = document.getElementById("editModal");
    this.editForm = document.getElementById("edit-form");
    this.editMoviePoster = document.getElementById("edit-movie-poster");
    this.editMovieTitle = document.getElementById("edit-movie-title");
    this.editMovieYear = document.getElementById("edit-movie-year");
    this.editFechaVisionado = document.getElementById("edit-fecha-visionado");
    this.editPuntuacionInput = document.getElementById("edit-puntuacion");
    this.editRatingText = document.getElementById("edit-rating-text");
    this.saveEditBtn = document.getElementById("save-edit-btn");
    this.saveEditText = document.getElementById("save-edit-text");
    this.saveEditSpinner = document.getElementById("save-edit-spinner");
    this.deleteEntryBtn = document.getElementById("delete-entry-btn");
    this.deleteText = document.getElementById("delete-text");
    this.deleteSpinner = document.getElementById("delete-spinner");

    // Star rating en modal
    this.editStarButtons = document.querySelectorAll("#editModal .star-btn");
    this.editStarContainer = document.querySelector("#editModal .star-buttons");

    // Otros
    this.logoutBtn = document.getElementById("logout-btn");
    this.errorMessage = document.getElementById("error-message");
    this.toastContainer = document.getElementById("toast-container");

    // Set max date to today
    this.editFechaVisionado.max = new Date().toISOString().split("T")[0];

    // Temporal - para debugging
    console.log("🔍 Debugging modal elements:");
    console.log("editPuntuacionInput:", this.editPuntuacionInput);
    console.log("editRatingText:", this.editRatingText);
    console.log("editStarButtons length:", this.editStarButtons.length);
    console.log("editModal:", this.editModal);

    // Verificar si están en el DOM
    console.log(
      "edit-puntuacion en DOM:",
      document.getElementById("edit-puntuacion")
    );
    console.log(
      "edit-rating-text en DOM:",
      document.getElementById("edit-rating-text")
    );
  }

  /**
   * Verifica autenticación
   */
  checkAuthentication() {
    if (!api.isAuthenticated()) {
      alert("Debes iniciar sesión para ver tu diario");
      window.location.href = "index.html";
      return;
    }
  }

  /**
   * Adjunta event listeners
   */
  attachEventListeners() {
    this.logoutBtn.addEventListener("click", () => this.handleLogout());

    // Filtros
    this.yearFilter.addEventListener("change", () => this.handleFilterChange());
    this.ratingFilter.addEventListener("change", () =>
      this.handleFilterChange()
    );
    this.sortFilter.addEventListener("change", () => this.handleFilterChange());

    // Modal de edición
    this.saveEditBtn.addEventListener("click", () => this.handleSaveEdit());
    this.deleteEntryBtn.addEventListener("click", () =>
      this.handleDeleteEntry()
    );

    // Star rating en modal
    this.editStarButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => this.handleEditStarRating(e));
    });
    this.editStarContainer.addEventListener("dblclick", () =>
      this.resetEditRating()
    );
  }

  /**
   * Maneja logout
   */
  handleLogout() {
    if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
      api.logout();
      window.location.href = "index.html";
    }
  }

  /**
   * Maneja cambios en filtros
   */
  handleFilterChange() {
    this.filters.year = this.yearFilter.value;
    this.filters.rating = this.ratingFilter.value;
    this.filters.sort = this.sortFilter.value;

    // Resetear a primera página cuando se cambian filtros
    this.currentPage = 0;
    this.loadDiary();
  }

  /**
   * Carga el diario con paginación y filtros
   */
  async loadDiary() {
    this.showLoading();

    try {
      const response = await api.getDiary(this.currentPage, this.pageSize);

      if (response && response.content) {
        this.diaryData = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;

        if (this.diaryData.length === 0 && this.currentPage === 0) {
          this.showEmpty();
        } else {
          this.displayDiary();
          this.updatePagination();
          this.calculateStats();
          this.populateYearFilter();
          this.showDiary();
        }
      } else {
        this.showEmpty();
      }
    } catch (error) {
      console.error("Error loading diary:", error);
      this.showError("No se pudo cargar tu diario: " + error.message);
    }
  }

  /**
   * Muestra el diario en la tabla
   */
  displayDiary() {
    // Aplicar filtros locales (el backend no los soporta aún)
    let filteredData = this.applyLocalFilters([...this.diaryData]);

    const tableHtml = filteredData
      .map((entry) => {
        const movie = entry.pelicula;
        const posterUrl = this.getTmdbImageUrl(movie.posterUrl);
        const formattedDate = this.formatDate(entry.fechaVisionado);
        const starsHtml = this.generateStarsDisplay(entry.puntuacion);
        const movieYear = movie.releaseDate
          ? new Date(movie.releaseDate).getFullYear()
          : "N/A";

        return `
                <tr>
                    <td>
                        <div class="d-flex flex-column">
                            <span class="fw-medium">${formattedDate.day}</span>
                            <small class="text-muted">${formattedDate.monthYear}</small>
                        </div>
                    </td>
                    <td>
                        <img src="${posterUrl}" 
                             alt="${movie.titulo}" 
                             class="rounded" 
                             style="width: 40px; height: 60px; object-fit: cover;">
                    </td>
                    <td>
                        <div>
                            <div class="fw-medium mb-1">
                                <a href="movie-detail.html?id=${movie.idTmdb}" 
                                   class="text-decoration-none" 
                                   title="Ver detalles">
                                    ${movie.titulo}
                                </a>
                            </div>
                            <small class="text-muted">${movieYear}</small>
                        </div>
                    </td>
                    <td class="text-center">
                        <div class="d-flex align-items-center justify-content-center">
                            <span class="star-rating">${starsHtml}</span>
                        </div>
                        <small class="text-muted">${entry.puntuacion}/5</small>
                    </td>
                    <td class="text-center">
                        <div class="btn-group btn-group-sm" role="group">
                            <button type="button" 
                                    class="btn btn-outline-primary" 
                                    onclick="diaryManager.showEditModal(${entry.idEntradaPelicula})"
                                    title="Editar entrada">
                                ✏️
                            </button>
                            <button type="button" 
                                    class="btn btn-outline-danger" 
                                    onclick="diaryManager.confirmDeleteEntry(${entry.idEntradaPelicula})"
                                    title="Eliminar entrada">
                                🗑️
                            </button>
                        </div>
                    </td>
                </tr>
            `;
      })
      .join("");

    this.diaryTableBody.innerHTML = tableHtml;
  }

  /**
   * Aplica filtros locales a los datos
   */
  applyLocalFilters(data) {
    let filtered = [...data];

    // Filtro por año
    if (this.filters.year) {
      filtered = filtered.filter((entry) => {
        const year = new Date(entry.fechaVisionado).getFullYear().toString();
        return year === this.filters.year;
      });
    }

    // Filtro por rating
    if (this.filters.rating) {
      const targetRating = parseInt(this.filters.rating);
      filtered = filtered.filter((entry) => {
        return Math.floor(entry.puntuacion) === targetRating;
      });
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      switch (this.filters.sort) {
        case "date-desc":
          return new Date(b.fechaVisionado) - new Date(a.fechaVisionado);
        case "date-asc":
          return new Date(a.fechaVisionado) - new Date(b.fechaVisionado);
        case "rating-desc":
          return b.puntuacion - a.puntuacion;
        case "rating-asc":
          return a.puntuacion - b.puntuacion;
        case "title-asc":
          return a.pelicula.titulo.localeCompare(b.pelicula.titulo);
        case "title-desc":
          return b.pelicula.titulo.localeCompare(a.pelicula.titulo);
        default:
          return 0;
      }
    });

    return filtered;
  }

  /**
   * Calcula y muestra estadísticas
   */
  calculateStats() {
    if (this.diaryData.length === 0) {
      this.totalMovies.textContent = "0";
      this.averageRating.textContent = "-";
      return;
    }

    // Total de películas (usar totalElements para incluir todas las páginas)
    this.totalMovies.textContent = this.totalElements.toLocaleString();

    // Promedio de puntuaciones (solo de la página actual)
    const ratingsWithScore = this.diaryData.filter(
      (entry) => entry.puntuacion > 0
    );
    if (ratingsWithScore.length > 0) {
      const average =
        ratingsWithScore.reduce((sum, entry) => sum + entry.puntuacion, 0) /
        ratingsWithScore.length;
      this.averageRating.textContent = `${average.toFixed(1)}/5 ⭐`;
    } else {
      this.averageRating.textContent = "Sin puntuaciones";
    }
  }

  /**
   * Puebla el filtro de años con los años disponibles
   */
  populateYearFilter() {
    const years = [
      ...new Set(
        this.diaryData.map((entry) =>
          new Date(entry.fechaVisionado).getFullYear()
        )
      ),
    ].sort((a, b) => b - a);

    // Preservar selección actual
    const currentSelection = this.yearFilter.value;

    // Limpiar opciones existentes (excepto "Todos los años")
    while (this.yearFilter.children.length > 1) {
      this.yearFilter.removeChild(this.yearFilter.lastChild);
    }

    // Añadir años
    years.forEach((year) => {
      const option = document.createElement("option");
      option.value = year;
      option.textContent = year;
      this.yearFilter.appendChild(option);
    });

    // Restaurar selección
    this.yearFilter.value = currentSelection;
  }

  /**
   * Muestra modal de edición
   */
  showEditModal(entryId) {
    const entry = this.diaryData.find((e) => e.idEntradaPelicula === entryId);
    if (!entry) {
      this.showToast("No se encontró la entrada del diario", "danger");
      return;
    }

    this.currentEditEntry = entry;
    const movie = entry.pelicula;

    // Llenar información de la película
    this.editMoviePoster.src = this.getTmdbImageUrl(movie.posterUrl);
    this.editMovieTitle.textContent = movie.titulo;
    this.editMovieYear.textContent = movie.releaseDate
      ? `(${new Date(movie.releaseDate).getFullYear()})`
      : "";

    // Llenar datos del formulario
    this.editFechaVisionado.value = entry.fechaVisionado;
    this.setEditRating(entry.puntuacion);

    // Mostrar modal
    const modal = new bootstrap.Modal(this.editModal);
    modal.show();
  }

  /**
   * Establece el rating en el modal de edición
   */
  setEditRating(rating) {
    console.log('🎯 setEditRating llamado con rating:', rating);
    console.log('🎯 editPuntuacionInput existe?:', this.editPuntuacionInput);

    if (!this.editPuntuacionInput) {
        console.error('❌ editPuntuacionInput es null, reintentando encontrarlo...');
        this.editPuntuacionInput = document.getElementById('edit-puntuacion');
        console.log('🔄 Después de reintentar:', this.editPuntuacionInput);
    }


    this.currentRating = rating;
    this.editPuntuacionInput.value = rating;

    // Actualizar estrellas
    this.editStarButtons.forEach((btn, index) => {
      if (index < rating) {
        btn.classList.remove("btn-outline-warning");
        btn.classList.add("btn-warning");
      } else {
        btn.classList.remove("btn-warning");
        btn.classList.add("btn-outline-warning");
      }
    });

  }

  /**
   * Maneja clicks en estrellas del modal de edición
   */
  handleEditStarRating(event) {
    const value = parseInt(event.target.dataset.value);
    this.setEditRating(value);
  }

  /**
   * Resetea rating en modal de edición
   */
  resetEditRating() {
    this.setEditRating(0);
  }

  /**
   * Guarda cambios en el modal de edición
   */
  async handleSaveEdit() {
    if (!this.currentEditEntry) return;

    const fechaVisionado = this.editFechaVisionado.value;
    const puntuacion = this.currentRating;

    if (!fechaVisionado) {
      this.showToast("Por favor, selecciona una fecha", "warning");
      return;
    }

    this.setSaveEditLoading(true);

    try {
      await api.updateDiaryEntry(
        this.currentEditEntry.idEntradaPelicula,
        fechaVisionado,
        puntuacion
      );

      this.showToast("¡Entrada actualizada exitosamente!", "success");

      // Cerrar modal
      const modal = bootstrap.Modal.getInstance(this.editModal);
      modal.hide();

      // Recargar datos
      this.loadDiary();
    } catch (error) {
      console.error("Error updating diary entry:", error);
      this.showToast(
        "Error al actualizar la entrada: " + error.message,
        "danger"
      );
    } finally {
      this.setSaveEditLoading(false);
    }
  }

  /**
   * Confirma eliminación de entrada
   */
  confirmDeleteEntry(entryId) {
    const entry = this.diaryData.find((e) => e.idEntradaPelicula === entryId);
    if (!entry) return;

    const movieTitle = entry.pelicula.titulo;
    if (
      confirm(
        `¿Estás seguro de que quieres eliminar "${movieTitle}" de tu diario?\n\nEsta acción no se puede deshacer.`
      )
    ) {
      this.handleDeleteEntry(entryId);
    }
  }

  /**
   * Elimina entrada del diario
   */
  async handleDeleteEntry(entryId = null) {
    const targetId =
      entryId ||
      (this.currentEditEntry ? this.currentEditEntry.idEntradaPelicula : null);
    if (!targetId) return;

    this.setDeleteLoading(true);

    try {
      await api.removeDiaryEntry(targetId);

      this.showToast("Entrada eliminada exitosamente", "success");

      // Si estamos en modal, cerrarlo
      if (this.currentEditEntry && !entryId) {
        const modal = bootstrap.Modal.getInstance(this.editModal);
        modal.hide();
      }

      // Recargar datos
      this.loadDiary();
    } catch (error) {
      console.error("Error deleting diary entry:", error);
      this.showToast(
        "Error al eliminar la entrada: " + error.message,
        "danger"
      );
    } finally {
      this.setDeleteLoading(false);
    }
  }

  /**
   * Actualiza la paginación
   */
  updatePagination() {
    // Información de paginación
    const start = this.currentPage * this.pageSize + 1;
    const end = Math.min(
      (this.currentPage + 1) * this.pageSize,
      this.totalElements
    );
    this.paginationInfo.textContent = `Mostrando ${start}-${end} de ${this.totalElements} entradas`;

    if (this.totalPages <= 1) {
      this.pagination.style.display = "none";
      return;
    }

    this.pagination.style.display = "flex";

    const maxVisiblePages = 5;
    const startPage = Math.max(
      0,
      this.currentPage - Math.floor(maxVisiblePages / 2)
    );
    const endPage = Math.min(
      this.totalPages - 1,
      startPage + maxVisiblePages - 1
    );

    let paginationHtml = "";

    // Botón anterior
    if (this.currentPage > 0) {
      paginationHtml += `
                <li class="page-item">
                    <a class="page-link" href="#" data-page="${
                      this.currentPage - 1
                    }">Anterior</a>
                </li>
            `;
    }

    // Páginas
    for (let i = startPage; i <= endPage; i++) {
      paginationHtml += `
                <li class="page-item ${i === this.currentPage ? "active" : ""}">
                    <a class="page-link" href="#" data-page="${i}">${i + 1}</a>
                </li>
            `;
    }

    // Botón siguiente
    if (this.currentPage < this.totalPages - 1) {
      paginationHtml += `
                <li class="page-item">
                    <a class="page-link" href="#" data-page="${
                      this.currentPage + 1
                    }">Siguiente</a>
                </li>
            `;
    }

    this.pagination.innerHTML = paginationHtml;

    // Event listeners para paginación
    this.pagination.addEventListener("click", (e) => {
      e.preventDefault();
      if (
        e.target.classList.contains("page-link") &&
        e.target.dataset.page !== undefined
      ) {
        this.currentPage = parseInt(e.target.dataset.page);
        this.loadDiary();
      }
    });
  }

  /**
   * Controla estados de carga
   */
  setSaveEditLoading(isLoading) {
    this.saveEditBtn.disabled = isLoading;
    this.saveEditText.style.display = isLoading ? "none" : "inline";
    this.saveEditSpinner.style.display = isLoading ? "inline-block" : "none";
  }

  setDeleteLoading(isLoading) {
    this.deleteEntryBtn.disabled = isLoading;
    this.deleteText.style.display = isLoading ? "none" : "inline";
    this.deleteSpinner.style.display = isLoading ? "inline-block" : "none";
  }

  /**
   * Estados de la página
   */
  showLoading() {
    this.loadingContainer.style.display = "block";
    this.emptyContainer.style.display = "none";
    this.errorContainer.style.display = "none";
    this.diaryContainer.style.display = "none";
  }

  showEmpty() {
    this.loadingContainer.style.display = "none";
    this.emptyContainer.style.display = "block";
    this.errorContainer.style.display = "none";
    this.diaryContainer.style.display = "none";
  }

  showError(message) {
    this.errorMessage.textContent = message;
    this.loadingContainer.style.display = "none";
    this.emptyContainer.style.display = "none";
    this.errorContainer.style.display = "block";
    this.diaryContainer.style.display = "none";
  }

  showDiary() {
    this.loadingContainer.style.display = "none";
    this.emptyContainer.style.display = "none";
    this.errorContainer.style.display = "none";
    this.diaryContainer.style.display = "block";
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Genera display visual de estrellas
   */
  generateStarsDisplay(rating) {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;

    let starsHtml = "";
    for (let i = 0; i < fullStars; i++) {
      starsHtml += "⭐";
    }
    for (let i = 0; i < emptyStars; i++) {
      starsHtml += "☆";
    }

    return starsHtml;
  }

  /**
   * Obtiene URL de imagen de TMDB
   */
  getTmdbImageUrl(posterPath) {
    if (!posterPath || posterPath === "null") {
      return "https://via.placeholder.com/60x90/cccccc/666666?text=Sin+Imagen";
    }

    if (posterPath.startsWith("http")) {
      return posterPath;
    }

    return `https://image.tmdb.org/t/p/w200${posterPath}`;
  }

  /**
   * Formatea fecha para mostrar
   */
  formatDate(dateString) {
    if (!dateString) return { day: "N/A", monthYear: "" };

    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, "0");
      const month = date.toLocaleDateString("es-ES", { month: "short" });
      const year = date.getFullYear();

      return {
        day: `${day} ${month}`,
        monthYear: year.toString(),
      };
    } catch (error) {
      return { day: dateString, monthYear: "" };
    }
  }

  /**
   * Muestra notificación toast
   */
  showToast(message, type = "info") {
    const toastId = "toast-" + Date.now();
    const bgClass =
      {
        success: "bg-success",
        danger: "bg-danger",
        warning: "bg-warning",
        info: "bg-info",
      }[type] || "bg-info";

    const toastHtml = `
            <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header ${bgClass} text-white">
                    <strong class="me-auto">FilmDiary</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        `;

    this.toastContainer.insertAdjacentHTML("beforeend", toastHtml);

    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement);
    toast.show();

    toastElement.addEventListener("hidden.bs.toast", () => {
      toastElement.remove();
    });
  }
}

// Variable global para acceso desde botones inline
let diaryManager;

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  diaryManager = new DiaryManager();
});
