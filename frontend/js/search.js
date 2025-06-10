/**
 * Maneja toda la lógica de búsqueda de películas
 */
class SearchManager {
    constructor() {
        this.currentPage = 1;
        this.currentQuery = '';
        this.totalPages = 0;
        this.totalResults = 0;
        
        this.initializeElements();
        this.checkAuthentication();
        this.attachEventListeners();
    }

    /**
     * Inicializa referencias a elementos del DOM
     */
    initializeElements() {
        this.searchForm = document.getElementById('search-form');
        this.searchQuery = document.getElementById('search-query');
        this.searchBtn = document.getElementById('search-btn');
        this.searchText = document.getElementById('search-text');
        this.searchSpinner = document.getElementById('search-spinner');
        this.logoutBtn = document.getElementById('logout-btn');
        
        // Contenedores de contenido
        this.searchResults = document.getElementById('search-results');
        this.emptyState = document.getElementById('empty-state');
        this.noResults = document.getElementById('no-results');
        this.resultsInfo = document.getElementById('results-info');
        this.loadingOverlay = document.getElementById('loading-overlay');
        
        // Información de resultados
        this.searchTerm = document.getElementById('search-term');
        this.resultsCount = document.getElementById('results-count');
        
        // Paginación
        this.paginationContainer = document.getElementById('pagination-container');
        this.pagination = document.getElementById('pagination');
    }

    /**
     * Verifica autenticación
     */
    checkAuthentication() {
        if (!api.isAuthenticated()) {
            alert('Debes iniciar sesión para buscar películas');
            window.location.href = 'index.html';
            return;
        }
    }

    /**
     * Adjunta event listeners
     */
    attachEventListeners() {
        this.searchForm.addEventListener('submit', (e) => this.handleSearch(e));
        this.logoutBtn.addEventListener('click', () => this.handleLogout());
        
        // Buscar al escribir (con delay)
        let searchTimeout;
        this.searchQuery.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            
            if (query.length >= 3) {
                searchTimeout = setTimeout(() => {
                    this.performSearch(query, 1);
                }, 800); // Esperar 800ms después de que pare de escribir
            } else if (query.length === 0) {
                this.showEmptyState();
            }
        });
    }

    /**
     * Maneja el logout
     */
    handleLogout() {
        if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
            api.logout();
            window.location.href = 'index.html';
        }
    }

    /**
     * Maneja el envío del formulario de búsqueda
     */
    async handleSearch(e) {
        e.preventDefault();
        const query = this.searchQuery.value.trim();
        
        if (!query) {
            alert('Por favor, escribe algo para buscar');
            return;
        }

        await this.performSearch(query, 1);
    }

    /**
     * Realiza la búsqueda de películas
     */
    async performSearch(query, page = 1) {
        this.currentQuery = query;
        this.currentPage = page;
        
        this.setSearchLoading(true);
        this.hideAllStates();
        
        try {
            const response = await api.searchMovies(query, page, false);
            
            if (response && response.results && response.results.length > 0) {
                this.totalPages = response.totalPages;
                this.totalResults = response.totalResults;
                
                this.displayResults(response.results);
                this.updateResultsInfo();
                this.updatePagination();
            } else {
                this.showNoResults();
            }
            
        } catch (error) {
            console.error('Error searching movies:', error);
            this.showError('Error al buscar películas. Inténtalo de nuevo.');
            this.showEmptyState();
        } finally {
            this.setSearchLoading(false);
        }
    }

    /**
     * Muestra los resultados de búsqueda
     */
    displayResults(movies) {
        const moviesHtml = movies.map(movie => {
            const posterUrl = this.getTmdbImageUrl(movie.posterPath);
            const releaseYear = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'Sin fecha';
            const rating = movie.voteAverage ? movie.voteAverage.toFixed(1) : 'Sin rating';
            
            return `
                <div class="col-lg-3 col-md-4 col-sm-6 col-6 mb-4">
                    <div class="card h-100 movie-card shadow-sm">
                        <img src="${posterUrl}" 
                             class="card-img-top movie-poster" 
                             alt="${movie.title}"
                             style="height: 350px; object-fit: cover;">
                        <div class="card-body d-flex flex-column">
                            <h6 class="card-title" title="${movie.title}">
                                ${this.truncateText(movie.title, 50)}
                            </h6>
                            <div class="card-text small text-muted mb-2">
                                <div class="d-flex justify-content-between">
                                    <span><strong>Año:</strong> ${releaseYear}</span>
                                    <span><strong>⭐:</strong> ${rating}</span>
                                </div>
                            </div>
                            <div class="mt-auto">
                                <a href="movie-detail.html?id=${movie.id}" 
                                   class="btn btn-primary btn-sm w-100">
                                    Ver Detalles
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        this.searchResults.innerHTML = moviesHtml;
        this.searchResults.style.display = 'flex';
    }

    /**
     * Actualiza la información de resultados
     */
    updateResultsInfo() {
        this.searchTerm.textContent = this.currentQuery;
        this.resultsCount.textContent = this.totalResults.toLocaleString();
        this.resultsInfo.style.display = 'block';
    }

    /**
     * Actualiza la paginación
     */
    updatePagination() {
        if (this.totalPages <= 1) {
            this.paginationContainer.style.display = 'none';
            return;
        }

        const maxVisiblePages = 5;
        const startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
        
        let paginationHtml = '';
        
        // Botón anterior
        if (this.currentPage > 1) {
            paginationHtml += `
                <li class="page-item">
                    <a class="page-link" href="#" data-page="${this.currentPage - 1}">Anterior</a>
                </li>
            `;
        }
        
        // Primera página si no está visible
        if (startPage > 1) {
            paginationHtml += `
                <li class="page-item">
                    <a class="page-link" href="#" data-page="1">1</a>
                </li>
            `;
            if (startPage > 2) {
                paginationHtml += '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
        }
        
        // Páginas visibles
        for (let i = startPage; i <= endPage; i++) {
            paginationHtml += `
                <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }
        
        // Última página si no está visible
        if (endPage < this.totalPages) {
            if (endPage < this.totalPages - 1) {
                paginationHtml += '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
            paginationHtml += `
                <li class="page-item">
                    <a class="page-link" href="#" data-page="${this.totalPages}">${this.totalPages}</a>
                </li>
            `;
        }
        
        // Botón siguiente
        if (this.currentPage < this.totalPages) {
            paginationHtml += `
                <li class="page-item">
                    <a class="page-link" href="#" data-page="${this.currentPage + 1}">Siguiente</a>
                </li>
            `;
        }
        
        this.pagination.innerHTML = paginationHtml;
        this.paginationContainer.style.display = 'block';
        
        // Añadir event listeners a los enlaces de paginación
        this.pagination.addEventListener('click', (e) => {
            e.preventDefault();
            if (e.target.classList.contains('page-link') && e.target.dataset.page) {
                const page = parseInt(e.target.dataset.page);
                this.performSearch(this.currentQuery, page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    /**
     * Muestra el estado vacío (sin búsqueda)
     */
    showEmptyState() {
        this.hideAllStates();
        this.emptyState.style.display = 'block';
    }

    /**
     * Muestra el estado sin resultados
     */
    showNoResults() {
        this.hideAllStates();
        this.noResults.style.display = 'block';
    }

    /**
     * Oculta todos los estados
     */
    hideAllStates() {
        this.searchResults.style.display = 'none';
        this.emptyState.style.display = 'none';
        this.noResults.style.display = 'none';
        this.resultsInfo.style.display = 'none';
        this.paginationContainer.style.display = 'none';
    }

    /**
     * Controla el estado de carga del botón de búsqueda
     */
    setSearchLoading(isLoading) {
        if (isLoading) {
            this.searchBtn.disabled = true;
            this.searchText.style.display = 'none';
            this.searchSpinner.style.display = 'inline-block';
            this.loadingOverlay.style.display = 'block';
        } else {
            this.searchBtn.disabled = false;
            this.searchText.style.display = 'inline';
            this.searchSpinner.style.display = 'none';
            this.loadingOverlay.style.display = 'none';
        }
    }

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
     * Trunca texto a cierta longitud
     */
    truncateText(text, maxLength) {
        if (!text) return '';
        
        if (text.length <= maxLength) {
            return text;
        }
        
        return text.substring(0, maxLength) + '...';
    }

    /**
     * Muestra un error al usuario
     */
    showError(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger alert-dismissible fade show position-fixed';
        alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new SearchManager();
});