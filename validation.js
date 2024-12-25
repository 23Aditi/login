// Form validation script
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const passwordInput = document.querySelector('input[name="password"]');
    const confirmPasswordInput = document.querySelector('input[name="confirm_password"]');
    const phoneInput = document.querySelector('input[name="phone"]');
    
    // Create error message elements
    const passwordError = createErrorElement();
    const confirmPasswordError = createErrorElement();
    const phoneError = createErrorElement();
    
    // Insert error elements after respective inputs
    passwordInput.parentNode.insertBefore(passwordError, passwordInput.nextSibling);
    confirmPasswordInput.parentNode.insertBefore(confirmPasswordError, confirmPasswordInput.nextSibling);
    phoneInput?.parentNode.insertBefore(phoneError, phoneInput.nextSibling);
    
    // Create success popup
    const successPopup = document.createElement('div');
    successPopup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        padding: 20px;
        border-radius: 10px;
        border: 2px solid #4CAF50;
        color: #fff;
        font-size: 18px;
        text-align: center;
        z-index: 1000;
        display: none;
        animation: fadeIn 0.5s;
        box-shadow: 0 0 20px rgba(76, 175, 80, 0.5);
    `;
    document.body.appendChild(successPopup);
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translate(-50%, -60%); }
            to { opacity: 1; transform: translate(-50%, -50%); }
        }
    `;
    document.head.appendChild(style);
    
    function createErrorElement() {
        const error = document.createElement('div');
        error.style.color = '#ff4444';
        error.style.fontSize = '12px';
        error.style.marginTop = '5px';
        error.style.fontFamily = 'Arial, sans-serif';
        error.style.display = 'none';
        return error;
    }
    
    function showSuccessMessage(message) {
        successPopup.textContent = message;
        successPopup.style.display = 'block';
        
        // Hide popup after 3 seconds
        setTimeout(() => {
            successPopup.style.display = 'none';
            // For signup, redirect to login page
            if (message.includes('Sign up')) {
                window.location.href = 'index.html';
            }
        }, 3000);
    }
    
    function validatePassword(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        let errors = [];
        
        if (password.length < minLength) {
            errors.push('at least 8 characters');
        }
        if (!hasUpperCase) {
            errors.push('one uppercase letter');
        }
        if (!hasLowerCase) {
            errors.push('one lowercase letter');
        }
        if (!hasNumber) {
            errors.push('one number');
        }
        if (!hasSpecialChar) {
            errors.push('one special character');
        }
        
        return errors;
    }
    
    function validatePhone(phone) {
        const cleanPhone = phone.replace(/[^\d+]/g, '');
        const isValidFormat = /^\+?\d+$/.test(cleanPhone);
        const isValidLength = cleanPhone.replace('+', '').length >= 10 && 
                            cleanPhone.replace('+', '').length <= 15;
        
        return isValidFormat && isValidLength;
    }
    
    // Real-time password validation
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const errors = validatePassword(this.value);
            if (errors.length > 0) {
                passwordError.textContent = 'Password must contain: ' + errors.join(', ');
                passwordError.style.display = 'block';
            } else {
                passwordError.style.display = 'none';
            }
        });
    }
    
    // Real-time confirm password validation
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            if (this.value !== passwordInput.value) {
                confirmPasswordError.textContent = 'Passwords do not match';
                confirmPasswordError.style.display = 'block';
            } else {
                confirmPasswordError.style.display = 'none';
            }
        });
    }
    
    // Real-time phone validation
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            if (!validatePhone(this.value)) {
                phoneError.textContent = 'Phone number must be 10-15 digits with optional country code (+)';
                phoneError.style.display = 'block';
            } else {
                phoneError.style.display = 'none';
            }
        });
    }
    
    // Form submission handling
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Check if it's a login form or signup form
            const isLoginForm = !phoneInput;
            
            if (isLoginForm) {
                // Handle login form
                showSuccessMessage('Login Successful! Welcome back!');
            } else {
                // Handle signup form
                const passwordErrors = validatePassword(passwordInput.value);
                const isPhoneValid = validatePhone(phoneInput.value);
                const doPasswordsMatch = passwordInput.value === confirmPasswordInput.value;
                
                if (passwordErrors.length === 0 && isPhoneValid && doPasswordsMatch) {
                    showSuccessMessage('Sign up Successful! Redirecting to login page...');
                } else {
                    // Show all relevant error messages
                    if (passwordErrors.length > 0) {
                        passwordError.textContent = 'Password must contain: ' + passwordErrors.join(', ');
                        passwordError.style.display = 'block';
                    }
                    if (!doPasswordsMatch) {
                        confirmPasswordError.textContent = 'Passwords do not match';
                        confirmPasswordError.style.display = 'block';
                    }
                    if (!isPhoneValid) {
                        phoneError.textContent = 'Phone number must be 10-15 digits with optional country code (+)';
                        phoneError.style.display = 'block';
                    }
                }
            }
        });
    }
});