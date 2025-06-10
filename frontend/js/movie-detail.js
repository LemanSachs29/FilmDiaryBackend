/**
 * Maneja toda la lógica de la página de detalles de película
 */
class MovieDetailManager {
    constructor() {
        this.movieId = null;
        this.movieData = null;
        this.currentRating = 0;
        
        this.initializeElements();
        this.checkAuthentication();
        this.attachEventListeners();
        this.getMovieIdFromURL();
        this.loadMovieDetails();
    }

    /**
     * Inicializa referencias a elementos del DOM
     */
    initializeElements() {
        // Containers
        this.loadingContainer = document.getElementById('loading-container');
        this.errorContainer = document.getElementById('error-container');
        this.movieContainer = document.getElementById('movie-container');
        
        // Movie info elements
        this.moviePoster = document.getElementById('movie-poster');
        this.movieTitle = document.getElementById('movie-title');
        this.movieOriginalTitle = document.getElementById('movie-original-title');
        this.movieReleaseDate = document.getElementById('movie-release-date');
        this.movieRuntime = document.getElementById('movie-runtime');
        this.movieRating = document.getElementById('movie-rating');
        this.movieGenres = document.getElementById('movie-genres');
        this.movieStatus = document.getElementById('movie-status');
        this.movieOverview = document.getElementById('movie-overview');
        this.movieLanguage = document.getElementById('movie-language');
        this.movieBudget = document.getElementById('movie-budget');
        this.movieRevenue = document.getElementById('movie-revenue');
        this.movieVoteAverage = document.getElementById('movie-vote-average');
        this.movieVoteCount = document.getElementById('movie-vote-count');
        this.moviePopularity = document.getElementById('movie-popularity');
        
        // Action buttons
        this.addToDiaryBtn = document.getElementById('add-to-diary-btn');
        this.addToWatchlistBtn = document.getElementById('add-to-watchlist-btn');
        this.diaryStatus = document.getElementById('diary-status');
        this.watchlistStatus = document.getElementById('watchlist-status');
        
        // Modal elements
        this.diaryModal = document.getElementById('diaryModal');
        this.diaryForm = document.getElementById('diary-form');
        this.fechaVisionado = document.getElementById('fecha-visionado');
        this.puntuacionInput = document.getElementById('puntuacion');
        this.saveDiaryBtn = document.getElementById('save-diary-btn');
        this.saveDiaryText = document.getElementById('save-diary-text');
        this.saveDiarySpinner = document.getElementById('save-diary-spinner');
        this.ratingText = document.getElementById('rating-text');
        
        // Star rating
        this.starButtons = document.querySelectorAll('.star-btn');
        this.starContainer = document.querySelector('.star-buttons');
        
        // Other
        this.logoutBtn = document.getElementById('logout-btn');
        this.errorMessage = document.getElementById('error-message');
        this.toastContainer = document.getElementById('toast-container');
        
        // Set max date to today for date input
        this.fechaVisionado.max = new Date().toISOString().split('T')[0];
        this.fechaVisionado.value = new Date().toISOString().split('T')[0];
    }

    /**
     * Verifica autenticación
     */
    checkAuthentication() {
        if (!api.isAuthenticated()) {
            alert('Debes iniciar sesión para ver detalles de películas');
            window.location.href = 'index.html';
            return;
        }
    }

    /**
     * Adjunta event listeners
     */
    attachEventListeners() {
        this.logoutBtn.addEventListener('click', () => this.handleLogout());
        this.addToDiaryBtn.addEventListener('click', () => this.showDiaryModal());
        this.addToWatchlistBtn.addEventListener('click', () => this.handleAddToWatchlist());
        this.saveDiaryBtn.addEventListener('click', () => this.handleSaveToDiary());
        
        // Star rating functionality
        this.starButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleStarRating(e));
        });
        
        // Reset rating functionality
        this.starContainer.addEventListener('dblclick', () => this.resetRating());
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
     * Obtiene el ID de la película de la URL
     */
    getMovieIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        this.movieId = urlParams.get('id');
        
        if (!this.movieId) {
            this.showError('No se especificó qué película mostrar');
            return;
        }
    }

    /**
     * Carga los detalles de la película
     */
    async loadMovieDetails() {
        if (!this.movieId) return;
        
        this.showLoading();
        
        try {
            // Cargar detalles y verificar estados en paralelo
            const [movieDetails] = await Promise.all([
                api.getMovieDetails(this.movieId),
                this.checkMovieStatuses()
            ]);
            
            this.movieData = movieDetails;
            this.displayMovieDetails();
            this.showMovie();
            
        } catch (error) {
            console.error('Error loading movie details:', error);
            this.showError('No se pudo cargar la información de esta película: ' + error.message);
        }
    }

    /**
     * Verifica si la película está en diario/watchlist
     */
    async checkMovieStatuses() {
        try {
            // Obtener el ID local de la película si existe
            // Esto es un poco complejo porque necesitamos el ID local, no el de TMDB
            // Por ahora, simplemente ocultamos los botones hasta implementar esta funcionalidad
            
            // TODO: Implementar verificación de estado cuando tengamos endpoint para esto
            // const isInDiary = await api.isInDiary(localMovieId);
            // const isInWatchlist = await api.isInWatchlist(localMovieId);
            
        } catch (error) {
            console.error('Error checking movie statuses:', error);
        }
    }

    /**
     * Muestra los detalles de la película en la interfaz
     */
    displayMovieDetails() {
        const movie = this.movieData;
        
        // Poster
        this.moviePoster.src = this.getTmdbImageUrl(movie.posterPath);
        this.moviePoster.alt = movie.title;
        
        // Títulos
        this.movieTitle.textContent = movie.title;
        this.movieOriginalTitle.textContent = movie.originalTitle !== movie.title ? 
            `(${movie.originalTitle})` : '';
        
        // Información básica
        this.movieReleaseDate.textContent = this.formatDate(movie.releaseDate);
        this.movieRuntime.textContent = this.formatRuntime(movie.runtime);
        this.movieRating.textContent = movie.voteAverage ? 
            `${movie.voteAverage.toFixed(1)}/10` : 'Sin calificar';
        this.movieStatus.textContent = this.translateStatus(movie.status);
        
        // Géneros
        this.displayGenres(movie.genres);
        
        // Sinopsis
        this.movieOverview.textContent = movie.overview || 'Sin sinopsis disponible.';
        
        // Información adicional
        this.movieLanguage.textContent = this.getLanguageName(movie.originalLanguage);
        this.movieBudget.textContent = this.formatMoney(movie.budget);
        this.movieRevenue.textContent = this.formatMoney(movie.revenue);
        this.movieVoteAverage.textContent = movie.voteAverage ? movie.voteAverage.toFixed(1) : '-';
        this.movieVoteCount.textContent = movie.voteCount ? movie.voteCount.toLocaleString() : '-';
        this.moviePopularity.textContent = movie.popularity ? movie.popularity.toFixed(1) : '-';
        
        // Actualizar título de la página
        document.title = `${movie.title} - FilmDiary`;
    }

    /**
     * Muestra los géneros de la película
     */
    displayGenres(genres) {
        if (!genres || genres.length === 0) {
            this.movieGenres.innerHTML = '<span class="text-muted">Sin géneros</span>';
            return;
        }
        
        const genreHtml = genres.map(genre => 
            `<span class="badge bg-secondary me-1">${genre.name}</span>`
        ).join('');
        
        this.movieGenres.innerHTML = genreHtml;
    }

    /**
     * Muestra el modal para añadir al diario
     */
    showDiaryModal() {
        // Reset form
        this.resetRating();
        this.fechaVisionado.value = new Date().toISOString().split('T')[0];
    }

    /**
     * Maneja añadir película al diario
     */
    async handleSaveToDiary() {
        const fechaVisionado = this.fechaVisionado.value;
        const puntuacion = this.currentRating;
        
        if (!fechaVisionado) {
            this.showToast('Por favor, selecciona una fecha', 'warning');
            return;
        }
        
        this.setSaveLoading(true);
        
        try {
            await api.addToDiary(this.movieId, puntuacion || null, fechaVisionado);
            
            this.showToast('¡Película añadida al diario exitosamente!', 'success');
            
            // Cerrar modal
            const modal = bootstrap.Modal.getInstance(this.diaryModal);
            modal.hide();
            
            // Actualizar estado de botones
            this.updateDiaryButton(true);
            
        } catch (error) {
            console.error('Error adding to diary:', error);
            this.showToast('Error al añadir al diario: ' + error.message, 'danger');
        } finally {
            this.setSaveLoading(false);
        }
    }

    /**
     * Maneja añadir película a watchlist
     */
    async handleAddToWatchlist() {
        const originalText = this.addToWatchlistBtn.textContent;
        this.addToWatchlistBtn.disabled = true;
        this.addToWatchlistBtn.textContent = 'Añadiendo...';
        
        try {
            await api.addToWatchlist(this.movieId);
            
            this.showToast('¡Película añadida a tu lista exitosamente!', 'success');
            this.updateWatchlistButton(true);
            
        } catch (error) {
            console.error('Error adding to watchlist:', error);
            this.showToast('Error al añadir a la lista: ' + error.message, 'danger');
            
            this.addToWatchlistBtn.disabled = false;
            this.addToWatchlistBtn.textContent = originalText;
        }
    }

    /**
     * Maneja el sistema de rating con estrellas
     */
    handleStarRating(event) {
        const value = parseInt(event.target.dataset.value);
        this.currentRating = value;
        this.puntuacionInput.value = value;
        
        // Actualizar visualización de estrellas
        this.starButtons.forEach((btn, index) => {
            if (index < value) {
                btn.classList.remove('btn-outline-warning');
                btn.classList.add('btn-warning');
            } else {
                btn.classList.remove('btn-warning');
                btn.classList.add('btn-outline-warning');
            }
        });
        
        // Actualizar texto
        const ratingTexts = {
            1: '⭐ Muy mala',
            2: '⭐⭐ Mala',
            3: '⭐⭐⭐ Regular',
            4: '⭐⭐⭐⭐ Buena',
            5: '⭐⭐⭐⭐⭐ Excelente'
        };
        
        this.ratingText.textContent = ratingTexts[value] || 'Sin puntuación';
    }

    /**
     * Resetea el rating (doble click)
     */
    resetRating() {
        this.currentRating = 0;
        this.puntuacionInput.value = 0;
        
        this.starButtons.forEach(btn => {
            btn.classList.remove('btn-warning');
            btn.classList.add('btn-outline-warning');
        });
        
        this.ratingText.textContent = 'Sin puntuación';
    }

    /**
     * Actualiza el estado del botón de diario
     */
    updateDiaryButton(isInDiary) {
        if (isInDiary) {
            this.addToDiaryBtn.style.display = 'none';
            this.diaryStatus.classList.remove('d-none');
        } else {
            this.addToDiaryBtn.style.display = 'inline-block';
            this.diaryStatus.classList.add('d-none');
        }
    }

    /**
     * Actualiza el estado del botón de watchlist
     */
    updateWatchlistButton(isInWatchlist) {
        if (isInWatchlist) {
            this.addToWatchlistBtn.style.display = 'none';
            this.watchlistStatus.classList.remove('d-none');
        } else {
            this.addToWatchlistBtn.style.display = 'inline-block';
            this.watchlistStatus.classList.add('d-none');
        }
    }

    /**
     * Controla el estado de carga del botón guardar
     */
    setSaveLoading(isLoading) {
        this.saveDiaryBtn.disabled = isLoading;
        this.saveDiaryText.style.display = isLoading ? 'none' : 'inline';
        this.saveDiarySpinner.style.display = isLoading ? 'inline-block' : 'none';
    }

    /**
     * Muestra estado de carga
     */
    showLoading() {
        this.loadingContainer.style.display = 'block';
        this.errorContainer.style.display = 'none';
        this.movieContainer.style.display = 'none';
    }

    /**
     * Muestra error
     */
    showError(message) {
        this.errorMessage.textContent = message;
        this.loadingContainer.style.display = 'none';
        this.errorContainer.style.display = 'block';
        this.movieContainer.style.display = 'none';
    }

    /**
     * Muestra película
     */
    showMovie() {
        this.loadingContainer.style.display = 'none';
        this.errorContainer.style.display = 'none';
        this.movieContainer.style.display = 'block';
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
        
        // Limpiar después de que se oculte
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }

    // ==================== UTILITY METHODS ====================

    /**
     * Obtiene URL de imagen de TMDB
     */
    getTmdbImageUrl(posterPath) {
        if (!posterPath || posterPath === 'null') {
            return 'https://via.placeholder.com/400x600/cccccc/666666?text=Sin+Imagen';
        }
        
        if (posterPath.startsWith('http')) {
            return posterPath;
        }
        
        return `https://image.tmdb.org/t/p/w500${posterPath}`;
    }

    /**
     * Formatea fecha para mostrar
     */
    formatDate(dateString) {
        if (!dateString) return 'No disponible';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    }

    /**
     * Formatea duración en minutos a horas y minutos
     */
    formatRuntime(minutes) {
        if (!minutes) return 'No disponible';
        
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        
        if (hours === 0) {
            return `${remainingMinutes} min`;
        } else if (remainingMinutes === 0) {
            return `${hours}h`;
        } else {
            return `${hours}h ${remainingMinutes}min`;
        }
    }

    /**
     * Formatea dinero
     */
    formatMoney(amount) {
        if (!amount || amount === 0) return 'No disponible';
        
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD',
            notation: 'compact',
            maximumFractionDigits: 1
        }).format(amount);
    }

    /**
     * Traduce el estado de la película
     */
    translateStatus(status) {
        const statuses = {
            'Released': 'Estrenada',
            'Post Production': 'Post-producción',
            'In Production': 'En producción',
            'Planned': 'Planeada',
            'Rumored': 'Rumoreada',
            'Canceled': 'Cancelada'
        };
        
        return statuses[status] || status || 'Desconocido';
    }

    /**
     * Obtiene nombre del idioma
     */
    getLanguageName(languageCode) {
        const languages = {
            'en': 'Inglés',
            'es': 'Español',
            'fr': 'Francés',
            'de': 'Alemán',
            'it': 'Italiano',
            'ja': 'Japonés',
            'ko': 'Coreano',
            'zh': 'Chino',
            'pt': 'Portugués',
            'ru': 'Ruso'
        };
        
        return languages[languageCode] || languageCode || 'Desconocido';
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new MovieDetailManager();
});