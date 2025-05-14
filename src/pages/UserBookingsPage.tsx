
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '@/services/bookingService';
import { useLanguage } from '@/context/LanguageContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Trash2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const UserBookingsPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Fetch user bookings
  const {
    data: bookings = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['userBookings'],
    queryFn: bookingService.getUserBookings,
  });
  
  // Cancel booking mutation
  const cancelBookingMutation = useMutation({
    mutationFn: bookingService.cancelBooking,
    onSuccess: () => {
      // Refetch bookings after cancellation
      queryClient.invalidateQueries({ queryKey: ['userBookings'] });
    },
  });
  
  const handleCancelBooking = (id: string | number) => {
    if (confirm(t('language') === 'en' ? 'Are you sure you want to cancel this booking?' : 'هل أنت متأكد من أنك تريد إلغاء هذا الحجز؟')) {
      cancelBookingMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">{t('booking.my_bookings')}</h1>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-1/3"></div>
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-32"></div>
                    <div className="h-4 bg-muted rounded w-48"></div>
                  </div>
                  <div className="h-9 bg-muted rounded w-24"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto text-center py-10">
          <h1 className="text-3xl font-bold mb-4">{t('booking.my_bookings')}</h1>
          <p className="text-muted-foreground mb-6">
            {t('language') === 'en' 
              ? 'Failed to load bookings. Please try again later.'
              : 'فشل في تحميل الحجوزات. يرجى المحاولة مرة أخرى لاحقًا.'}
          </p>
          <Button onClick={() => navigate('/')}>
            {t('button.home')}
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t('booking.my_bookings')}</h1>
        
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-6">
              {t('language') === 'en' 
                ? 'You have not booked any events yet.'
                : 'لم تقم بحجز أي فعاليات بعد.'}
            </p>
            <Button onClick={() => navigate('/')}>
              {t('button.home')}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <CardTitle>{booking.eventName}</CardTitle>
                  <CardDescription>
                    {t('language') === 'en' ? 'Booked on ' : 'تم الحجز في '} 
                    {new Date(booking.bookingDate).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{new Date(booking.eventDate || '').toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground mt-1">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{booking.eventVenue}</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCancelBooking(booking.id)}
                    disabled={cancelBookingMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t('booking.cancel')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default UserBookingsPage;
