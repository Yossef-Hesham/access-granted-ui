
// DOM Elements
const logoutButton = document.getElementById('logout-button');
const toast = document.getElementById('toast');
const toastTitle = document.getElementById('toast-title');
const toastMessage = document.getElementById('toast-message');
const toastClose = document.getElementById('toast-close');

// Import auth service functionality by loading it from script tag
// This is a simpler approach since we're using vanilla JS in this file
let authService = {
  logout: () => {
    // Remove auth data from local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Set flag to indicate logout
    sessionStorage.removeItem('fromLogin');
  }
};

// Logout functionality
logoutButton.addEventListener('click', () => {
  authService.logout();
  
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
      // In a real app, we would call the booking API here
      fetch('http://127.0.0.1:8000/api/bookings/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ eventId: button.dataset.eventId })
      })
      .then(response => {
        if (response.ok) {
          showToast('Booking Successful', 'Event has been added to your calendar.', 'success');
          // Update the button to "View Ticket"
          button.textContent = 'View Ticket';
          button.addEventListener('click', viewTicketHandler);
        } else {
          throw new Error('Booking failed');
        }
      })
      .catch(error => {
        showToast('Booking Failed', 'Could not book the event. Please try again.', 'error');
      });
    });
  }
  if (button.textContent.trim() === 'View Ticket') {
    button.addEventListener('click', viewTicketHandler);
  }
  if (button.textContent.trim() === 'Cancel Booking') {
    button.addEventListener('click', () => {
      const bookingId = button.dataset.bookingId;
      if (!bookingId) {
        showToast('Error', 'Booking ID not found', 'error');
        return;
      }
      
      fetch(`http://127.0.0.1:8000/api/bookings/${bookingId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })
      .then(response => {
        if (response.ok) {
          showToast('Cancellation', 'Booking has been cancelled successfully.', 'success');
          // You might want to refresh the page or update the UI here
        } else {
          throw new Error('Cancellation failed');
        }
      })
      .catch(error => {
        showToast('Cancellation Failed', 'Could not cancel the booking.', 'error');
      });
    });
  }
});

function viewTicketHandler() {
  showToast('Ticket Viewer', 'Your ticket details are being loaded.', 'success');
  // Here you would implement showing the ticket details
}

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
  const token = localStorage.getItem('authToken');
  if (!token) {
    // Not authenticated, redirect to login
    showToast('Authentication Required', 'Please log in to access the dashboard.', 'error');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
    return false;
  }
  return true;
}

// Run auth check when page loads
window.addEventListener('DOMContentLoaded', () => {
  if (!checkAuth()) {
    return;
  }
  
  // Load user data
  const userString = localStorage.getItem('user');
  if (userString) {
    try {
      const user = JSON.parse(userString);
      // Update UI with user information
      const userNameElement = document.getElementById('user-name');
      if (userNameElement) {
        userNameElement.textContent = user.name;
      }
      
      // Show admin controls if user is admin
      if (user.role === 'admin') {
        const adminControls = document.querySelectorAll('.admin-only');
        adminControls.forEach(el => el.classList.remove('hidden'));
      }
    } catch (e) {
      console.error('Failed to parse user data', e);
    }
  }
});
