/**
 * Maneja toda la lógica de autenticación (login/registro)
 */
class AuthManager {
    constructor() {
        this.isLoginMode = true; // Empezar en modo login
        this.initializeElements();
        this.attachEventListeners();
        this.checkExistingAuth();
    }

    /**
     * Inicializa referencias a elementos del DOM
     */
    initializeElements() {
        this.form = document.getElementById('auth-form');
        this.formTitle = document.getElementById('form-title');
        this.submitBtn = document.getElementById('submit-btn');
        this.submitText = document.getElementById('submit-text');
        this.loadingSpinner = document.getElementById('loading-spinner');
        this.toggleMode = document.getElementById('toggle-mode');
        this.toggleQuestion = document.getElementById('toggle-question');
        this.messageContainer = document.getElementById('message-container');
        this.message = document.getElementById('message');
        
        // Campos del formulario
        this.emailField = document.getElementById('email');
        this.passwordField = document.getElementById('password');
        this.usernameField = document.getElementById('username');
        this.nombreField = document.getElementById('nombre');
        this.apellidoField = document.getElementById('apellido');
        this.fechaNacField = document.getElementById('fechaNac');
        
        // Grupos de campos
        this.usernameGroup = document.getElementById('username-group');
        this.registerFields = document.getElementById('register-fields');
        this.passwordHelp = document.getElementById('password-help');
    }

    /**
     * Adjunta event listeners
     */
    attachEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.toggleMode.addEventListener('click', (e) => this.handleToggleMode(e));
    }

    /**
     * Verifica si ya hay una sesión activa
     */
    checkExistingAuth() {
        if (api.isAuthenticated()) {
            this.showMessage('Ya tienes una sesión activa. Redirigiendo...', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        }
    }

    /**
     * Maneja el toggle entre login y registro
     */
    handleToggleMode(e) {
        e.preventDefault();
        this.isLoginMode = !this.isLoginMode;
        this.updateFormMode();
        this.clearMessages();
        this.clearForm();
    }

    /**
     * Actualiza la interfaz según el modo (login/registro)
     */
    updateFormMode() {
        if (this.isLoginMode) {
            // Modo Login
            this.formTitle.textContent = 'Iniciar Sesión';
            this.submitText.textContent = 'Iniciar Sesión';
            this.toggleQuestion.textContent = '¿No tienes cuenta?';
            this.toggleMode.textContent = 'Regístrate aquí';
            
            // Ocultar campos de registro
            this.usernameGroup.style.display = 'none';
            this.registerFields.style.display = 'none';
            this.passwordHelp.style.display = 'none';
            
            // Quitar required de campos de registro
            this.usernameField.removeAttribute('required');
        } else {
            // Modo Registro
            this.formTitle.textContent = 'Crear Cuenta';
            this.submitText.textContent = 'Registrarse';
            this.toggleQuestion.textContent = '¿Ya tienes cuenta?';
            this.toggleMode.textContent = 'Inicia sesión aquí';
            
            // Mostrar campos de registro
            this.usernameGroup.style.display = 'block';
            this.registerFields.style.display = 'block';
            this.passwordHelp.style.display = 'block';
            
            // Añadir required a campos obligatorios
            this.usernameField.setAttribute('required', 'required');
        }
    }

    /**
     * Maneja el envío del formulario
     */
    async handleSubmit(e) {
        e.preventDefault();
        
        // Validar campos
        if (!this.validateForm()) {
            return;
        }

        this.setLoading(true);
        this.clearMessages();

        try {
            if (this.isLoginMode) {
                await this.handleLogin();
            } else {
                await this.handleRegister();
            }
        } catch (error) {
            this.showMessage(error.message, 'danger');
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * Maneja el proceso de login
     */
    async handleLogin() {
        const email = this.emailField.value.trim();
        const password = this.passwordField.value;

        const response = await api.login(email, password);
        
        this.showMessage('¡Login exitoso! Redirigiendo...', 'success');
        
        // Redirigir al dashboard tras un breve delay
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }

    /**
     * Maneja el proceso de registro
     */
    async handleRegister() {
        const userData = {
            username: this.usernameField.value.trim(),
            email: this.emailField.value.trim(),
            password: this.passwordField.value,
            nombre: this.nombreField.value.trim() || null,
            apellido: this.apellidoField.value.trim() || null,
            fechaNac: this.fechaNacField.value || null
        };

        const response = await api.register(userData);
        
        this.showMessage('¡Registro exitoso! Redirigiendo...', 'success');
        
        // Redirigir al dashboard tras un breve delay
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }

    /**
     * Valida el formulario antes del envío
     */
    validateForm() {
        const email = this.emailField.value.trim();
        const password = this.passwordField.value;

        // Validaciones básicas
        if (!email || !password) {
            this.showMessage('Por favor, completa todos los campos obligatorios', 'warning');
            return false;
        }

        // Validar email
        if (!this.isValidEmail(email)) {
            this.showMessage('Por favor, introduce un email válido', 'warning');
            return false;
        }

        // Validaciones específicas para registro
        if (!this.isLoginMode) {
            const username = this.usernameField.value.trim();
            
            if (!username) {
                this.showMessage('El username es obligatorio para el registro', 'warning');
                return false;
            }

            if (username.length < 3) {
                this.showMessage('El username debe tener al menos 3 caracteres', 'warning');
                return false;
            }

            // Validar contraseña para registro
            if (!this.isValidPassword(password)) {
                this.showMessage('La contraseña debe tener al menos 8 caracteres, una mayúscula y un número', 'warning');
                return false;
            }
        }

        return true;
    }

    /**
     * Valida formato de email
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Valida contraseña (para registro)
     */
    isValidPassword(password) {
        // Al menos 8 caracteres, una mayúscula y un número
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }

    /**
     * Muestra/oculta el estado de carga
     */
    setLoading(isLoading) {
        if (isLoading) {
            this.submitBtn.disabled = true;
            this.submitText.style.display = 'none';
            this.loadingSpinner.style.display = 'inline-block';
        } else {
            this.submitBtn.disabled = false;
            this.submitText.style.display = 'inline';
            this.loadingSpinner.style.display = 'none';
        }
    }

    /**
     * Muestra un mensaje al usuario
     */
    showMessage(text, type = 'info') {
        this.message.className = `alert alert-${type}`;
        this.message.textContent = text;
        this.messageContainer.style.display = 'block';
        
        // Auto-ocultar mensajes de éxito después de 5 segundos
        if (type === 'success') {
            setTimeout(() => {
                this.clearMessages();
            }, 5000);
        }
    }

    /**
     * Oculta los mensajes
     */
    clearMessages() {
        this.messageContainer.style.display = 'none';
    }

    /**
     * Limpia el formulario
     */
    clearForm() {
        this.form.reset();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});