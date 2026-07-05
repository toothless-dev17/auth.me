
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



// Form submission handling with Firebase
const authForm = document.getElementById('authForm');
const forgotPasswordLink = document.querySelector('.forgot-password');
const submitBtn = document.querySelector('.login-btn');

// Get auth instance - ensure it's available
let auth;
if (window.firebaseAuth) {
    auth = window.firebaseAuth;
} else {
    // Fallback to directly accessing firebase auth
    auth = firebase.auth();
}
console.log('Index.js - Using auth instance:', auth);

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
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    // Basic validation
    if (!email || !password) {
        showError('Please enter both email and password');
        return;
    }
    
    // Debug: Log auth status
    console.log('Firebase auth instance:', auth);
    console.log('Attempting login with:', email);
    
    // Check if Firebase auth is available
    if (!auth) {
        console.error('Firebase auth is not initialized!');
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
        // Detailed error logging for debugging
        console.error('Full login error object:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        resetButton();
        
        // Handle all authentication errors with proper logging
        if (error.code === 'auth/user-not-found') {
            console.log('ERROR: No user found with this email');
            showError('Invalid Username or Password try again');
        } else if (error.code === 'auth/wrong-password') {
            console.log('ERROR: Incorrect password provided');
            showError('Invalid Username or Password try again');
        } else if (error.code === 'auth/network-request-failed') {
            console.log('ERROR: Network connection issue');
            showError('Network error. Check your internet connection.');
        } else if (error.code === 'auth/invalid-email') {
            console.log('ERROR: Invalid email format');
            showError('Please enter a valid email address');
        } else if (error.code === 'auth/user-disabled') {
            console.log('ERROR: User account has been disabled');
            showError('This account has been disabled');
        } else {
            // Log unknown errors for debugging
            console.log('Unknown error code:', error.code);
            showError('Invalid Username or Password try again');
        }
    }
});

// Forgot password / Reset password functionality
const forgotPasswordLink = document.getElementById('forgotPassword');
if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', async function(e) {
        e.preventDefault();
        
        const emailInput = document.getElementById('email');
        if (!emailInput) {
            showError('Email input field not found.');
            return;
        }
        
        const email = emailInput.value.trim();
        
        if (!email) {
            showError('Please enter your email address first.');
            return;
        }
    
    if (!auth) {
        showError('Firebase is not configured. Please check your configuration.');
        return;
    }
    
    try {
        await auth.sendPasswordResetEmail(email);
        console.log('Password reset email sent successfully');
        showSuccess('Password reset email sent! Check your inbox.');
    } catch (error) {
        console.error('Password reset error:', error.code, error.message);
        resetButton();
        
        if (error.code === 'auth/network-request-failed') {
            showError('Network error. Check your internet connection.');
        } else {
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