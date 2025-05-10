
// DOM Elements
const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginFormElement = document.getElementById('login-form-element');
const registerFormElement = document.getElementById('register-form-element');
const toast = document.getElementById('toast');
const toastTitle = document.getElementById('toast-title');
const toastMessage = document.getElementById('toast-message');
const toastClose = document.getElementById('toast-close');

// API URL (Change this to your Django server URL in production)
const API_URL = 'http://127.0.0.1:8000/api';

// Tab switching
loginTab.addEventListener('click', () => {
  loginTab.classList.add('active');
  registerTab.classList.remove('active');
  loginForm.classList.add('active');
  registerForm.classList.remove('active');
  clearErrors();
});

registerTab.addEventListener('click', () => {
  registerTab.classList.add('active');
  loginTab.classList.remove('active');
  registerForm.classList.add('active');
  loginForm.classList.remove('active');
  clearErrors();
});

// Password toggle visibility
const togglePasswordButtons = document.querySelectorAll('.toggle-password');
togglePasswordButtons.forEach(button => {
  button.addEventListener('click', () => {
    const passwordField = button.previousElementSibling;
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
    button.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
  });
});

// Login Form Submission
loginFormElement.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const rememberMe = document.getElementById('remember-me').checked;
  
  // Reset errors
  clearErrors();
  
  // Validate
  let isValid = true;
  
  if (!email) {
    showError('email-error', 'Email is required');
    isValid = false;
  } else if (!isValidEmail(email)) {
    showError('email-error', 'Please enter a valid email');
    isValid = false;
  }
  
  if (!password) {
    showError('password-error', 'Password is required');
    isValid = false;
  }
  
  if (isValid) {
    // Start loading state
    const loginButton = loginFormElement.querySelector('.btn');
    simulateLoadingStart(loginButton, 'Login');
    
    try {
      // Real API call to Django backend
      const response = await fetch(`${API_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Success
        showToast('Success!', 'You\'ve been logged in successfully.', 'success');
        
        // Store user info and token
        const userData = {
          id: data.user_id,
          username: data.username,
          email: data.email,
          user_type: data.user_type,
          token: data.token
        };
        
        if (rememberMe) {
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          sessionStorage.setItem('user', JSON.stringify(userData));
        }
        
        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1000);
      } else {
        // Error
        showToast('Login Failed', data.non_field_errors?.[0] || 'Invalid credentials', 'error');
        simulateLoadingEnd(loginButton, 'Login');
      }
    } catch (error) {
      console.error('Login error:', error);
      showToast('Login Failed', 'Server error. Please try again later.', 'error');
      simulateLoadingEnd(loginButton, 'Login');
    }
  }
});

// Register Form Submission
registerFormElement.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('full-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const agreeTerms = document.getElementById('terms').checked;
  
  // Reset errors
  clearErrors();
  
  // Validate
  let isValid = true;
  
  if (!name.trim()) {
    showError('name-error', 'Full name is required');
    isValid = false;
  }
  
  if (!email) {
    showError('register-email-error', 'Email is required');
    isValid = false;
  } else if (!isValidEmail(email)) {
    showError('register-email-error', 'Please enter a valid email');
    isValid = false;
  }
  
  if (!password) {
    showError('register-password-error', 'Password is required');
    isValid = false;
  } else if (password.length < 6) {
    showError('register-password-error', 'Password must be at least 6 characters');
    isValid = false;
  }
  
  if (!confirmPassword) {
    showError('confirm-password-error', 'Please confirm your password');
    isValid = false;
  } else if (password !== confirmPassword) {
    showError('confirm-password-error', 'Passwords do not match');
    isValid = false;
  }
  
  if (!agreeTerms) {
    showError('terms-error', 'You must agree to the terms and conditions');
    isValid = false;
  }
  
  if (isValid) {
    // Start loading state
    const registerButton = registerFormElement.querySelector('.btn');
    simulateLoadingStart(registerButton, 'Create Account');
    
    try {
      // Use name as username (simplified for this example)
      // In a real implementation, you might want to generate a unique username
      const username = name.trim().toLowerCase().replace(/\s+/g, '');
      
      // Real API call to Django backend
      const response = await fetch(`${API_URL}/user/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          username,
          email, 
          password
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Success
        showToast('Registration successful!', 'Your account has been created. You can now log in.', 'success');
        
        // Switch to login tab after successful registration
        setTimeout(() => {
          loginTab.click();
        }, 1000);
      } else {
        // Handle specific errors
        let errorMessage = 'Registration failed. Please try again.';
        
        if (data.username) {
          errorMessage = `Username error: ${data.username[0]}`;
        } else if (data.email) {
          errorMessage = `Email error: ${data.email[0]}`;
        } else if (data.password) {
          errorMessage = `Password error: ${data.password[0]}`;
        } else if (data.non_field_errors) {
          errorMessage = data.non_field_errors[0];
        }
        
        showToast('Registration Failed', errorMessage, 'error');
        console.error('Registration errors:', data);
      }
    } catch (error) {
      console.error('Registration error:', error);
      showToast('Registration Failed', 'Server error. Please try again later.', 'error');
    } finally {
      simulateLoadingEnd(registerButton, 'Create Account');
    }
  }
});

// Helper functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  errorElement.textContent = message;
  
  // Also add error class to the related input
  const inputId = elementId.replace('-error', '');
  const inputElement = document.getElementById(inputId);
  if (inputElement) {
    inputElement.classList.add('error');
  }
}

function clearErrors() {
  // Clear all error messages
  const errorElements = document.querySelectorAll('.error-message');
  errorElements.forEach(element => {
    element.textContent = '';
  });
  
  // Remove error class from inputs
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    input.classList.remove('error');
  });
}

function simulateLoadingStart(button, originalText) {
  button.disabled = true;
  button.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Please wait...';
  button.originalText = originalText; // Store the original text
}

function simulateLoadingEnd(button, defaultText) {
  button.disabled = false;
  button.textContent = button.originalText || defaultText;
}

function showToast(title, message, type = 'success') {
  toastTitle.textContent = title;
  toastMessage.textContent = message;
  toast.className = 'toast show ' + type;
  
  // Auto hide after 5 seconds
  setTimeout(() => {
    hideToast();
  }, 5000);
}

function hideToast() {
  toast.classList.remove('show');
}

// Close toast on click
toastClose.addEventListener('click', hideToast);

// Add event handlers to the book now buttons
document.querySelectorAll('.btn-outline-primary').forEach(button => {
  if (button.textContent.trim() === 'Book Now') {
    button.addEventListener('click', () => {
      showToast('Login Required', 'Please log in to book this event.', 'error');
    });
  }
});

// Check if user is authenticated and update UI
function checkAuthStatus() {
  // Check for token in localStorage or sessionStorage
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || 'null');
  
  if (user && user.token) {
    // User is logged in
    const accountBtn = document.querySelector('.btn-outline-primary');
    if (accountBtn && accountBtn.textContent.trim() === 'My Account') {
      accountBtn.textContent = 'Dashboard';
    }
  }
}

// Call checkAuthStatus on page load
checkAuthStatus();
