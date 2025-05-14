
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '@/services/bookingService';
import { useLanguage } from '@/context/LanguageContext';
import AdminLayout from './AdminLayout';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const AdminBookings: React.FC = () => {
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  
  const {
    data: bookings = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['allBookings'],
    queryFn: bookingService.getAllBookings,
  });
  
  // Cancel booking mutation
  const cancelBookingMutation = useMutation({
    mutationFn: (id: string | number) => bookingService.cancelBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allBookings'] });
      toast.success(language === 'en' ? 'Booking cancelled successfully' : 'تم إلغاء الحجز بنجاح');
    },
    onError: (error) => {
      console.error('Cancel booking error:', error);
      toast.error(language === 'en' ? 'Failed to cancel booking' : 'فشل في إلغاء الحجز');
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });
  
  const handleCancelBooking = (id: string | number) => {
    if (confirm(language === 'en' ? 'Are you sure you want to cancel this booking?' : 'هل أنت متأكد من أنك تريد إلغاء هذا الحجز؟')) {
      setDeletingId(id);
      cancelBookingMutation.mutate(id);
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold mb-6">{t('admin.view_bookings')}</h1>
        
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-muted rounded"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground mb-4">
              {language === 'en' 
                ? 'Failed to load bookings. Please try again.'
                : 'فشل في تحميل الحجوزات. يرجى المحاولة مرة أخرى.'}
            </p>
            <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['allBookings'] })}>
              {language === 'en' ? 'Retry' : 'إعادة المحاولة'}
            </Button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">
              {language === 'en' 
                ? 'No bookings found.'
                : 'لم يتم العثور على حجوزات.'}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{language === 'en' ? 'User ID' : 'معرف المستخدم'}</TableHead>
                <TableHead>{t('events.name')}</TableHead>
                <TableHead>{t('events.date')}</TableHead>
                <TableHead>{language === 'en' ? 'Booked On' : 'تاريخ الحجز'}</TableHead>
                <TableHead className="text-right">{language === 'en' ? 'Actions' : 'الإجراءات'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.userId}</TableCell>
                  <TableCell className="font-medium">{booking.eventName}</TableCell>
                  <TableCell>{formatDate(booking.eventDate || '')}</TableCell>
                  <TableCell>{formatDate(booking.bookingDate)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCancelBooking(booking.id)}
                      disabled={deletingId === booking.id}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;
