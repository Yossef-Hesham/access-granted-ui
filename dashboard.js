// DOM Elements
const logoutButton = document.getElementById('logout-button');
const toast = document.getElementById('toast');
const toastTitle = document.getElementById('toast-title');
const toastMessage = document.getElementById('toast-message');
const toastClose = document.getElementById('toast-close');

// Logout functionality
logoutButton.addEventListener('click', () => {
  // In a real app, you would clear authentication tokens here
  showToast('Logged out', 'You have been successfully logged out.', 'success');
  
  // Redirect to login page after a short delay
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1000);
});

// Toast functions
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

// Check if user is logged in
// In a real application, you would verify the authentication token here
// This is just a simple simulation for demo purposes
function checkAuth() {
  // For demo: just check if we were redirected from login
  const fromLogin = sessionStorage.getItem('fromLogin');
  if (!fromLogin) {
    // Not authenticated, redirect to login
    window.location.href = 'index.html';
  } else {
    // Clear the flag so we don't keep using it
    sessionStorage.removeItem('fromLogin');
  }
}

// Run auth check when page loads
// Commented out for demo purposes to allow direct access to dashboard
// checkAuth();
