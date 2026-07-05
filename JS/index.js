
// Header scroll effects
let lastScrollY = window.scrollY;
const header = document.querySelector('.site-header');
const siteTitle = document.querySelector('.site-title');

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 80) {
        header.classList.add('header-scrolled');
        siteTitle.classList.add('title-hidden');
    } else {
        header.classList.remove('header-scrolled');
        siteTitle.classList.remove('title-hidden');
    }

    lastScrollY = currentScrollY;
});

// Password visibility toggle - prevents interfering with input operations
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

// Prevent mousedown from stealing focus from password input
togglePassword.addEventListener('mousedown', function(e) {
    e.preventDefault(); // Prevents the button from taking focus
});

togglePassword.addEventListener('click', function(e) {
    e.stopPropagation(); // Stop event from bubbling up
    passwordInput.focus(); // Keep focus on the password input
    
    // Toggle the type attribute
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Toggle the eye icon
    if (type === 'text') {
        this.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
        `;
    } else {
        this.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            </svg>
        `;
    }
});

// Form submission handling with Firebase
const authForm = document.getElementById('authForm');
const forgotPasswordLink = document.querySelector('.forgot-password');
const submitBtn = document.querySelector('.login-btn');

// Get auth instance from firebase.js
const auth = window.firebaseAuth;

// Show error message to user
function showError(message) {
    // Remove any existing error messages
    const existingError = document.querySelector('.error-message, .success-message');
    if (existingError) existingError.remove();
    
    // Create and add new error message with dark theme styling
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        background: rgba(239, 68, 68, 0.15);
        border: 1px solid rgba(239, 68, 68, 0.4);
        color: #fca5a5;
        padding: 14px 18px;
        border-radius: 12px;
        margin-bottom: 24px;
        text-align: center;
        font-size: 14px;
        font-weight: 500;
        animation: slideUp 0.3s ease-out;
    `;
    errorDiv.textContent = message;
    
    const loginCard = document.querySelector('.login-card');
    loginCard.insertBefore(errorDiv, document.querySelector('.login-form'));
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// Show success message
function showSuccess(message) {
    // Remove any existing messages
    const existingMsg = document.querySelector('.success-message, .error-message');
    if (existingMsg) existingMsg.remove();
    
    // Create and add new success message with dark theme styling
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = `
        background: rgba(34, 197, 94, 0.15);
        border: 1px solid rgba(34, 197, 94, 0.4);
        color: #86efac;
        padding: 14px 18px;
        border-radius: 12px;
        margin-bottom: 24px;
        text-align: center;
        font-size: 14px;
        font-weight: 500;
        animation: slideUp 0.3s ease-out;
    `;
    successDiv.textContent = message;
    
    const loginCard = document.querySelector('.login-card');
    loginCard.insertBefore(successDiv, document.querySelector('.login-form'));
    
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, 5000);
}

// Reset button state
function resetButton() {
    submitBtn.textContent = 'Sign In Securely';
    submitBtn.style.background = '';
    submitBtn.disabled = false;
}

authForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Remove any existing messages
    const existingMsg = document.querySelector('.success-message, .error-message');
    if (existingMsg) existingMsg.remove();
    
    const email = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    // Basic validation
    if (!email || !password) {
        showError('Please enter both email and password');
        return;
    }
    
    // Check if Firebase auth is available
    if (!auth) {
        showError('Firebase is not configured. Please check your configuration.');
        return;
    }
    
    // Set loading state
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Signing in...';
    submitBtn.disabled = true;
    
    try {
        // Sign in with Firebase (compat syntax)
        await auth.signInWithEmailAndPassword(email, password);
        
        // Success - redirect immediately to dashboard
        console.log('Login successful! Redirecting to dashboard...');
        window.location.href = 'dashboard.html';
        
    } catch (error) {
        console.error('Login error:', error);
        resetButton();
        
        // Handle all authentication errors with custom message
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            // Show the exact message requested for invalid credentials
            showError('Invalid Username or Password try again');
        } else if (error.code === 'auth/network-request-failed') {
            showError('Network error. Check your internet connection.');
        } else {
            // For all other errors, still show the generic invalid message
            showError('Invalid Username or Password try again');
        }
    }
});

// Forgot password / Reset password functionality
forgotPasswordLink.addEventListener('click', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('username').value.trim();
    
    if (!email) {
        showError('Please enter your email address in the username field first.');
        return;
    }
    
    if (!auth) {
        showError('Firebase is not configured. Please check your configuration.');
        return;
    }
    
    try {
        await auth.sendPasswordResetEmail(email);
        showSuccess('Password reset email sent! Check your inbox.');
    } catch (error) {
        console.error('Password reset error:', error);
        
        switch(error.code) {
            case 'auth/user-not-found':
                showError('No account found with this email.');
                break;
            case 'auth/invalid-email':
                showError('Please enter a valid email address.');
                break;
            case 'auth/network-request-failed':
                showError('Network error. Check your internet connection.');
                break;
            default:
                showError('Failed to send reset email. Please try again.');
        }
    }
});

// Add input animations
const inputs = document.querySelectorAll('.form-group input');
inputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('input-focused');
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.classList.remove('input-focused');
    });
});