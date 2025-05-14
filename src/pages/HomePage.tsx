
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { eventService, Event } from '@/services/eventService';
import { bookingService } from '@/services/bookingService';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import MainLayout from '@/components/layout/MainLayout';
import EventsGrid from '@/components/events/EventsGrid';
import { toast } from '@/components/ui/sonner';

const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Fetch all events
  const {
    data: events = [],
    isLoading: isEventsLoading,
    error: eventsError,
  } = useQuery({
    queryKey: ['events'],
    queryFn: eventService.getAllEvents,
  });
  
  // Fetch user bookings if authenticated
  const {
    data: bookings,
    isLoading: isBookingsLoading,
    error: bookingsError,
  } = useQuery({
    queryKey: ['userBookings'],
    queryFn: bookingService.getUserBookings,
    enabled: isAuthenticated, // Only run this query if user is authenticated
  });
  
  // Extract booked event IDs
  const bookedEventIds = bookings?.map(booking => booking.eventId) || [];
  
  const handleBookEvent = (event: Event) => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      toast.error('Please login to book events');
      navigate('/login', { state: { from: '/' } });
      return;
    }
    
    // If authenticated, navigate to event details for booking
    navigate(`/events/${event.id}`);
  };

  return (
    <MainLayout>
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">{t('events.all')}</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t('language') === 'en' 
            ? 'Browse and book upcoming events. Find the best events happening near you.'
            : 'تصفح وحجز الفعاليات القادمة. اكتشف أفضل الفعاليات التي تقام بالقرب منك.'}
        </p>
      </div>
      
      <EventsGrid
        events={events}
        bookedEventIds={bookedEventIds}
        onBookEvent={handleBookEvent}
        isLoading={isEventsLoading || (isAuthenticated && isBookingsLoading)}
      />
    </MainLayout>
  );
};

export default HomePage;
