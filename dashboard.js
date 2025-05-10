
// DOM Elements
const logoutButton = document.getElementById('logout-button');
const toast = document.getElementById('toast');
const toastTitle = document.getElementById('toast-title');
const toastMessage = document.getElementById('toast-message');
const toastClose = document.getElementById('toast-close');

// API URL (Change this to your Django server URL in production)
const API_URL = 'http://127.0.0.1:8000/api';

// Check authentication on page load
checkAuth();

// Logout functionality
logoutButton.addEventListener('click', () => {
  // Clear user data from storage
  localStorage.removeItem('user');
  sessionStorage.removeItem('user');
  
  showToast('Logged out', 'You have been successfully logged out.', 'success');
  
  // Redirect to login page after a short delay
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1000);
});

// Event handlers for dashboard elements
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function(e) {
    if (this.getAttribute('href').startsWith('#')) {
      e.preventDefault();
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    }
  });
});

// Add click handlers for booking buttons
document.querySelectorAll('.btn').forEach(button => {
  if (button.textContent.trim() === 'Book Now') {
    button.addEventListener('click', () => {
      showToast('Booking Successful', 'Event has been added to your calendar.', 'success');
    });
  }
  if (button.textContent.trim() === 'View Ticket') {
    button.addEventListener('click', () => {
      showToast('Ticket Viewer', 'Ticket functionality is not implemented in this demo.', 'success');
    });
  }
  if (button.textContent.trim() === 'Cancel Booking') {
    button.addEventListener('click', () => {
      showToast('Cancellation', 'Booking cancellation is not implemented in this demo.', 'error');
    });
  }
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
function checkAuth() {
  // Check for token in localStorage or sessionStorage
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || 'null');
  
  if (!user || !user.token) {
    // Not authenticated, redirect to login
    showToast('Authentication Required', 'Please log in to access the dashboard.', 'error');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
    return;
  }
  
  // Update UI based on user type
  if (user.user_type === 'admin') {
    // Add admin-specific UI elements if needed
    const userInfo = document.querySelector('.user-info');
    if (userInfo) {
      const adminBadge = document.createElement('span');
      adminBadge.className = 'badge bg-danger mt-2';
      adminBadge.textContent = 'Admin';
      userInfo.appendChild(adminBadge);
    }
  }
  
  // Update user information in the sidebar
  updateUserInfo(user);
}

// Update user information in the UI
function updateUserInfo(user) {
  // Update username in the dashboard
  const username = document.querySelector('.user-info h5');
  if (username) {
    username.textContent = user.username;
  }
  
  // Update email in the dashboard
  const email = document.querySelector('.user-info p.text-muted');
  if (email) {
    email.textContent = user.email;
  }
}

// Set up authentication header for all API requests
function getAuthHeader() {
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || 'null');
  return user && user.token ? { 'Authorization': `Token ${user.token}` } : {};
}
