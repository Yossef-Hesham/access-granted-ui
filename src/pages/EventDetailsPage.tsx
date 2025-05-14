
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { eventService } from '@/services/eventService';
import { bookingService } from '@/services/bookingService';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Tag } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Card } from '@/components/ui/card';

const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [isBooking, setIsBooking] = useState(false);
  
  if (!id) {
    navigate('/');
    return null;
  }
  
  // Fetch event details
  const {
    data: event,
    isLoading: isEventLoading,
    error: eventError,
  } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventService.getEvent(id),
  });
  
  // Check if event is already booked
  const {
    data: bookingStatus,
    isLoading: isBookingStatusLoading,
    error: bookingStatusError,
  } = useQuery({
    queryKey: ['bookingStatus', id],
    queryFn: () => bookingService.checkBookingStatus(id),
    enabled: isAuthenticated, // Only run this query if user is authenticated
  });
  
  const handleBookEvent = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to book events');
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }
    
    try {
      setIsBooking(true);
      const booking = await bookingService.createBooking(id);
      navigate(`/booking-success/${id}`);
    } catch (error) {
      console.error('Booking error:', error);
      // Error is already handled by booking service
    } finally {
      setIsBooking(false);
    }
  };
  
  if (isEventLoading) {
    return (
      <MainLayout>
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
          <div className="flex justify-end">
            <div className="h-10 bg-muted rounded w-32"></div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (eventError || !event) {
    return (
      <MainLayout>
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/')}>Go Back to Events</Button>
        </div>
      </MainLayout>
    );
  }
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  return (
    <MainLayout>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Event Image */}
        <div className="lg:w-1/2">
          <img
            src={event.image || 'https://via.placeholder.com/800x500?text=Event'}
            alt={event.name}
            className="w-full h-auto rounded-xl"
          />
        </div>
        
        {/* Event Details */}
        <div className="lg:w-1/2 space-y-6">
          <h1 className="text-3xl font-bold">{event.name}</h1>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-5 w-5 mr-2" />
              <span>{formatDate(event.date)}</span>
            </div>
            
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{event.venue}</span>
            </div>
            
            <div className="flex items-center text-muted-foreground">
              <Tag className="h-5 w-5 mr-2" />
              <span>{event.category}</span>
            </div>
          </div>
          
          <Card className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">{t('events.price')}</p>
                <p className="text-2xl font-bold">${event.price.toFixed(2)}</p>
              </div>
              
              {isAuthenticated && bookingStatus?.isBooked ? (
                <Button variant="outline" disabled className="pointer-events-none">
                  {t('events.booked')}
                </Button>
              ) : (
                <Button 
                  onClick={handleBookEvent} 
                  disabled={isBooking || isBookingStatusLoading}
                >
                  {isBooking ? `${t('language') === 'en' ? 'Booking...' : 'جاري الحجز...'}` : t('events.book_now')}
                </Button>
              )}
            </div>
          </Card>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">{t('events.description')}</h2>
            <p className="text-muted-foreground">
              {event.description}
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EventDetailsPage;
