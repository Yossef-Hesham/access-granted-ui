
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { eventService } from '@/services/eventService';
import { useLanguage } from '@/context/LanguageContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const BookingSuccessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Fetch event details for the booked event
  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventService.getEvent(id || ''),
    enabled: !!id,
  });

  return (
    <MainLayout>
      <div className="max-w-md mx-auto text-center py-16">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Check className="w-8 h-8 text-primary" />
        </div>
        
        <h1 className="text-3xl font-bold mb-2">{t('booking.congrats')}</h1>
        <p className="text-xl mb-8">{t('booking.success')}</p>
        
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-5 bg-muted rounded w-3/4 mx-auto"></div>
            <div className="h-5 bg-muted rounded w-1/2 mx-auto"></div>
          </div>
        ) : event ? (
          <div className="mb-8">
            <p className="text-muted-foreground mb-2">{t('booking.booked_event')}</p>
            <h2 className="text-xl font-bold">{event.name}</h2>
            <p>{new Date(event.date).toLocaleDateString()}</p>
            <p>{event.venue}</p>
          </div>
        ) : null}
        
        <div className="space-x-4">
          <Button onClick={() => navigate('/')}>
            {t('button.home')}
          </Button>
          <Button variant="outline" onClick={() => navigate('/bookings')}>
            {t('booking.my_bookings')}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default BookingSuccessPage;
