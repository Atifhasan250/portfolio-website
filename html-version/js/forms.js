// Contact form handling
class ContactForm {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        this.submitButton = this.form?.querySelector('button[type="submit"]');
        this.originalButtonText = this.submitButton?.textContent;
        
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        this.bindEvents();
        this.setupValidation();
    }
    
    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearErrors(input));
        });
    }
    
    setupValidation() {
        // Add validation styles to CSS if not already present
        if (!document.querySelector('#form-validation-styles')) {
            const style = document.createElement('style');
            style.id = 'form-validation-styles';
            style.textContent = `
                .form-error {
                    border-color: #ef4444 !important;
                    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
                }
                .error-message {
                    color: #ef4444;
                    font-size: 0.875rem;
                    margin-top: 0.25rem;
                    display: block;
                }
                .form-success {
                    border-color: #10b981 !important;
                    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1) !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            this.showToast('Please fix the errors before submitting.', 'error');
            return;
        }
        
        this.setLoadingState(true);
        
        try {
            const formData = new FormData(this.form);
            const response = await fetch(this.form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                this.handleSuccess();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            this.handleError(error);
        } finally {
            this.setLoadingState(false);
        }
    }
    
    validateForm() {
        const inputs = this.form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';
        
        // Clear previous errors
        this.clearErrors(field);
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            errorMessage = `${this.getFieldLabel(field)} is required.`;
            isValid = false;
        }
        
        // Email validation
        if (fieldName === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Please enter a valid email address.';
                isValid = false;
            }
        }
        
        // Name validation
        if (fieldName === 'name' && value) {
            if (value.length < 2) {
                errorMessage = 'Name must be at least 2 characters long.';
                isValid = false;
            }
        }
        
        // Subject validation
        if (fieldName === 'subject' && value) {
            if (value.length < 3) {
                errorMessage = 'Subject must be at least 3 characters long.';
                isValid = false;
            }
        }
        
        // Message validation
        if (fieldName === 'message' && value) {
            if (value.length < 10) {
                errorMessage = 'Message must be at least 10 characters long.';
                isValid = false;
            }
        }
        
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.showFieldSuccess(field);
        }
        
        return isValid;
    }
    
    getFieldLabel(field) {
        const label = this.form.querySelector(`label[for="${field.id}"]`);
        return label ? label.textContent.replace('*', '').trim() : field.name;
    }
    
    showFieldError(field, message) {
        field.classList.add('form-error');
        field.classList.remove('form-success');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
    }
    
    showFieldSuccess(field) {
        field.classList.remove('form-error');
        field.classList.add('form-success');
        
        // Remove error message
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
    
    clearErrors(field) {
        field.classList.remove('form-error', 'form-success');
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
    
    setLoadingState(isLoading) {
        if (!this.submitButton) return;
        
        if (isLoading) {
            this.submitButton.disabled = true;
            this.submitButton.innerHTML = `
                <div class="loading-spinner" style="width: 20px; height: 20px; margin-right: 8px;"></div>
                Sending...
            `;
        } else {
            this.submitButton.disabled = false;
            this.submitButton.textContent = this.originalButtonText;
        }
    }
    
    handleSuccess() {
        this.showToast('Thank you! Your message has been sent successfully.', 'success');
        this.form.reset();
        
        // Clear all field states
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => this.clearErrors(input));
        
        // Add success animation to form
        this.form.classList.add('form-success');
        setTimeout(() => {
            this.form.classList.remove('form-success');
        }, 3000);
    }
    
    handleError(error) {
        console.error('Form submission error:', error);
        this.showToast('Sorry, there was an error sending your message. Please try again.', 'error');
    }
    
    showToast(message, type = 'info') {
        // Use global showToast function if available
        if (typeof window.showToast === 'function') {
            window.showToast(message, type);
            return;
        }
        
        // Fallback toast implementation
        const toast = document.createElement('div');
        toast.className = `toast toast-${type} show`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            z-index: 1000;
            max-width: 400px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // Hide and remove toast
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 5000);
    }
}

// Form validation utilities
const formUtils = {
    // Sanitize input to prevent XSS
    sanitizeInput: (input) => {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    },
    
    // Format phone number
    formatPhoneNumber: (phone) => {
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        return phone;
    },
    
    // Validate file upload
    validateFile: (file, allowedTypes = [], maxSize = 5 * 1024 * 1024) => {
        const errors = [];
        
        if (allowedTypes.length && !allowedTypes.includes(file.type)) {
            errors.push('File type not allowed');
        }
        
        if (file.size > maxSize) {
            errors.push(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
};

// Auto-resize textarea
function autoResizeTextarea() {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    });
}

// Initialize forms when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize contact form
    new ContactForm('#contact-form');
    
    // Initialize auto-resize for textareas
    autoResizeTextarea();
    
    // Add form animation classes
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.classList.add('fade-in-on-scroll');
    });
});

// Export for use in other scripts
window.ContactForm = ContactForm;
window.formUtils = formUtils;