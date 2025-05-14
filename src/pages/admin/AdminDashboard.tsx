
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { eventService } from '@/services/eventService';
import { bookingService } from '@/services/bookingService';
import { useLanguage } from '@/context/LanguageContext';
import AdminLayout from './AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, PlusCircle, Users } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  // Fetch events count
  const {
    data: events = [],
    isLoading: isEventsLoading,
  } = useQuery({
    queryKey: ['events'],
    queryFn: eventService.getAllEvents,
  });
  
  // Fetch bookings count
  const {
    data: bookings = [],
    isLoading: isBookingsLoading,
  } = useQuery({
    queryKey: ['allBookings'],
    queryFn: bookingService.getAllBookings,
  });
  
  const totalEvents = events.length;
  const totalBookings = bookings.length;
  const recentEvents = events.slice(0, 5);
  
  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{t('admin.panel')}</h1>
          <Button onClick={() => navigate('/admin/events/new')}>
            <PlusCircle className="h-4 w-4 mr-2" />
            {t('admin.create_event')}
          </Button>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('language') === 'en' ? 'Total Events' : 'إجمالي الفعاليات'}
              </CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isEventsLoading ? '...' : totalEvents}
              </div>
              <p className="text-xs text-muted-foreground">
                {t('language') === 'en' 
                  ? 'Events listed on your platform'
                  : 'الفعاليات المدرجة على منصتك'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('language') === 'en' ? 'Total Bookings' : 'إجمالي الحجوزات'}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isBookingsLoading ? '...' : totalBookings}
              </div>
              <p className="text-xs text-muted-foreground">
                {t('language') === 'en' 
                  ? 'Bookings made by users'
                  : 'الحجوزات التي قام بها المستخدمون'}
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Events */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">
            {t('language') === 'en' ? 'Recent Events' : 'الفعاليات الأخيرة'}
          </h2>
          
          {isEventsLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-5 bg-muted rounded w-1/3"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : recentEvents.length > 0 ? (
            <div className="space-y-3">
              {recentEvents.map((event) => (
                <Card key={event.id} className="hover:bg-secondary/20 cursor-pointer" onClick={() => navigate(`/admin/events/edit/${event.id}`)}>
                  <CardHeader className="py-3">
                    <CardTitle className="text-md">{event.name}</CardTitle>
                    <CardDescription>
                      {new Date(event.date).toLocaleDateString()} • {event.venue}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-6">
                <p className="text-muted-foreground">
                  {t('language') === 'en' 
                    ? 'No events created yet'
                    : 'لم يتم إنشاء أي فعاليات بعد'}
                </p>
                <Button className="mt-4" onClick={() => navigate('/admin/events/new')}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  {t('admin.create_event')}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Quick Links */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="outline" className="flex-1" onClick={() => navigate('/admin/events')}>
            {t('admin.manage_events')}
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => navigate('/admin/bookings')}>
            {t('admin.view_bookings')}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
