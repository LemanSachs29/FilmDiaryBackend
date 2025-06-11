/**
 * Maneja toda la lógica de la watchlist (películas por ver)
 */
class WatchlistManager {
    constructor() {
        this.currentPage = 0;
        this.pageSize = 12; // Más elementos para grid view
        this.totalPages = 0;
        this.totalElements = 0;
        this.watchlistData = [];
        this.currentMoveItem = null;
        this.currentRating = 0;
        this.isGridView = true;
        
        // Filtros
        this.sortOrder = 'date-desc';
        
        this.initializeElements();
        this.checkAuthentication();
        this.attachEventListeners();
        this.loadWatchlist();
    }

    /**
     * Inicializa referencias a elementos del DOM
     */
    initializeElements() {
        // Containers
        this.loadingContainer = document.getElementById('loading-container');
        this.emptyContainer = document.getElementById('empty-container');
        this.errorContainer = document.getElementById('error-container');
        this.watchlistContainer = document.getElementById('watchlist-container');
        
        // Views
        this.watchlistGrid = document.getElementById('watchlist-grid');
        this.watchlistList = document.getElementById('watchlist-list');
        this.watchlistTableBody = document.getElementById('watchlist-table-body');
        
        // View controls
        this.gridViewBtn = document.getElementById('grid-view');
        this.listViewBtn = document.getElementById('list-view');
        this.sortFilter = document.getElementById('sort-filter');
        
        // Pagination
        this.paginationInfo = document.getElementById('pagination-info');
        this.pagination = document.getElementById('pagination');
        
        // Stats
        this.totalMovies = document.getElementById('total-movies');
        this.recentCount = document.getElementById('recent-count');
        
        // Modal elements
        this.moveModal = document.getElementById('moveTodiaryModal');
        this.moveForm = document.getElementById('move-form');
        this.moveMoviePoster = document.getElementById('move-movie-poster');
        this.moveMovieTitle = document.getElementById('move-movie-title');
        this.moveMovieYear = document.getElementById('move-movie-year');
        this.moveFechaVisionado = document.getElementById('move-fecha-visionado');
        this.movePuntuacionInput = document.getElementById('move-puntuacion');
        this.moveRatingText = document.getElementById('move-rating-text');
        this.confirmMoveBtn = document.getElementById('confirm-move-btn');
        this.confirmMoveText = document.getElementById('confirm-move-text');
        this.confirmMoveSpinner = document.getElementById('confirm-move-spinner');
        
        // Star rating in modal
        this.moveStarButtons = document.querySelectorAll('#moveTodiaryModal .star-btn');
        this.moveStarContainer = document.querySelector('#moveTodiaryModal .star-buttons');
        
        // Others
        this.logoutBtn = document.getElementById('logout-btn');
        this.errorMessage = document.getElementById('error-message');
        this.toastContainer = document.getElementById('toast-container');
        
        // Set max date to today
        this.moveFechaVisionado.max = new Date().toISOString().split('T')[0];
        this.moveFechaVisionado.value = new Date().toISOString().split('T')[0];
    }

    /**
     * Verifica autenticación
     */
    checkAuthentication() {
        if (!api.isAuthenticated()) {
            alert('Debes iniciar sesión para ver tu lista');
            window.location.href = 'index.html';
            return;
        }
    }

    /**
     * Adjunta event listeners
     */
    attachEventListeners() {
        this.logoutBtn.addEventListener('click', () => this.handleLogout());
        
        // View toggles
        this.gridViewBtn.addEventListener('change', () => this.handleViewChange());
        this.listViewBtn.addEventListener('change', () => this.handleViewChange());
        
        // Sort filter
        this.sortFilter.addEventListener('change', () => this.handleSortChange());
        
        // Modal
        this.confirmMoveBtn.addEventListener('click', () => this.handleMoveToDiary());
        
        // Star rating in modal
        this.moveStarButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleMoveStarRating(e));
        });
        this.moveStarContainer.addEventListener('dblclick', () => this.resetMoveRating());
    }

    /**
     * Maneja logout
     */
    handleLogout() {
        if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
            api.logout();
            window.location.href = 'index.html';
        }
    }

    /**
     * Maneja cambio de vista (grid/list)
     */
    handleViewChange() {
        this.isGridView = this.gridViewBtn.checked;
        
        if (this.isGridView) {
            this.watchlistGrid.style.display = 'flex';
            this.watchlistList.style.display = 'none';
        } else {
            this.watchlistGrid.style.display = 'none';
            this.watchlistList.style.display = 'block';
        }
        
        this.displayWatchlist();
    }

    /**
     * Maneja cambio de ordenamiento
     */
    handleSortChange() {
        this.sortOrder = this.sortFilter.value;
        this.currentPage = 0; // Reset to first page
        this.loadWatchlist();
    }

    /**
     * Carga la watchlist
     */
    async loadWatchlist() {
        this.showLoading();
        
        try {
            const response = await api.getWatchlist(this.currentPage, this.pageSize);
            
            if (response && response.content) {
                this.watchlistData = response.content;
                this.totalPages = response.totalPages;
                this.totalElements = response.totalElements;
                
                if (this.watchlistData.length === 0 && this.currentPage === 0) {
                    this.showEmpty();
                } else {
                    this.displayWatchlist();
                    this.updatePagination();
                    this.calculateStats();
                    this.showWatchlist();
                }
            } else {
                this.showEmpty();
            }
            
        } catch (error) {
            console.error('Error loading watchlist:', error);
            this.showError('No se pudo cargar tu lista: ' + error.message);
        }
    }

    /**
     * Muestra la watchlist en la vista seleccionada
     */
    displayWatchlist() {
        // Aplicar ordenamiento local
        const sortedData = this.applySorting([...this.watchlistData]);
        
        if (this.isGridView) {
            this.displayGridView(sortedData);
        } else {
            this.displayListView(sortedData);
        }
    }

    /**
     * Aplica ordenamiento local
     */
    applySorting(data) {
        return data.sort((a, b) => {
            switch (this.sortOrder) {
                case 'date-desc':
                    return new Date(b.fechaAgregado) - new Date(a.fechaAgregado);
                case 'date-asc':
                    return new Date(a.fechaAgregado) - new Date(b.fechaAgregado);
                case 'title-asc':
                    return a.pelicula.titulo.localeCompare(b.pelicula.titulo);
                case 'title-desc':
                    return b.pelicula.titulo.localeCompare(a.pelicula.titulo);
                case 'release-desc':
                    return new Date(b.pelicula.releaseDate) - new Date(a.pelicula.releaseDate);
                case 'release-asc':
                    return new Date(a.pelicula.releaseDate) - new Date(b.pelicula.releaseDate);
                default:
                    return 0;
            }
        });
    }

    /**
     * Muestra vista de grid (cards)
     */
    displayGridView(data) {
        const gridHtml = data.map(item => {
            const movie = item.pelicula;
            const posterUrl = this.getTmdbImageUrl(movie.posterUrl);
            const releaseYear = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'N/A';
            const addedDate = this.formatDate(item.fechaAgregado);
            
            return `
                <div class="col-lg-2 col-md-3 col-sm-4 col-6 mb-4">
                    <div class="card h-100 movie-card shadow-sm">
                        <img src="${posterUrl}" 
                             class="card-img-top movie-poster" 
                             alt="${movie.titulo}"
                             style="height: 280px; object-fit: cover;">
                        <div class="card-body d-flex flex-column p-2">
                            <h6 class="card-title mb-1" title="${movie.titulo}">
                                <a href="movie-detail.html?id=${movie.idTmdb}" 
                                   class="text-decoration-none text-dark">
                                    ${this.truncateText(movie.titulo, 25)}
                                </a>
                            </h6>
                            <div class="card-text small text-muted mb-2">
                                <div><strong>Año:</strong> ${releaseYear}</div>
                                <div><strong>Añadida:</strong> ${addedDate}</div>
                            </div>
                            <div class="mt-auto">
                                <div class="d-grid gap-1">
                                    <button class="btn btn-success btn-sm" 
                                            onclick="watchlistManager.showMoveToDiaryModal(${movie.id})"
                                            title="Marcar como vista">
                                        ✓ Ya la vi
                                    </button>
                                    <button class="btn btn-outline-danger btn-sm" 
                                            onclick="watchlistManager.confirmRemoveFromWatchlist(${movie.id}, '${movie.titulo.replace(/'/g, "\\'")}')"
                                            title="Eliminar de la lista">
                                        🗑️ Quitar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        this.watchlistGrid.innerHTML = gridHtml;
    }

    /**
     * Muestra vista de lista (tabla)
     */
    displayListView(data) {
        const tableHtml = data.map(item => {
            const movie = item.pelicula;
            const posterUrl = this.getTmdbImageUrl(movie.posterUrl);
            const releaseDate = this.formatDate(movie.releaseDate);
            const addedDate = this.formatDate(item.fechaAgregado);
            const releaseYear = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'N/A';
            
            return `
                <tr>
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
                                   class="text-decoration-none">
                                    ${movie.titulo}
                                </a>
                            </div>
                            <small class="text-muted">${releaseYear}</small>
                        </div>
                    </td>
                    <td>${releaseDate}</td>
                    <td>${addedDate}</td>
                    <td class="text-center">
                        <div class="btn-group btn-group-sm" role="group">
                            <button type="button" 
                                    class="btn btn-success" 
                                    onclick="watchlistManager.showMoveToDiaryModal(${movie.id})"
                                    title="Marcar como vista">
                                ✓ Ya la vi
                            </button>
                            <button type="button" 
                                    class="btn btn-outline-danger" 
                                    onclick="watchlistManager.confirmRemoveFromWatchlist(${movie.id}, '${movie.titulo.replace(/'/g, "\\'")}')"
                                    title="Eliminar de la lista">
                                🗑️
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
        
        this.watchlistTableBody.innerHTML = tableHtml;
    }

    /**
     * Calcula estadísticas
     */
    calculateStats() {
        this.totalMovies.textContent = this.totalElements.toLocaleString();
        
        // Películas añadidas en los últimos 7 días
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const recentMovies = this.watchlistData.filter(item => 
            new Date(item.fechaAgregado) > oneWeekAgo
        );
        
        this.recentCount.textContent = recentMovies.length.toString();
    }

    /**
     * Muestra modal para mover al diario
     */
    showMoveToDiaryModal(movieId) {
        const item = this.watchlistData.find(item => item.pelicula.id === movieId);
        if (!item) {
            this.showToast('No se encontró la película en la lista', 'danger');
            return;
        }
        
        this.currentMoveItem = item;
        const movie = item.pelicula;
        
        // Llenar información de la película
        this.moveMoviePoster.src = this.getTmdbImageUrl(movie.posterUrl);
        this.moveMovieTitle.textContent = movie.titulo;
        this.moveMovieYear.textContent = movie.releaseDate ? 
            `(${new Date(movie.releaseDate).getFullYear()})` : '';
        
        // Reset form
        this.moveFechaVisionado.value = new Date().toISOString().split('T')[0];
        this.resetMoveRating();
        
        // Show modal
        const modal = new bootstrap.Modal(this.moveModal);
        modal.show();
    }

    /**
     * Maneja mover película al diario
     */
    async handleMoveToDiary() {
        if (!this.currentMoveItem) return;
        
        const fechaVisionado = this.moveFechaVisionado.value;
        const puntuacion = this.currentRating;
        
        if (!fechaVisionado) {
            this.showToast('Por favor, selecciona una fecha', 'warning');
            return;
        }
        
        this.setConfirmMoveLoading(true);
        
        try {
            // Añadir al diario
            await api.addToDiary(
                this.currentMoveItem.pelicula.idTmdb,
                puntuacion || null,
                fechaVisionado
            );
            
            // Eliminar de watchlist
            await api.removeFromWatchlist(this.currentMoveItem.pelicula.id);
            
            this.showToast(`¡"${this.currentMoveItem.pelicula.titulo}" añadida al diario!`, 'success');
            
            // Cerrar modal
            const modal = bootstrap.Modal.getInstance(this.moveModal);
            modal.hide();
            
            // Recargar lista
            this.loadWatchlist();
            
        } catch (error) {
            console.error('Error moving to diary:', error);
            this.showToast('Error al mover al diario: ' + error.message, 'danger');
        } finally {
            this.setConfirmMoveLoading(false);
        }
    }

    /**
     * Confirma eliminación de película de la watchlist
     */
    confirmRemoveFromWatchlist(movieId, movieTitle) {
        if (confirm(`¿Estás seguro de que quieres quitar "${movieTitle}" de tu lista?\n\nPodrás añadirla de nuevo cuando quieras.`)) {
            this.handleRemoveFromWatchlist(movieId);
        }
    }

    /**
     * Elimina película de la watchlist
     */
    async handleRemoveFromWatchlist(movieId) {
        try {
            await api.removeFromWatchlist(movieId);
            this.showToast('Película eliminada de tu lista', 'success');
            this.loadWatchlist(); // Recargar
        } catch (error) {
            console.error('Error removing from watchlist:', error);
            this.showToast('Error al eliminar de la lista: ' + error.message, 'danger');
        }
    }

    /**
     * Star rating en modal
     */
    handleMoveStarRating(event) {
        const value = parseInt(event.target.dataset.value);
        this.setMoveRating(value);
    }

    /**
     * Establece rating en modal
     */
    setMoveRating(rating) {
        this.currentRating = rating;
        this.movePuntuacionInput.value = rating;
        
        // Actualizar estrellas
        this.moveStarButtons.forEach((btn, index) => {
            if (index < rating) {
                btn.classList.remove('btn-outline-warning');
                btn.classList.add('btn-warning');
            } else {
                btn.classList.remove('btn-warning');
                btn.classList.add('btn-outline-warning');
            }
        });
    }

    /**
     * Resetea rating en modal
     */
    resetMoveRating() {
        this.setMoveRating(0);
    }

    /**
     * Actualiza paginación
     */
    updatePagination() {
        // Información de paginación
        const start = this.currentPage * this.pageSize + 1;
        const end = Math.min((this.currentPage + 1) * this.pageSize, this.totalElements);
        this.paginationInfo.textContent = `Mostrando ${start}-${end} de ${this.totalElements} películas`;
        
        if (this.totalPages <= 1) {
            this.pagination.style.display = 'none';
            return;
        }
        
        this.pagination.style.display = 'flex';
        
        const maxVisiblePages = 5;
        const startPage = Math.max(0, this.currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(this.totalPages - 1, startPage + maxVisiblePages - 1);
        
        let paginationHtml = '';
        
        // Botón anterior
        if (this.currentPage > 0) {
            paginationHtml += `
                <li class="page-item">
                    <a class="page-link" href="#" data-page="${this.currentPage - 1}">Anterior</a>
                </li>
            `;
        }
        
        // Páginas
        for (let i = startPage; i <= endPage; i++) {
            paginationHtml += `
                <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i + 1}</a>
                </li>
            `;
        }
        
        // Botón siguiente
        if (this.currentPage < this.totalPages - 1) {
            paginationHtml += `
                <li class="page-item">
                    <a class="page-link" href="#" data-page="${this.currentPage + 1}">Siguiente</a>
                </li>
            `;
        }
        
        this.pagination.innerHTML = paginationHtml;
        
        // Event listeners para paginación
        this.pagination.addEventListener('click', (e) => {
            e.preventDefault();
            if (e.target.classList.contains('page-link') && e.target.dataset.page !== undefined) {
                this.currentPage = parseInt(e.target.dataset.page);
                this.loadWatchlist();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    /**
     * Control de loading en botón de confirmación
     */
    setConfirmMoveLoading(isLoading) {
        this.confirmMoveBtn.disabled = isLoading;
        this.confirmMoveText.style.display = isLoading ? 'none' : 'inline';
        this.confirmMoveSpinner.style.display = isLoading ? 'inline-block' : 'none';
    }

    /**
     * Estados de la página
     */
    showLoading() {
        this.loadingContainer.style.display = 'block';
        this.emptyContainer.style.display = 'none';
        this.errorContainer.style.display = 'none';
        this.watchlistContainer.style.display = 'none';
    }

    showEmpty() {
        this.loadingContainer.style.display = 'none';
        this.emptyContainer.style.display = 'block';
        this.errorContainer.style.display = 'none';
        this.watchlistContainer.style.display = 'none';
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.loadingContainer.style.display = 'none';
        this.emptyContainer.style.display = 'none';
        this.errorContainer.style.display = 'block';
        this.watchlistContainer.style.display = 'none';
    }

    showWatchlist() {
        this.loadingContainer.style.display = 'none';
        this.emptyContainer.style.display = 'none';
        this.errorContainer.style.display = 'none';
        this.watchlistContainer.style.display = 'block';
    }

    // ==================== UTILITY METHODS ====================

    /**
     * Obtiene URL de imagen de TMDB
     */
    getTmdbImageUrl(posterPath) {
        if (!posterPath || posterPath === 'null') {
            return 'https://via.placeholder.com/300x450/cccccc/666666?text=Sin+Imagen';
        }
        
        if (posterPath.startsWith('http')) {
            return posterPath;
        }
        
        return `https://image.tmdb.org/t/p/w300${posterPath}`;
    }

    /**
     * Formatea fecha para mostrar
     */
    formatDate(dateString) {
        if (!dateString) return 'N/A';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    }

    /**
     * Trunca texto
     */
    truncateText(text, maxLength) {
        if (!text) return '';
        
        if (text.length <= maxLength) {
            return text;
        }
        
        return text.substring(0, maxLength) + '...';
    }

    /**
     * Muestra notificación toast
     */
    showToast(message, type = 'info') {
        const toastId = 'toast-' + Date.now();
        const bgClass = {
            'success': 'bg-success',
            'danger': 'bg-danger',
            'warning': 'bg-warning',
            'info': 'bg-info'
        }[type] || 'bg-info';
        
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
        
        this.toastContainer.insertAdjacentHTML('beforeend', toastHtml);
        
        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
        
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }
}

// Variable global para acceso desde botones inline
let watchlistManager;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    watchlistManager = new WatchlistManager();
});