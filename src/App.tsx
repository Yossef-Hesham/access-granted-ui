
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";

// Import pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import BookingSuccessPage from "./pages/BookingSuccessPage";
import UserBookingsPage from "./pages/UserBookingsPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminEventForm from "./pages/admin/AdminEventForm";
import NotFound from "./pages/NotFound";

// Import styles
import "./styles/theme.css";

// Protected route component
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/events/:id" element={<EventDetailsPage />} />
                
                {/* Protected Routes (require authentication) */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/booking-success/:id" element={<BookingSuccessPage />} />
                  <Route path="/bookings" element={<UserBookingsPage />} />
                </Route>
                
                {/* Admin Routes (require admin role) */}
                <Route element={<ProtectedRoute requireAdmin />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/events" element={<AdminEvents />} />
                  <Route path="/admin/bookings" element={<AdminBookings />} />
                  <Route path="/admin/events/new" element={<AdminEventForm />} />
                  <Route path="/admin/events/edit/:id" element={<AdminEventForm />} />
                </Route>
                
                {/* 404 Not Found */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
